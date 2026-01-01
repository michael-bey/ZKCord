'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '@/lib/buffer-shim'; // Must be imported first to polyfill Buffer with BigInt methods

import { QRCodeSVG } from 'qrcode.react';

function VerifyContent() {
    const searchParams = useSearchParams();
    const nonce = searchParams.get('nonce');
    const [status, setStatus] = useState<'loading' | 'confirm' | 'ready' | 'verifying' | 'success' | 'error' | 'scanned' | 'generating'>('loading');
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Simple mobile detection
        const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobile(mobile);

        if (!nonce) {
            setStatus('error');
            setError('Missing verification nonce. Please return to Discord and run /verify again.');
            return;
        }

        // Fetch user info for confirmation
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`/api/nonce-info?nonce=${nonce}`);
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                    setStatus('confirm');
                } else {
                    const err = await response.json();
                    setStatus('error');
                    setError(err.error || 'Invalid or expired verification link.');
                }
            } catch (e) {
                setStatus('error');
                setError('Failed to validate verification link.');
            }
        };

        fetchUserInfo();
    }, [nonce]);

    const startZkPassport = async () => {
        setStatus('loading');
        const initZkPassport = async () => {
            try {
                // CRITICAL: Patch Buffer with BigInt methods BEFORE importing SDK
                // @aztec/bb.js uses these methods during module evaluation
                if (typeof window !== 'undefined' && window.Buffer) {
                    const BufferProto = window.Buffer.prototype;
                    if (typeof BufferProto.writeBigUInt64BE !== 'function') {
                        BufferProto.writeBigUInt64BE = function (value: bigint, offset: number = 0): number {
                            const hi = Number(value >> BigInt(32));
                            const lo = Number(value & BigInt(0xffffffff));
                            this.writeUInt32BE(hi, offset);
                            this.writeUInt32BE(lo, offset + 4);
                            return offset + 8;
                        };
                    }
                    if (typeof BufferProto.writeBigInt64BE !== 'function') {
                        BufferProto.writeBigInt64BE = function (value: bigint, offset: number = 0): number {
                            return this.writeBigUInt64BE(BigInt.asUintN(64, value), offset);
                        };
                    }
                    if (typeof BufferProto.writeBigUInt64LE !== 'function') {
                        BufferProto.writeBigUInt64LE = function (value: bigint, offset: number = 0): number {
                            const lo = Number(value & BigInt(0xffffffff));
                            const hi = Number(value >> BigInt(32));
                            this.writeUInt32LE(lo, offset);
                            this.writeUInt32LE(hi, offset + 4);
                            return offset + 8;
                        };
                    }
                    if (typeof BufferProto.writeBigInt64LE !== 'function') {
                        BufferProto.writeBigInt64LE = function (value: bigint, offset: number = 0): number {
                            return this.writeBigUInt64LE(BigInt.asUintN(64, value), offset);
                        };
                    }
                    if (typeof BufferProto.readBigUInt64BE !== 'function') {
                        BufferProto.readBigUInt64BE = function (offset: number = 0): bigint {
                            const hi = BigInt(this.readUInt32BE(offset));
                            const lo = BigInt(this.readUInt32BE(offset + 4));
                            return (hi << BigInt(32)) | lo;
                        };
                    }
                    if (typeof BufferProto.readBigInt64BE !== 'function') {
                        BufferProto.readBigInt64BE = function (offset: number = 0): bigint {
                            return BigInt.asIntN(64, this.readBigUInt64BE(offset));
                        };
                    }
                    if (typeof BufferProto.readBigUInt64LE !== 'function') {
                        BufferProto.readBigUInt64LE = function (offset: number = 0): bigint {
                            const lo = BigInt(this.readUInt32LE(offset));
                            const hi = BigInt(this.readUInt32LE(offset + 4));
                            return (hi << BigInt(32)) | lo;
                        };
                    }
                    if (typeof BufferProto.readBigInt64LE !== 'function') {
                        BufferProto.readBigInt64LE = function (offset: number = 0): bigint {
                            return BigInt.asIntN(64, this.readBigUInt64LE(offset));
                        };
                    }
                    console.log('[ZKCord] Buffer BigInt methods patched');
                }

                const { ZKPassport, EU_COUNTRIES, SANCTIONED_COUNTRIES } = await import('@zkpassport/sdk');
                const zkPassport = new ZKPassport();
                const queryBuilder = await zkPassport.request({
                    name: 'ZKCord',
                    logo: 'https://zkcord.vercel.app/logo.png',
                    purpose: 'Securely verify your age and nationality to access exclusive Discord channels.',
                    scope: 'zkcord-verification',
                    devMode: false,
                });

                // Define country groups for role assignment
                // Type assertion needed as SDK expects specific country literals
                const US_COUNTRIES: ('United States')[] = ['United States'];

                // Collect proofs for server-side verification
                const collectedProofs: unknown[] = [];

                const { url, onResult, onError, onRequestReceived, onGeneratingProof, onBridgeConnect, onReject, onProofGenerated } = queryBuilder
                    .gte('age', 18)                                    // Must be 18+
                    .gte('expiry_date', new Date())                    // Passport must not be expired
                    .out('nationality', SANCTIONED_COUNTRIES)          // Exclude sanctioned countries
                    .disclose('firstname')
                    .in('nationality', US_COUNTRIES)                   // Check if US citizen (boolean)
                    .in('nationality', EU_COUNTRIES)                   // Check if EU citizen (boolean)
                    .done();

                setVerifyUrl(url);
                setStatus('ready');

                onBridgeConnect(() => {
                    console.log('✅ Bridge connected');
                });

                onRequestReceived(() => {
                    console.log('📱 Request received (Scanned)');
                    setStatus('scanned');
                });

                onGeneratingProof(() => {
                    console.log('⚙️ Generating proof...');
                    setStatus('generating');
                });

                onProofGenerated((proof) => {
                    console.log('🗳️ Proof generated', proof);
                    collectedProofs.push(proof);
                });

                onReject(() => {
                    console.log('❌ Request rejected');
                    setStatus('error');
                    setError('The verification request was rejected in your mobile app.');
                });

                onResult(async ({ verified, result, uniqueIdentifier }) => {
                    console.log('🏁 Result received:', { verified, uniqueIdentifier, result });
                    if (verified) {
                        setStatus('verifying');
                        try {
                            // Send proofs and queryResult to server for verification
                            // Server will verify proofs independently (security best practice)
                            const response = await fetch('/api/verify-result', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    nonce,
                                    proofs: collectedProofs,
                                    queryResult: result,
                                    uniqueIdentifier,
                                }),
                            });

                            if (response.ok) {
                                setStatus('success');
                            } else {
                                const errData = await response.json();
                                setStatus('error');
                                setError(errData.error || 'Failed to update your status on Discord.');
                            }
                        } catch (fetchErr) {
                            console.error('Fetch Error:', fetchErr);
                            setStatus('error');
                            setError('A connection error occurred during verification.');
                        }
                    } else {
                        console.error('❌ Proof verification failed');
                        setStatus('error');
                        setError('Verification proof failed. Please ensure you are using a valid, non-expired passport from a non-sanctioned country.');
                    }
                });

                onError((err) => {
                    console.error('ZkPassport Error:', err);
                    setStatus('error');
                    setError(typeof err === 'string' ? err : 'An error occurred while communicating with ZK Passport.');
                });

                // On mobile, auto-redirect to app
                if (isMobile) {
                    setTimeout(() => {
                        window.location.href = url;
                    }, 1000);
                }

            } catch (err) {
                console.error('Initialization Error:', err);
                setStatus('error');
                setError('Failed to initialize the ZK Passport SDK.');
            }
        };

        initZkPassport();
    };

    return (
        <div className="verify-container glass animate-fade-in">
            <div className="logo-section">
                <Image src="/logo.png" alt="ZKCord" width={80} height={80} className="logo" />
            </div>

            <div className="status-box">
                {status === 'loading' && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Initializing...</p>
                    </div>
                )}

                {status === 'confirm' && (
                    <div className="confirm-state animate-slide-up">
                        <h1>Confirm Your Identity</h1>
                        <p className="subtitle">You are verifying as:</p>
                        <div className="username-badge">
                            <span className="at">@</span>{username}
                        </div>
                        <p className="confirm-warning">Make sure this is your Discord account before continuing.</p>
                        <div className="confirm-actions">
                            <button className="btn-primary" onClick={startZkPassport}>Continue to Verify</button>
                            <button className="btn-cancel" onClick={() => window.close()}>Cancel</button>
                        </div>
                    </div>
                )}

                {status === 'ready' && (
                    <div className="ready-state animate-slide-up">
                        {isMobile ? (
                            <>
                                <h1>Verification Flow</h1>
                                <div className="spinner"></div>
                                <p>Starting ZK Passport...</p>
                                <span>Redirecting you to the app.</span>
                                <div className="actions">
                                    <a href={verifyUrl!} className="btn-primary">Open App Manually</a>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1>Verify with ZK Passport</h1>
                                <p className="subtitle">Scan the QR code below with your phone to prove your age and nationality privately.</p>
                                <div className="qr-container">
                                    {verifyUrl && (
                                        <QRCodeSVG
                                            value={verifyUrl}
                                            size={200}
                                            level="L"
                                            includeMargin={false}
                                            className="qr-code"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    )}
                                </div>
                                <div className="steps">
                                    <div className="step">
                                        <span className="step-num">1</span>
                                        <p>Open <b>ZKPassport</b> app</p>
                                    </div>
                                    <div className="step">
                                        <span className="step-num">2</span>
                                        <p>Scan the code above</p>
                                    </div>
                                    <div className="step">
                                        <span className="step-num">3</span>
                                        <p>Verify privately</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {status === 'scanned' && (
                    <div className="loading-state animate-pulse">
                        <div className="icon">📱</div>
                        <p>Request Scanned!</p>
                        <span>Follow instructions on your phone.</span>
                    </div>
                )}

                {status === 'generating' && (
                    <div className="loading-state">
                        <div className="spinner pulse"></div>
                        <p>Generating Proof...</p>
                        <span>This stays on your device.</span>
                    </div>
                )}

                {status === 'verifying' && (
                    <div className="loading-state">
                        <div className="spinner pulse"></div>
                        <p>Finalizing Verification...</p>
                        <span>Updating your Discord roles.</span>
                    </div>
                )}

                {status === 'success' && (
                    <div className="success-message animate-slide-up">
                        <div className="icon">✅</div>
                        <h2>Verified Successfully</h2>
                        <p className="success-text">Your roles have been granted. You can now close this window and return to Discord.</p>
                        <button className="btn-close" onClick={() => window.close()}>Close Window</button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="error-message animate-slide-up">
                        <div className="icon">⚠️</div>
                        <h2>Verification Error</h2>
                        <p className="error-text">{error}</p>
                        <button className="btn-retry" onClick={() => window.location.reload()}>Retry Verification</button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .verify-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    max-width: 500px;
                    width: 90%;
                    margin: 8vh auto;
                    padding: 3rem;
                    text-align: center;
                    min-height: 500px;
                }

                .logo-section {
                    margin-bottom: 2rem;
                    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2));
                }

                h1 {
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                }

                .subtitle {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin-bottom: 2rem;
                }

                .status-box {
                    width: 100%;
                }

                .qr-container {
                    background: white;
                    padding: 1rem;
                    border-radius: 16px;
                    display: inline-block;
                    margin-bottom: 2rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .steps {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .step {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .step-num {
                    width: 24px;
                    height: 24px;
                    background: var(--accent);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .step p {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                .loading-state p {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 1.5rem 0 0.5rem;
                }

                .loading-state span {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.9rem;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(139, 92, 246, 0.1);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }

                .pulse {
                    animation: pulse 1.5s ease-in-out infinite;
                }

                .icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .actions {
                    margin-top: 2rem;
                }

                .btn-primary, .btn-close, .btn-retry {
                    display: inline-block;
                    background: var(--accent);
                    color: white;
                    border: none;
                    text-decoration: none;
                    padding: 0.8rem 2rem;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                }

                .btn-primary:hover, .btn-close:hover, .btn-retry:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
                }

                .success-message h2, .error-message h2 {
                    margin-bottom: 1rem;
                }

                .success-text, .error-text {
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.5;
                    margin-bottom: 2rem;
                }

                .success-message .btn-close, .error-message .btn-retry {
                    margin-top: 0.5rem;
                }

                .username-badge {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(88, 101, 242, 0.2));
                    border: 1px solid rgba(139, 92, 246, 0.4);
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 1.5rem 0;
                    display: inline-block;
                }

                .username-badge .at {
                    color: var(--accent);
                    margin-right: 2px;
                }

                .confirm-warning {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.85rem;
                    margin-bottom: 2rem;
                }

                .confirm-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                    margin-top: 0.5rem;
                }

                .btn-cancel {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.6);
                    padding: 0.6rem 1.5rem;
                    border-radius: 50px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-cancel:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                .animate-pulse { animation: pulse 2s infinite; }
            `}</style>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="loading-state"><div className="spinner"></div></div>}>
            <VerifyContent />
        </Suspense>
    );
}

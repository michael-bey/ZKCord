'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

function VerifyContent() {
    const searchParams = useSearchParams();
    const nonce = searchParams.get('nonce');
    const [status, setStatus] = useState<'loading' | 'ready' | 'verifying' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!nonce) {
            setStatus('error');
            setError('Missing verification nonce. Please return to Discord and run /verify again.');
            return;
        }

        const initZkPassport = async () => {
            try {
                const { ZKPassport } = await import('@zkpassport/sdk');
                const zkPassport = new ZKPassport();
                const queryBuilder = await zkPassport.request({
                    name: 'ZKCord',
                    logo: 'https://zkcord.vercel.app/logo.png', // Replace with actual production URL
                    purpose: 'Securely verify your age and nationality to access exclusive Discord channels.',
                    scope: 'zkcord-verification',
                    devMode: true,
                });

                const { url, onResult, onError } = queryBuilder
                    .gte('age', 18)
                    .disclose('firstname')
                    .disclose('nationality')
                    .done();

                onResult(async ({ verified, result, uniqueIdentifier }) => {
                    if (verified) {
                        setStatus('verifying');
                        try {
                            const response = await fetch('/api/verify-result', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    nonce,
                                    verified,
                                    uniqueIdentifier,
                                    firstname: result.firstname?.disclose?.result,
                                    nationality: result.nationality?.disclose?.result,
                                }),
                            });

                            if (response.ok) {
                                setStatus('success');
                            } else {
                                const errData = await response.json();
                                setStatus('error');
                                setError(errData.error || 'Failed to update your status on Discord.');
                            }
                        } catch {
                            setStatus('error');
                            setError('A connection error occurred during verification.');
                        }
                    } else {
                        setStatus('error');
                        setError('Verification proof failed. Please try again.');
                    }
                });

                onError((err) => {
                    console.error('ZkPassport Error:', err);
                    setStatus('error');
                    setError('An error occurred while communicating with ZK Passport.');
                });

                // Automatic redirect after a brief delay if in loading state
                setTimeout(() => {
                    window.location.href = url;
                }, 1500);

            } catch (err) {
                console.error('Initialization Error:', err);
                setStatus('error');
                setError('Failed to initialize the ZK Passport SDK.');
            }
        };

        initZkPassport();
    }, [nonce]);

    return (
        <div className="verify-container glass animate-fade-in">
            <div className="logo-section">
                <Image src="/logo.png" alt="ZKCord" width={80} height={80} className="logo" />
            </div>

            <h1>Verification Flow</h1>

            <div className="status-box">
                {status === 'loading' && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Starting ZK Passport...</p>
                        <span>You will be redirected to the app automatically.</span>
                    </div>
                )}

                {status === 'verifying' && (
                    <div className="loading-state">
                        <div className="spinner pulse"></div>
                        <p>Securing your identity...</p>
                        <span>Finalizing roles with Discord.</span>
                    </div>
                )}

                {status === 'success' && (
                    <div className="success-message animate-slide-up">
                        <div className="icon">✅</div>
                        <h2>Verified Successfully</h2>
                        <p>Your roles have been granted. You can now close this window and return to Discord.</p>
                        <button className="btn-close" onClick={() => window.close()}>Close Window</button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="error-message animate-slide-up">
                        <div className="icon">⚠️</div>
                        <h2>Verification Error</h2>
                        <p>{error}</p>
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
                    margin: 10vh auto;
                    padding: 3rem;
                    text-align: center;
                    min-height: 400px;
                }

                .logo-section {
                    margin-bottom: 2rem;
                    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2));
                }

                h1 {
                    font-size: 1.8rem;
                    margin-bottom: 2rem;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                }

                .status-box {
                    width: 100%;
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

                .success-message h2 { color: #4ade80; margin-bottom: 1rem; }
                .error-message h2 { color: #f87171; margin-bottom: 1rem; }

                .success-message p, .error-message p {
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                .btn-close, .btn-retry {
                    background: var(--accent);
                    color: white;
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .btn-close:hover, .btn-retry:hover {
                    transform: translateY(-2px);
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

                .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
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

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyContent() {
    const searchParams = useSearchParams();
    const nonce = searchParams.get('nonce');
    const [status, setStatus] = useState<'loading' | 'ready' | 'verifying' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!nonce) {
            setStatus('error');
            setError('Missing verification nonce. Please go back to Discord and run /verify again.');
            return;
        }

        const initZkPassport = async () => {
            try {
                const { ZKPassport } = await import('@zkpassport/sdk');
                const zkPassport = new ZKPassport();
                const queryBuilder = await zkPassport.request({
                    name: 'ZKcord',
                    logo: 'https://zkcord.id/logo.png', // Placeholder for now
                    purpose: 'Verify you are over 18 and check your nationality to access specific Discord channels.',
                    scope: 'zkcord-verification',
                    devMode: true, // Enable dev mode for PoC
                });

                const { url, onResult, onError } = queryBuilder
                    .gte('age', 18)
                    .disclose('firstname')
                    .disclose('nationality')
                    .done();

                // Automatically open the ZkPassport link if possible, or show a button
                // For this PoC, we will show the UI that ZkPassport provides or just redirect

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
                                setStatus('error');
                                setError('Failed to update your status on Discord. Please try again.');
                            }
                        } catch (e) {
                            setStatus('error');
                            setError('An error occurred during verification.');
                        }
                    } else {
                        setStatus('error');
                        setError('Verification failed. Please try again.');
                    }
                });

                onError((err) => {
                    console.error('ZkPassport Error:', err);
                    setStatus('error');
                    setError('An error occurred with ZkPassport.');
                });

                // Redirect to the ZkPassport app URL
                window.location.href = url;
            } catch (err) {
                console.error('Initialization Error:', err);
                setStatus('error');
                setError('Failed to initialize ZkPassport.');
            }
        };

        initZkPassport();
    }, [nonce]);

    return (
        <div className="verify-container">
            <h1>ZKcord Verification</h1>
            {status === 'loading' && <p>Initializing ZKcord...</p>}
            {status === 'verifying' && <p>Verification successful! Updating Discord...</p>}
            {status === 'success' && (
                <div className="success-message">
                    <h2>Success!</h2>
                    <p>You have been verified. You can now close this window and return to Discord.</p>
                </div>
            )}
            {status === 'error' && (
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            )}
            <style jsx>{`
        .verify-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          text-align: center;
          font-family: sans-serif;
        }
        h1 { margin-bottom: 20px; }
        .success-message { color: #2e7d32; }
        .error-message { color: #d32f2f; }
      `}</style>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}

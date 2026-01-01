'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminGuide() {
    return (
        <div className="container">
            <Head>
                <title>ZKCord | Server Admin Guide</title>
                <meta name="description" content="Quickstart guide for Discord Server Admins to set up ZKCord." />
            </Head>

            <nav className="nav">
                <Link href="/" className="nav-logo">
                    <Image
                        src="/logo.png"
                        alt="ZKCord Logo"
                        width={40}
                        height={40}
                        className="logo-image"
                    />
                    <span className="logo-text">ZKCord</span>
                </Link>
            </nav>

            <main className="main">
                <div className="guide-header">
                    <h1 className="title">Server Admin <span className="highlight">Guide</span></h1>
                    <p className="subtitle">
                        Get your server verified in minutes. Follow these simple steps to configure ZKCord for your community.
                    </p>
                </div>

                <div className="steps-container glass">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Invite the Bot</h3>
                            <p>Add ZKCord to your Discord server using the invite link.</p>
                            <button
                                className="btn-secondary"
                                onClick={() => window.open('https://discord.com/api/oauth2/authorize?client_id=1323398337838579803&permissions=268435456&scope=bot%20applications.commands', '_blank')}
                            >
                                Invite Bot
                            </button>
                        </div>
                    </div>

                    <div className="step-divider"></div>

                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Configure Roles</h3>
                            <p>Run the <code>/setup</code> command in your server to link roles.</p>
                            <div className="code-block">
                                <code>/setup verified_role:@Verified portal_channel:#verify</code>
                            </div>
                            <p className="note">You can also configure Country roles using <code>/add-country-role</code>.</p>
                        </div>
                    </div>

                    <div className="step-divider"></div>

                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Add Country Rules</h3>
                            <p>Link specific countries or regions to roles (Optional).</p>
                            <div className="code-block">
                                <code>/add-country-role country:Brazil role:@Brazilian</code>
                            </div>
                            <div className="code-block">
                                <code>/add-country-role country:LATAM role:@Latino</code>
                            </div>
                        </div>
                    </div>

                    <div className="step-divider"></div>

                    <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Extended Verification</h3>
                            <p>Verify gender and age attributes (Optional).</p>
                            <div className="code-block">
                                <code>/add-gender-role gender:Male role:@Gentlemen</code>
                            </div>
                            <div className="code-block">
                                <code>/add-age-role minimum_age:18+ role:@Adult</code>
                            </div>
                        </div>
                    </div>

                    <div className="step-divider"></div>

                    <div className="step">
                        <div className="step-number">5</div>
                        <div className="step-content">
                            <h3>Launch Portal</h3>
                            <p>Run <code>/portal</code> to post the verification panel.</p>
                            <div className="code-block">
                                <code>/portal</code>
                            </div>
                            <p className="note">The bot will post the "Start Verification" embed to your configured channel.</p>
                        </div>
                    </div>
                </div>

                <div className="back-link">
                    <Link href="/">← Back to Home</Link>
                </div>
            </main>

            <style jsx>{`
        .container {
            min-height: 100vh;
            max-width: 900px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .nav {
            padding: 2rem 0;
        }

        .nav-logo {
            display: flex;
            align-items: center;
            gap: 1rem;
            text-decoration: none;
            color: white;
            font-weight: 700;
            font-size: 1.25rem;
        }

        .main {
            padding-top: 4rem;
            padding-bottom: 6rem;
        }

        .guide-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .title {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.1;
        }

        .highlight {
            color: var(--accent);
            background: linear-gradient(135deg, var(--accent) 0%, #d946ef 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.6);
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .glass {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 3rem;
        }

        .step {
            display: flex;
            gap: 2rem;
            padding: 1rem 0;
        }

        .step-number {
            flex-shrink: 0;
            width: 48px;
            height: 48px;
            background: var(--accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        }

        .step-content {
            flex: 1;
        }

        .step-content h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .step-content p {
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin-bottom: 1rem;
        }

        .step-divider {
            width: 2px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            margin: 0.5rem 0 0.5rem 24px;
        }

        .code-block {
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 0.5rem;
        }

        .code-block code {
            font-family: 'SF Mono', Menlo, Monaco, monospace;
            color: #a5b4fc;
        }

        .note {
            font-size: 0.85rem !important;
            color: rgba(255, 255, 255, 0.4) !important;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--accent);
        }

        .back-link {
            text-align: center;
            margin-top: 3rem;
        }

        .back-link a {
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
            transition: color 0.2s;
        }

        .back-link a:hover {
            color: white;
        }

        @media (max-width: 768px) {
            .step {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
            
            .step-number {
                margin: 0 auto;
            }
            
            .step-divider {
                display: none;
            }

            .title {
                font-size: 2.5rem;
            }
        }
      `}</style>
        </div>
    );
}

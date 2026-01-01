'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="container">
      <Head>
        <title>ZKCord | Privacy-Preserving Verification</title>
        <meta name="description" content="Verify your age and nationality privately with ZKCord and ZK Passport." />
      </Head>

      <main className="main">
        <section className="hero">
          <div className="logo-wrapper animate-fade-in">
            <Image
              src="/logo.png"
              alt="ZKCord Logo"
              width={120}
              height={120}
              className="logo-image"
              priority
            />
          </div>

          <h1 className="title animate-slide-up">
            Verify <span className="highlight">Privately</span>. <br />
            Join <span className="highlight">Securely</span>.
          </h1>

          <p className="description animate-slide-up-delayed">
            The most advanced way to verify your identity on platforms.
            Powered by ZK Proofs, built for total privacy.
          </p>

          <div className="cta-group animate-slide-up-more">
            <button className="btn-primary" onClick={() => window.open('https://discord.com/api/oauth2/authorize?client_id=1456016871017943112&permissions=268435456&scope=bot%20applications.commands', '_blank')}>
              Invite to Discord
            </button>
            <button className="btn-secondary" onClick={() => setShowDemo(!showDemo)}>
              {showDemo ? 'Hide Demo' : 'See How It Works'}
            </button>
          </div>
        </section>

        {showDemo && (
          <section className="docs-section animate-fade-in">
            {/* Section Header */}
            <div className="docs-header">
              <h2 className="docs-title">How ZKCord Works</h2>
              <p className="docs-subtitle">
                A breakthrough in privacy-preserving identity verification, powered by zero-knowledge cryptography.
              </p>
            </div>

            {/* Overview Flow */}
            <div className="flow-container glass">
              <div className="flow-step">
                <div className="flow-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="7" cy="14" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <h4>Your Passport</h4>
                <p>Stays encrypted on your device. Contains a government digital signature.</p>
              </div>
              <div className="flow-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flow-step">
                <div className="flow-icon accent">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h4>ZK Proof Generated</h4>
                <p>Advanced cryptography creates a mathematical proof on your phone.</p>
              </div>
              <div className="flow-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flow-step">
                <div className="flow-icon success">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <h4>Verified</h4>
                <p>Server validates the proof. Your roles are granted instantly.</p>
              </div>
            </div>

            {/* What We See vs Don't See */}
            <div className="comparison-section">
              <h3 className="section-label">Privacy Guarantee</h3>
              <h2 className="section-title">What We See vs. What We Don't</h2>
              <div className="comparison-grid">
                <div className="comparison-card glass verified">
                  <div className="card-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>What ZKCord Receives</span>
                  </div>
                  <ul>
                    <li>✓ "User is 18 or older"</li>
                    <li>✓ "Passport is not expired"</li>
                    <li>✓ "Not from sanctioned country"</li>
                    <li>✓ Your nationality (for role assignment)</li>
                    <li>✓ Cryptographic proof of validity</li>
                  </ul>
                </div>
                <div className="comparison-card glass hidden-data">
                  <div className="card-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4" y1="4" x2="20" y2="20" />
                    </svg>
                    <span>What ZKCord Never Sees</span>
                  </div>
                  <ul>
                    <li>✗ Your actual date of birth</li>
                    <li>✗ Your passport number</li>
                    <li>✗ Your photo or biometrics</li>
                    <li>✗ Your address or place of birth</li>
                    <li>✗ Any raw passport data</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Deep Dive */}
            <div className="technical-section glass">
              <h3 className="section-label">Under the Hood</h3>
              <h2 className="section-title">Cryptographic Guarantees</h2>

              <div className="tech-grid">
                <div className="tech-item">
                  <div className="tech-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="tech-content">
                    <h4>Government-Signed Credentials</h4>
                    <p>Modern passports contain a cryptographic signature from your government, verified using public certificates. The ZK proof validates this signature without exposing your data.</p>
                  </div>
                </div>

                <div className="tech-item">
                  <div className="tech-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <div className="tech-content">
                    <h4>Zero-Knowledge Proofs (ZK-SNARKs)</h4>
                    <p>A mathematical technique that proves a statement is true without revealing why. You can prove you're 18+ without disclosing your birthdate, and the math makes it impossible to fake.</p>
                  </div>
                </div>

                <div className="tech-item">
                  <div className="tech-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="tech-content">
                    <h4>Server-Side Verification</h4>
                    <p>Your proof is verified twice: first on your device, then independently on our servers. This prevents any client-side tampering because we never trust, we always verify.</p>
                  </div>
                </div>

                <div className="tech-item">
                  <div className="tech-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-5.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93" />
                    </svg>
                  </div>
                  <div className="tech-content">
                    <h4>Sybil Resistance</h4>
                    <p>A unique, privacy-preserving identifier binds each passport to only one Discord account. One person, one verification. This prevents abuse while protecting your identity.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="code-section glass">
              <div className="code-header">
                <span className="code-dot red"></span>
                <span className="code-dot yellow"></span>
                <span className="code-dot green"></span>
                <span className="code-title">ZKPassport SDK</span>
              </div>
              <pre className="code-block">
                <code>{`// Verification happens entirely on the user's device
const queryBuilder = await zkPassport.request({
  name: 'ZKCord',
  purpose: 'Verify age and nationality privately'
});

const { url, onResult } = queryBuilder
  .gte('age', 18)                    // Must be 18+
  .gte('expiry_date', new Date())    // Not expired
  .out('nationality', SANCTIONED)    // Exclude sanctioned
  .disclose('nationality')           // For role assignment
  .done();

// Only the cryptographic PROOF is sent to our servers
// Your passport data never leaves your phone`}</code>
              </pre>
            </div>

            {/* Trust Footer */}
            <div className="trust-footer">
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>End-to-end encrypted</span>
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>Verification in seconds</span>
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
                <span>Open source & auditable</span>
              </div>
            </div>
          </section>
        )}

        <section className="features grid">
          <div className="feature-card glass animate-fade-in">
            <div className="feature-icon">🛡️</div>
            <h3>Privacy First</h3>
            <p>Your sensitive data never hits any server. We only receive a cryptographic "Proof" that you satisfy requirements.</p>
          </div>

          <div className="feature-card glass animate-fade-in">
            <div className="feature-icon">⚖️</div>
            <h3>Zero Knowledge</h3>
            <p>ZK Proofs allow us to verify your age without knowing your date of birth, or your location without knowing your address.</p>
          </div>

          <div className="feature-card glass animate-fade-in">
            <div className="feature-icon">💎</div>
            <h3>Premium UX</h3>
            <p>Seamless integration with the ZK Passport app. Verified in seconds with just a QR scan.</p>
          </div>

          <div className="feature-card glass animate-fade-in">
            <div className="feature-icon">🚫</div>
            <h3>Sybil Resistant</h3>
            <p>Advanced identifier-binding prevents users from verifying multiple accounts with the same identity.</p>
          </div>
        </section>
      </main>

      <section className="download-section animate-fade-in">
        <div className="download-card glass">
          <div className="download-content">
            <h2 className="section-title">Get the App</h2>
            <p className="description">
              Download ZKPassport to verify your identity and manage your private credentials.
            </p>
            <div className="store-buttons">
              <a
                href="https://apps.apple.com/us/app/zkpassport/id6449170258"
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.74-3.03 1.58-.67.77-1.24 2-1.07 3.12 1.17.09 2.33-.73 3.03-1.59" /></svg>
                <span>App Store</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=id.zkpassport"
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91,3.34,2.39,3.84,2.15L13.69,12L3.84,21.85C3.34,21.6,3,21.09,3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08,20.75,11.5,20.75,12C20.75,12.5,20.5,12.92,20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                <span>Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </section>


      <footer className="footer">
        <div className="footer-content">
          <span>&copy; 2024 ZKCord</span>
          <div className="divider"></div>
          <Link href="/admin-guide">Server Admin Guide</Link>
          <div className="divider"></div>
          <span>Powered by <a href="https://zkpassport.id" target="_blank" rel="noopener noreferrer">ZK Passport</a></span>
        </div>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .main {
          padding-top: 8rem;
          padding-bottom: 4rem;
        }

        .hero {
          text-align: center;
          margin-bottom: 6rem;
        }

        .logo-wrapper {
          margin-bottom: 2rem;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.3));
        }

        .title {
          font-size: 4.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .highlight {
          color: var(--accent);
          background: linear-gradient(135deg, var(--accent) 0%, #d946ef 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .description {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        .cta-group {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .btn-primary {
          background: var(--accent);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent);
        }

        .glass {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 24px;
        }

        /* Docs Section - Apple Style */
        .docs-section {
          margin-bottom: 6rem;
        }

        .docs-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .docs-title {
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }

        .docs-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .section-label {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        /* Flow Diagram */
        .flow-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 3rem 2rem;
          margin-bottom: 4rem;
        }

        .flow-step {
          flex: 1;
          max-width: 220px;
          text-align: center;
        }

        .flow-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s;
        }

        .flow-icon.accent {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(217, 70, 239, 0.2));
          color: var(--accent);
        }

        .flow-icon.success {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .flow-step:hover .flow-icon {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }

        .flow-step h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .flow-step p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.5;
        }

        .flow-arrow {
          color: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        /* Comparison Section */
        .comparison-section {
          text-align: center;
          margin-bottom: 4rem;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .comparison-card {
          padding: 2rem;
          text-align: left;
        }

        .comparison-card.verified {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .comparison-card.hidden-data {
          border-color: rgba(239, 68, 68, 0.3);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .comparison-card.verified .card-header {
          color: #22c55e;
        }

        .comparison-card.hidden-data .card-header {
          color: #ef4444;
        }

        .comparison-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .comparison-card li {
          padding: 0.6rem 0;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .comparison-card li:last-child {
          border-bottom: none;
        }

        /* Technical Section */
        .technical-section {
          padding: 3rem;
          margin-bottom: 3rem;
        }

        .technical-section .section-label,
        .technical-section .section-title {
          text-align: center;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .tech-item {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s;
        }

        .tech-item:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-2px);
        }

        .tech-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(79, 70, 229, 0.15));
          border-radius: 12px;
          color: var(--accent);
        }

        .tech-content h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .tech-content p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
        }

        /* Code Section */
        .code-section {
          overflow: hidden;
          margin-bottom: 3rem;
        }

        .code-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .code-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .code-dot.red { background: #ff5f56; }
        .code-dot.yellow { background: #ffbd2e; }
        .code-dot.green { background: #27ca40; }

        .code-title {
          margin-left: 0.75rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .code-block {
          padding: 1.5rem;
          margin: 0;
          overflow-x: auto;
          background: rgba(0, 0, 0, 0.2);
        }

        .code-block code {
          font-family: 'SF Mono', Menlo, Monaco, 'Courier New', monospace;
          font-size: 0.85rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Trust Footer */
        .trust-footer {
          display: flex;
          justify-content: center;
          gap: 3rem;
          padding: 2rem 0;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .trust-item svg {
          color: var(--accent);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .flow-container {
            flex-direction: column;
            gap: 1rem;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }

          .comparison-grid {
            grid-template-columns: 1fr;
          }

          .tech-grid {
            grid-template-columns: 1fr;
          }

          .trust-footer {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .docs-title {
            font-size: 2rem;
          }
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2.5rem;
          transition: transform 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: var(--accent);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        .footer {
          padding: 4rem 0;
          border-top: 1px solid var(--card-border);
          margin-top: 6rem;
        }

        .footer-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .divider {
          width: 1px;
          height: 20px;
          background: var(--card-border);
        }

        .footer a {
          color: var(--accent);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
        .animate-slide-up-delayed { animation: slideUp 0.8s ease-out 0.2s forwards; opacity: 0; }
        .animate-slide-up-more { animation: slideUp 0.8s ease-out 0.4s forwards; opacity: 0; }

        /* Download Section */
        .download-section {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
          margin-bottom: 4rem;
        }

        .download-card {
          padding: 4rem 2rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
        }

        .download-content .description {
          margin-bottom: 2.5rem;
        }

        .store-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .store-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          color: black;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }

        .store-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.15);
        }

        .store-btn svg {
          width: 24px;
          height: 24px;
        }

        @media (max-width: 768px) {
          .title { font-size: 3rem; }
          .store-buttons { flex-direction: column; align-items: center; }
          .store-btn { width: 100%; justify-content: center; max-width: 280px; }
        }
      `}</style>
    </div>
  );
}

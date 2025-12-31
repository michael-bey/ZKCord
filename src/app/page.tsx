'use client';

import Head from 'next/head';
import Image from 'next/image';
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
            <button className="btn-primary" onClick={() => window.open('https://discord.com', '_blank')}>
              Invite to Discord
            </button>
            <button className="btn-secondary" onClick={() => setShowDemo(!showDemo)}>
              {showDemo ? 'Hide Demo' : 'See How It Works'}
            </button>
          </div>
        </section>

        {showDemo && (
          <section className="demo-section animate-fade-in">
            <div className="demo-card glass">
              <h2>Behind the Scenes</h2>
              <p className="demo-text">
                Normally, verification means sharing your ID. With ZKCord, you never share your document.
              </p>

              <div className="demo-visual">
                <div className="demo-step">
                  <div className="step-icon">📄</div>
                  <span>Your Passport</span>
                  <p>Encrypted on your device</p>
                </div>
                <div className="step-arrow">→</div>
                <div className="demo-step">
                  <div className="step-icon">🧩</div>
                  <span>ZK Proof</span>
                  <p>Cryptographic "Yes/No" result</p>
                </div>
                <div className="step-arrow">→</div>
                <div className="demo-step">
                  <div className="step-icon">🤖</div>
                  <span>Verified</span>
                  <p>Granted roles without ID data</p>
                </div>
              </div>

              <div className="demo-technical glass">
                <h3>The Technical Magic</h3>
                <code>
                  {`const proof = await zk.generateProof(passport, {`} <br />
                  &nbsp;&nbsp;age: GTE(18), <br />
                  &nbsp;&nbsp;disclose: ['nationality'] <br />
                  {`});`}
                </code>
                <p>Only the "Proof of Validity" is sent to ZKCord servers. Your actual passport never leaves your phone.</p>
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

      <footer className="footer">
        <div className="footer-content">
          <span>&copy; 2024 ZKCord</span>
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

        .demo-section {
          margin-bottom: 6rem;
        }

        .demo-card {
          padding: 4rem;
          text-align: center;
        }

        .demo-card h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .demo-text {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 3rem;
        }

        .demo-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .demo-step {
          flex: 1;
          max-width: 200px;
        }

        .step-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .demo-step span {
          display: block;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .demo-step p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .step-arrow {
          font-size: 2rem;
          color: var(--accent);
          opacity: 0.5;
        }

        .demo-technical {
          padding: 2rem;
          text-align: left;
        }

        .demo-technical code {
          display: block;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          margin-bottom: 1rem;
          color: var(--accent);
          font-family: 'Courier New', Courier, monospace;
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

        @media (max-width: 768px) {
          .title { font-size: 3rem; }
          .demo-visual { flex-direction: column; }
          .step-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
}

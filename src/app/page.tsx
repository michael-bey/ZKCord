'use client';

import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>ZKcord | Privacy-Preserving Discord Verification</title>
        <meta name="description" content="Verify your age and nationality privately with ZKcord and ZkPassport." />
      </Head>

      <main className="main">
        <div className="hero">
          <div className="logo-container">
            {/* Using the generated logo if it were a public URL or local asset */}
            <div className="placeholder-logo">ZK</div>
          </div>
          <h1 className="title">Welcome to <span className="highlight">ZKcord</span></h1>
          <p className="description">
            The most private way to verify your identity on Discord.
          </p>

          <div className="grid">
            <div className="card">
              <h3>Zero Knowledge &rarr;</h3>
              <p>Verify your age and nationality without sharing your sensitive documents with anyone.</p>
            </div>

            <div className="card">
              <h3>Secure &rarr;</h3>
              <p>Built on top of ZkPassport, ensuring your cryptographic proofs are valid and untamperable.</p>
            </div>

            <div className="card">
              <h3>Simple &rarr;</h3>
              <p>Just scan a QR code with your ZkPassport app and get verified in seconds.</p>
            </div>

            <div className="card">
              <h3>Sybil Proof &rarr;</h3>
              <p>Unique identifiers prevent multiple Discord accounts from being verified with the same ID.</p>
            </div>
          </div>

          <div className="cta">
            <p>To get started, invite the ZKcord bot to your server and run <code>/verify</code>.</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        Powered by <a href="https://zkpassport.id" target="_blank" rel="noopener noreferrer">ZkPassport</a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #0a0a0a;
          color: #ededed;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        .main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .hero {
          text-align: center;
          max-width: 800px;
        }

        .logo-container {
          margin-bottom: 2rem;
        }

        .placeholder-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          font-weight: bold;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .highlight {
          color: #8b5cf6;
          background: linear-gradient(to right, #8b5cf6, #d946ef);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          margin-top: 1rem;
          color: #a1a1aa;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #27272a;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 45%;
          background: #18181b;
        }

        .card:hover,
        .card:focus,
        .card:active {
          border-color: #8b5cf6;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          color: #f4f4f5;
        }

        .card p {
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.5;
          color: #a1a1aa;
        }

        .cta {
          margin-top: 4rem;
          padding: 2rem;
          border-radius: 15px;
          background: #27272a;
          border: 1px dashed #52525b;
        }

        .cta code {
          background: #000;
          padding: 0.2rem 0.5rem;
          border-radius: 5px;
          color: #8b5cf6;
        }

        .footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #27272a;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
          color: #8b5cf6;
          margin-left: 0.5rem;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
          .card {
            width: 100%;
          }
          .title {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}

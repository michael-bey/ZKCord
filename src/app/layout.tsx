import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZKCord | Privacy-Preserving Verification",
  description: "Secure, zero-knowledge identity verification for modern communities.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

// Inline Buffer polyfill that adds BigInt methods (writeBigUInt64BE, etc.)
// This MUST run before any module that uses these methods
const bufferPolyfillScript = `
(function() {
  if (typeof window === 'undefined') return;
  
  // Wait for Buffer to be available, then patch it
  function patchBuffer() {
    var Buffer = window.Buffer;
    if (!Buffer || !Buffer.prototype) {
      // Buffer not loaded yet, try again
      setTimeout(patchBuffer, 0);
      return;
    }
    
    // Add BigInt write methods
    if (typeof Buffer.prototype.writeBigUInt64BE !== 'function') {
      Buffer.prototype.writeBigUInt64BE = function(value, offset) {
        offset = offset || 0;
        var hi = Number(value >> BigInt(32));
        var lo = Number(value & BigInt(0xffffffff));
        this.writeUInt32BE(hi, offset);
        this.writeUInt32BE(lo, offset + 4);
        return offset + 8;
      };
    }
    
    if (typeof Buffer.prototype.writeBigInt64BE !== 'function') {
      Buffer.prototype.writeBigInt64BE = function(value, offset) {
        return this.writeBigUInt64BE(BigInt.asUintN(64, value), offset);
      };
    }
    
    if (typeof Buffer.prototype.writeBigUInt64LE !== 'function') {
      Buffer.prototype.writeBigUInt64LE = function(value, offset) {
        offset = offset || 0;
        var lo = Number(value & BigInt(0xffffffff));
        var hi = Number(value >> BigInt(32));
        this.writeUInt32LE(lo, offset);
        this.writeUInt32LE(hi, offset + 4);
        return offset + 8;
      };
    }
    
    if (typeof Buffer.prototype.writeBigInt64LE !== 'function') {
      Buffer.prototype.writeBigInt64LE = function(value, offset) {
        return this.writeBigUInt64LE(BigInt.asUintN(64, value), offset);
      };
    }
    
    // Add BigInt read methods
    if (typeof Buffer.prototype.readBigUInt64BE !== 'function') {
      Buffer.prototype.readBigUInt64BE = function(offset) {
        offset = offset || 0;
        var hi = BigInt(this.readUInt32BE(offset));
        var lo = BigInt(this.readUInt32BE(offset + 4));
        return (hi << BigInt(32)) | lo;
      };
    }
    
    if (typeof Buffer.prototype.readBigInt64BE !== 'function') {
      Buffer.prototype.readBigInt64BE = function(offset) {
        return BigInt.asIntN(64, this.readBigUInt64BE(offset));
      };
    }
    
    if (typeof Buffer.prototype.readBigUInt64LE !== 'function') {
      Buffer.prototype.readBigUInt64LE = function(offset) {
        offset = offset || 0;
        var lo = BigInt(this.readUInt32LE(offset));
        var hi = BigInt(this.readUInt32LE(offset + 4));
        return (hi << BigInt(32)) | lo;
      };
    }
    
    if (typeof Buffer.prototype.readBigInt64LE !== 'function') {
      Buffer.prototype.readBigInt64LE = function(offset) {
        return BigInt.asIntN(64, this.readBigUInt64LE(offset));
      };
    }
    
    console.log('[Buffer Polyfill] BigInt methods patched successfully');
  }
  
  // Start patching immediately and also on DOM ready
  patchBuffer();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchBuffer);
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Buffer polyfill MUST load before any other scripts */}
        <Script
          id="buffer-polyfill"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: bufferPolyfillScript }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

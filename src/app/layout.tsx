import type { Metadata } from 'next';
import { IBM_Plex_Mono, Public_Sans } from 'next/font/google';
import './globals.css';

const sans = Public_Sans({ variable: '--font-sans', subsets: ['latin'] });
const mono = IBM_Plex_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['400', '600'] });

export const metadata: Metadata = {
  title: 'ZKCord',
  description: 'Discord roles by passport age and nationality, without anyone seeing the passport.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-game',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SNACK HERO - タクヤとお菓子育成ゲーム',
  description: 'AIお菓子スキャン×イケメンキャラクター育成ヘルスケアアプリ',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${pressStart2P.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-0 sm:p-4">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '100vvs',
  description: 'Communaute privee anonyme, premium et securisee.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

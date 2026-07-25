import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LawBridge | Secure Legal Infrastructure',
  description: 'Multi-Jurisdictional Compliance Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}

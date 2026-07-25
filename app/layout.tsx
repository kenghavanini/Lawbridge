import './globals.css';

export const metadata = {
  title: 'LawBridge',
  description: 'The Autonomous Operating System for Legal Practice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

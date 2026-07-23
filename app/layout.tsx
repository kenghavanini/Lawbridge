'use client';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('lawbridge_theme') || 'dark';
    setIsDark(saved === 'dark');

    const handleThemeChange = () => {
      const current = localStorage.getItem('lawbridge_theme') || 'dark';
      setIsDark(current === 'dark');
    };

    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(next === 'dark');
    localStorage.setItem('lawbridge_theme', next);
    window.dispatchEvent(new Event('theme-changed'));
  };

  const bg = isDark ? '#000000' : '#ffffff';
  const color = isDark ? '#ffffff' : '#000000';

  return (
    <html lang="en">
      <body style={{ backgroundColor: bg, color: color, margin: 0, padding: 0, minHeight: '100vh', transition: 'background 0.2s, color 0.2s', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
        <button
          onClick={toggleTheme}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 99999,
            backgroundColor: isDark ? '#ffffff' : '#000000',
            color: isDark ? '#000000' : '#ffffff',
            border: '1px solid ' + (isDark ? '#333' : '#ccc'),
            padding: '0.6rem 1.2rem',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </body>
    </html>
  );
}

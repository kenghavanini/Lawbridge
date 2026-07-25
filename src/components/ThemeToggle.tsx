'use client';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition"
    >
      <span>{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
    </button>
  );
}

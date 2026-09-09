'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-xl border border-[#1DA9D0]/20 bg-surface text-foreground/60 transition-colors">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl border border-[#1DA9D0]/20 bg-surface text-foreground/80 hover:text-brand-500 hover:border-brand-500/50 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500/50"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-[#EA8803]" />
      ) : (
        <Moon className="w-5 h-5 text-brand-500" />
      )}
    </button>
  );
}

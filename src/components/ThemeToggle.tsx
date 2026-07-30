'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/** 深/浅主题切换按钮 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 初始化：读取当前主题状态
  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);
    setMounted(true);
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);

    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 防止 hydration mismatch：未加载前不渲染
  if (!mounted) return <div className="h-11 w-11" />;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '切换到亮色主题' : '切换到深色主题'}
      className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

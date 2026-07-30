import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 工业科技感主色板
        navy: {
          DEFAULT: '#0a1f33', // 深青蓝
          light: '#0f2f4d',
          deep: '#061524',
          900: '#0a1f33',
          800: '#0f2f4d',
          700: '#1a3a52',
        },
        cyan: {
          brand: '#0e7490', // 深青蓝辅助
          light: '#06b6d4',
        },
        energy: {
          DEFAULT: '#22c55e', // 科技绿
          dark: '#16a34a',
          light: '#86efac',
          bright: '#10b981',
        },
        electric: {
          DEFAULT: '#2563eb', // 电网蓝
          light: '#3b82f6',
          bright: '#0ea5e9',
          dark: '#1d4ed8',
        },
        tech: {
          bg: '#f8fafc', // 亮色模式超浅背景
          card: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-grid': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'grid-flow': {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '40px 40px, 40px 40px' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-grid': 'pulse-grid 3s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'grid-flow': 'grid-flow 6s linear infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
      },
      boxShadow: {
        'glow-energy': '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)',
        'glow-electric': '0 0 20px rgba(37, 99, 235, 0.4), 0 0 40px rgba(37, 99, 235, 0.2)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.1)',
        'glow-neon': '0 0 15px rgba(34, 197, 94, 0.3), 0 0 30px rgba(37, 99, 235, 0.2)',
      },
      backgroundImage: {
        'gradient-electric': 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
        'gradient-energy': 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #2563eb 0%, #22c55e 50%, #0ea5e9 100%)',
        'gradient-hero-light': 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #f0fdf4 100%)',
        'gradient-hero-dark': 'linear-gradient(135deg, #061524 0%, #0a1f33 50%, #0f2f4d 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

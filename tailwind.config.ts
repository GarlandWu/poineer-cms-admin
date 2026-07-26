import type { Config } from 'tailwindcss';

const config: Config = {
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
        },
        cyan: {
          brand: '#0e7490', // 深青蓝辅助
        },
        energy: {
          DEFAULT: '#22c55e', // 科技绿
          dark: '#16a34a',
        },
        electric: {
          DEFAULT: '#2563eb', // 电网蓝
          light: '#3b82f6',
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
      },
      animation: {
        'pulse-grid': 'pulse-grid 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

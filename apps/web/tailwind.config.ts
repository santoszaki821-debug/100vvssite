import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#0f0b1d',
        blush: '#1d1235',
        petal: '#6d28d9',
        ruby: '#a855f7',
        wine: '#f7f2ff',
        ink: '#d8c9ff',
      },
      boxShadow: {
        premium: '0 24px 90px rgba(124, 58, 237, 0.28)',
        glow: '0 0 42px rgba(168, 85, 247, 0.34)',
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 24px rgba(168, 85, 247, 0.25)' },
          '50%': { boxShadow: '0 0 58px rgba(168, 85, 247, 0.55)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

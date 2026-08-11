import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#52525b', // Muted neutral for secondary
          600: '#3f3f46',
          700: '#27272a',
          800: '#18181b',
          900: '#09090b', // Deep off-black background
          950: '#040405',
        },
        accent: {
          light: '#cbd5e1',
          DEFAULT: '#3b82f6', // Elegant, slightly desaturated blue
          dark: '#1d4ed8',
        }
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
        floating: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(9, 9, 11, 0.8) 0%, rgba(9, 9, 11, 0.4) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

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
          50: '#e8f9fd',
          100: '#c4f0f8',
          200: '#88e1f0',
          300: '#43D5CC',
          400: '#43D5CC',
          500: '#1DA9D0', // Curious Blue (primary CTA)
          600: '#1590B2',
          700: '#0F7090',
          800: '#015383', // Orient
          900: '#012E4A',
          950: '#011B2E',
        },
        orient: {
          DEFAULT: '#015383',
          light: '#014775',
          medium: '#013D66',
          dark: '#012040',
          deeper: '#011B2E',
          darkest: '#010E1C',
        },
        turquoise: {
          DEFAULT: '#43D5CC',
          muted: 'rgba(67, 213, 204, 0.15)',
        },
        tangerine: {
          DEFAULT: '#EA8803',
          muted: 'rgba(234, 136, 3, 0.15)',
        },
        sidecar: {
          DEFAULT: '#F5EACA',
          muted: '#D4C8A2',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(1, 14, 28, 0.35)',
        'glass-hover': '0 12px 40px 0 rgba(29, 169, 208, 0.18)',
        floating: '0 20px 40px -15px rgba(29, 169, 208, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(1, 83, 131, 0.4) 0%, rgba(1, 61, 102, 0.2) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(1, 32, 64, 0.85) 0%, rgba(1, 14, 28, 0.6) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

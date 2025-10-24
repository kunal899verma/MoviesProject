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
        primary: {
          DEFAULT: '#2BD17E',
          50: '#E8F9F1',
          100: '#D1F3E3',
          200: '#A3E7C7',
          300: '#75DBAB',
          400: '#47CF8F',
          500: '#2BD17E',
          600: '#22A765',
          700: '#1A7D4C',
          800: '#115332',
          900: '#092A19',
        },
        error: {
          DEFAULT: '#EB5757',
          50: '#FDF2F2',
          100: '#FCE5E5',
          200: '#F8CBCB',
          300: '#F4B1B1',
          400: '#F09797',
          500: '#EB5757',
          600: '#E73C3C',
          700: '#C53030',
          800: '#A02626',
          900: '#7B1D1D',
        },
        background: {
          DEFAULT: '#093545',
          light: '#0f4c5c',
          dark: '#062329',
        },
        input: {
          DEFAULT: '#224957',
          hover: '#2a5764',
          focus: '#325a68',
        },
        card: {
          DEFAULT: '#092C39',
          hover: '#0f3441',
          border: '#1a4a5a',
        },
        'card-border': '#1a4a5a',
        'input-hover': '#2a5764',
        'primary-600': '#22A765',
        'error-600': '#E73C3C',
        'text-primary': '#ffffff',
        'text-secondary': 'rgba(255, 255, 255, 0.6)',
        'text-muted': 'rgba(255, 255, 255, 0.4)',
        'text-accent': 'rgba(255, 255, 255, 0.8)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'movie-background': 'linear-gradient(180deg, #093545 0%, #224957 100%)',
        'pattern': 'url("/bg.png")',
        'pattern-with-bg': 'url("/bg.png"), linear-gradient(180deg, #093545 0%, #093545 100%)',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography system based on your design
        'heading-1': ['64px', { lineHeight: '80px', letterSpacing: '0%', fontWeight: '600' }],
        'heading-2': ['48px', { lineHeight: '56px', letterSpacing: '0%', fontWeight: '600' }],
        'heading-3': ['32px', { lineHeight: '40px', letterSpacing: '0%', fontWeight: '600' }],
        'heading-4': ['24px', { lineHeight: '32px', letterSpacing: '0%', fontWeight: '700' }],
        'heading-5': ['20px', { lineHeight: '24px', letterSpacing: '0%', fontWeight: '700' }],
        'heading-6': ['16px', { lineHeight: '24px', letterSpacing: '0%', fontWeight: '700' }],
        'body-large': ['20px', { lineHeight: '32px', letterSpacing: '0%', fontWeight: '400' }],
        'body-regular': ['16px', { lineHeight: '24px', letterSpacing: '0%', fontWeight: '400' }],
        'body-small': ['14px', { lineHeight: '24px', letterSpacing: '0%', fontWeight: '400' }],
        'body-extra-small': ['12px', { lineHeight: '24px', letterSpacing: '0%', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '16px', letterSpacing: '0%', fontWeight: '400' }],
      },
      spacing: {
        // Spacing system based on multiples of 8px
        '0.5': '2px',   // 2px
        '1': '4px',     // 4px
        '2': '8px',     // 8px
        '3': '12px',    // 12px
        '4': '16px',    // 16px
        '5': '24px',    // 24px
        '6': '32px',    // 32px
        '7': '40px',    // 40px
        '8': '48px',    // 48px
        '9': '64px',    // 64px
        '10': '80px',   // 80px
        '11': '120px',  // 120px
        '12': '160px',  // 160px
      },
      maxWidth: {
        'container': '1440px', // Max-width from your grid system
      },
      container: {
        center: true,
        padding: '120px', // Margin from your grid system
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },
      gridTemplateColumns: {
        // 12-column grid system
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        'gutter': '24px', // Gutter width from your grid system
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

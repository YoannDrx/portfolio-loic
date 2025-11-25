import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ===== PRIMARY - Neon Yellow ===== */
        primary: {
          DEFAULT: '#D5FF0A',
          50: '#FDFFF0',
          100: '#F9FFD6',
          200: '#F2FFAB',
          300: '#E8FF75',
          400: '#D5FF0A',
          500: '#C2E600',
          600: '#9AB800',
          700: '#748A00',
          800: '#566900',
          900: '#2B3400',
          950: '#1A2000',
        },

        /* ===== ACCENT COLORS ===== */
        accent: {
          green: '#5CE462',
          emerald: '#00C18B',
          teal: '#009998',
          ocean: '#006F84',
          slate: '#2F4858',
        },

        /* Green Scale */
        green: {
          DEFAULT: '#5CE462',
          50: '#EEFCEF',
          100: '#D9F8DB',
          200: '#B3F1B7',
          300: '#8DEA93',
          400: '#5CE462',
          500: '#3DD044',
          600: '#2BA532',
          700: '#1F7A25',
          800: '#145018',
          900: '#0A280C',
        },

        /* Emerald Scale */
        emerald: {
          DEFAULT: '#00C18B',
          50: '#E6FBF5',
          100: '#C2F5E6',
          200: '#85EBCD',
          300: '#47E1B4',
          400: '#00C18B',
          500: '#00A076',
          600: '#007F5E',
          700: '#005F47',
          800: '#003F2F',
          900: '#001F18',
        },

        /* Teal Scale */
        teal: {
          DEFAULT: '#009998',
          50: '#E6FAFA',
          100: '#B3F0EF',
          200: '#80E5E5',
          300: '#4DDBDA',
          400: '#009998',
          500: '#007F7E',
          600: '#006665',
          700: '#004D4C',
          800: '#003332',
          900: '#001A19',
        },

        /* Ocean Scale */
        ocean: {
          DEFAULT: '#006F84',
          50: '#E6F4F7',
          100: '#B3DDE6',
          200: '#80C6D5',
          300: '#4DAFC3',
          400: '#006F84',
          500: '#005C6E',
          600: '#004A58',
          700: '#003742',
          800: '#00252C',
          900: '#001216',
        },

        /* ===== NEON COLORS (Legacy support + Extended palette) ===== */
        'neon-lime': '#D5FF0A',
        'neon-cyan': '#00F0FF',
        'neon-magenta': '#FF006E',
        'neon-purple': '#8B5CF6',
        'neon-blue': '#60A5FA',
        'neon-green': '#10B981',

        /* Cyan Scale */
        cyan: {
          DEFAULT: '#00F0FF',
          50: '#E6FEFF',
          100: '#B3FCFF',
          200: '#80FAFF',
          300: '#4DF7FF',
          400: '#00F0FF',
          500: '#00C8D4',
          600: '#00A0AA',
          700: '#00787F',
          800: '#005055',
          900: '#00282A',
        },

        /* Magenta Scale */
        magenta: {
          DEFAULT: '#FF006E',
          50: '#FFE6F0',
          100: '#FFB3D1',
          200: '#FF80B3',
          300: '#FF4D94',
          400: '#FF006E',
          500: '#D4005B',
          600: '#AA0049',
          700: '#7F0037',
          800: '#550025',
          900: '#2A0012',
        },

        /* Purple Scale */
        purple: {
          DEFAULT: '#8B5CF6',
          50: '#F3EFFD',
          100: '#E0D5FB',
          200: '#C1ABF7',
          300: '#A381F3',
          400: '#8B5CF6',
          500: '#7344E5',
          600: '#5B2DD4',
          700: '#4522A0',
          800: '#2E176C',
          900: '#170B36',
        },

        /* Slate Scale */
        slate: {
          DEFAULT: '#2F4858',
          50: '#EEF1F3',
          100: '#D4DBDF',
          200: '#A9B7BF',
          300: '#7E939F',
          400: '#536F7F',
          500: '#2F4858',
          600: '#263A47',
          700: '#1C2B35',
          800: '#131D24',
          900: '#090E12',
        },

        /* ===== NEUTRALS ===== */
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1f1f23',
          900: '#18181b',
          925: '#121214',
          950: '#09090b',
        },

        /* ===== SEMANTIC ===== */
        background: 'rgb(var(--background-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',

        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          hover: 'var(--surface-hover)',
        },

        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },

        success: {
          DEFAULT: '#5CE462',
          light: '#8DEA93',
          dark: '#3DD044',
        },
        warning: {
          DEFAULT: '#FBBF24',
          light: '#FCD34D',
          dark: '#F59E0B',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#009998',
          light: '#4DDBDA',
          dark: '#007F7E',
        },
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },

      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },

      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        /* Glow - Primary */
        'glow-primary-sm': '0 0 10px -2px rgba(213, 255, 10, 0.4)',
        'glow-primary': '0 0 20px -4px rgba(213, 255, 10, 0.5)',
        'glow-primary-lg': '0 0 30px -6px rgba(213, 255, 10, 0.6)',
        'glow-primary-xl': '0 0 50px -10px rgba(213, 255, 10, 0.5)',
        'glow-primary-intense': '0 0 40px rgba(213, 255, 10, 0.8)',
        /* Glow - Green */
        'glow-green-sm': '0 0 10px -2px rgba(92, 228, 98, 0.4)',
        'glow-green': '0 0 20px -4px rgba(92, 228, 98, 0.5)',
        'glow-green-lg': '0 0 30px -6px rgba(92, 228, 98, 0.6)',
        /* Glow - Emerald */
        'glow-emerald-sm': '0 0 10px -2px rgba(0, 193, 139, 0.4)',
        'glow-emerald': '0 0 20px -4px rgba(0, 193, 139, 0.5)',
        'glow-emerald-lg': '0 0 30px -6px rgba(0, 193, 139, 0.6)',
        /* Glow - Teal */
        'glow-teal-sm': '0 0 10px -2px rgba(0, 153, 152, 0.4)',
        'glow-teal': '0 0 20px -4px rgba(0, 153, 152, 0.5)',
        'glow-teal-lg': '0 0 30px -6px rgba(0, 153, 152, 0.6)',
        /* Glow - Ocean */
        'glow-ocean-sm': '0 0 10px -2px rgba(0, 111, 132, 0.4)',
        'glow-ocean': '0 0 20px -4px rgba(0, 111, 132, 0.5)',
        'glow-ocean-lg': '0 0 30px -6px rgba(0, 111, 132, 0.6)',
        /* Glow - Cyan */
        'glow-cyan-sm': '0 0 10px -2px rgba(0, 240, 255, 0.4)',
        'glow-cyan': '0 0 20px -4px rgba(0, 240, 255, 0.5)',
        'glow-cyan-lg': '0 0 30px -6px rgba(0, 240, 255, 0.6)',
        /* Glow - Magenta */
        'glow-magenta-sm': '0 0 10px -2px rgba(255, 0, 110, 0.4)',
        'glow-magenta': '0 0 20px -4px rgba(255, 0, 110, 0.5)',
        'glow-magenta-lg': '0 0 30px -6px rgba(255, 0, 110, 0.6)',
        /* Glow - Purple */
        'glow-purple-sm': '0 0 10px -2px rgba(139, 92, 246, 0.4)',
        'glow-purple': '0 0 20px -4px rgba(139, 92, 246, 0.5)',
        'glow-purple-lg': '0 0 30px -6px rgba(139, 92, 246, 0.6)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        /* Brand Gradients */
        'gradient-brand': 'linear-gradient(135deg, #D5FF0A 0%, #5CE462 25%, #00C18B 50%, #009998 75%, #006F84 100%)',
        'gradient-brand-short': 'linear-gradient(135deg, #D5FF0A 0%, #00C18B 100%)',
        'gradient-primary': 'linear-gradient(135deg, #D5FF0A 0%, #5CE462 100%)',
        'gradient-primary-teal': 'linear-gradient(135deg, #D5FF0A 0%, #009998 100%)',
        'gradient-teal': 'linear-gradient(135deg, #00C18B 0%, #006F84 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #009998 0%, #2F4858 100%)',
        'gradient-surface': 'linear-gradient(180deg, #18181b 0%, #09090b 100%)',
        /* Glow Gradients */
        'gradient-glow-primary': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(213, 255, 10, 0.15), transparent)',
        'gradient-glow-teal': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 193, 139, 0.12), transparent)',
        'gradient-glow-center': 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(213, 255, 10, 0.08), transparent)',
      },

      animation: {
        'morph': 'morph 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-pulse-primary': 'glow-pulse-primary 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },

      keyframes: {
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(213, 255, 10, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(213, 255, 10, 1)' },
        },
        'glow-pulse-primary': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(213, 255, 10, 0.4)' },
          '50%': { boxShadow: '0 0 35px rgba(213, 255, 10, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      transitionDuration: {
        'instant': '50ms',
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
        'slower': '700ms',
        'slowest': '1000ms',
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },

      zIndex: {
        'behind': '-1',
        'dropdown': '10',
        'sticky': '20',
        'fixed': '30',
        'modal-backdrop': '40',
        'modal': '50',
        'popover': '60',
        'tooltip': '70',
        'toast': '80',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};

export default config;

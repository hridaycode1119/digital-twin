/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#111827',
          950: '#030712',
          975: '#060a12',
        },
        biotech: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        health: {
          optimal: '#10b981',
          good: '#059669',
          monitoring: '#d97706',
          alert: '#e11d48',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.05)',
        'glass-hover': '0 16px 40px 0 rgba(14, 165, 233, 0.12)',
        'glow-cyan': '0 0 30px rgba(14, 165, 233, 0.3)',
        'glow-teal': '0 0 30px rgba(20, 184, 166, 0.3)',
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.25)',
        'subtle-card': '0 1px 3px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)',
        'tactile': 'inset 0 1px 0 0 rgba(255,255,255,0.25), 0 2px 8px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};

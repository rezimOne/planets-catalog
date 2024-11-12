/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      xxl: '2000px'
    },
    container: {
      center: true,
      screens: {
        sm: '576px',
        md: '768px',
        lg: '960px',
        xl: '1200px',
        xxl: '1200px'
      }
    },
    extend: {
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)'
      },
      container: {
        padding: {
          DEFAULT: 'var(--spacing)'
        }
      },
      colors: {
        primary: {
          stroke: 'var(--primary-stroke)',
          hover: 'var(--primary-hover)',
          text: 'var(--primary-text)',
          bg: 'var(--primary-bg)'
        },
        secondary: {
          stroke: 'var(--secondary-stroke)',
          hover: 'var(--secondary-hover)',
          text: 'var(--secondary-text)',
          bg: 'var(--secondary-bg)'
        },
        alternative: {
          bg: 'var(--alternative-bg)'
        }
      }
    }
  },
  plugins: [require('tailwindcss-primeui')]
};

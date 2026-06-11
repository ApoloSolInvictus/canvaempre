/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        muted: '#6B7280',
        violet: '#6D35FF',
      },
      boxShadow: {
        ios: '0 18px 50px rgba(17, 24, 39, 0.08)',
        soft: '0 8px 30px rgba(79, 70, 229, 0.12)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

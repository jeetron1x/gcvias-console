/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          950: '#070C14',
          900: '#0B1320',
          850: '#101B2E',
          800: '#17243B',
          700: '#233554',
          600: '#344B73',
          500: '#486596',
          400: '#6484BA',
          300: '#8AA6D6',
          200: '#BDCFED',
          100: '#E2EAF7',
          50: '#F2F6FC',
        },
        hazard: {
          severe: '#DC2626',
          high: '#EA580C',
          moderate: '#D97706',
          low: '#CA8A04',
          monitored: '#0284C7',
          safe: '#16A34A',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#1a1a1a',
          panel: '#2d2d2d',
          accent: '#4a9eff',
          text: '#ffffff',
          textSecondary: '#cccccc',
          editor: '#1e1e1e',
          border: '#404040'
        }
      }
    },
  },
  plugins: [],
}

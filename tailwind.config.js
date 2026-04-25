/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f6f7f4',
          100: '#eaede4',
          200: '#d4dbc9',
          300: '#b5c2a2',
          400: '#93a67a',
          500: '#748a5c',
          600: '#5b6f47',
          700: '#48593a',
          800: '#3c4930',
          900: '#333e2b',
        },
        blush: {
          50: '#fdf8f6',
          100: '#f9ede8',
          200: '#f3d8ce',
          300: '#e9baa9',
          400: '#db9178',
          500: '#ca6d51',
          600: '#b55438',
          700: '#96432d',
          800: '#7c3929',
          900: '#693327',
        },
      },
    },
  },
  plugins: [],
}
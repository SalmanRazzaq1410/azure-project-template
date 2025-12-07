/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        phoenix: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad6ac',
          300: '#f6b978',
          400: '#f19142',
          500: '#ee7520',
          600: '#df5a13',
          700: '#b94312',
          800: '#933617',
          900: '#772f16',
        },
      },
    },
  },
  plugins: [],
};

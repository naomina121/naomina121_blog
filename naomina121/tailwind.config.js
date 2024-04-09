/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xl: { max: '1200px' },
      lg: { max: '1024px' },
      md: { max: '768px' },
      sm: { max: '360px' },
    },
  },
  plugins: [],
}

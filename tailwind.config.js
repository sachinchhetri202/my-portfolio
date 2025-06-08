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
        // You can customize your color palette here
      },
      animation: {
        // Custom animations if needed
      },
      fontFamily: {
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

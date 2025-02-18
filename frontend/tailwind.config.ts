import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          50: '#F4F2FC',
          100: '#E4DFF6',
          200: '#D1CAF2',
          300: '#ACA0DD',
          400: '#8A80B2',
          500: '#342C53',
          600: '#262041',
          700: '#16112E',
          800: '#04071F',
          900: '#010213',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
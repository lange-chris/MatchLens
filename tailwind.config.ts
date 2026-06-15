import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        surface: "#FFFFFF",
        primary: "#79AA9B",       // Sage Green (academics)
        "primary-hover": "#659687",
        secondary: "#342259",     // Deep Purple (academics)
        "secondary-hover": "#251744",
        text: {
          main: "#212121",
          muted: "#757575",
        },
        border: "#E0E0E0",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-manrope)', 'sans-serif'],
      },
      boxShadow: {
        'material-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'material-2': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        'material-3': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ripple': {
          'to': {
            transform: 'scale(4)',
            opacity: '0'
          }
        }
      }
    },
  },
  plugins: [],
};
export default config;

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
        ink: "#0a0a0a",
        cream: "#fafaf8",
        warm: "#f2ede6",
        stone: "#9a9490",
        mist: "#e8e3dc",
        card: "#f7f4ef",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest: ".2em",
      },
      maxWidth: {
        content: "1440px",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fc0055",
        secondary: "#FFE472",
      },
      borderRadius: {
        xl: "24px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        poppins: ["Poppins", "ui-sans-serif", "system-ui"],
        urbanist: ["Urbanist", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
export default config;

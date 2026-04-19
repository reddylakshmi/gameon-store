/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#05070d",
        coal: "#0f1720",
        crimson: "#b11226",
        ember: "#ff5c74",
        frost: "#f7f7f8"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 16px 40px rgba(177,18,38,0.28)"
      }
    }
  },
  plugins: []
};

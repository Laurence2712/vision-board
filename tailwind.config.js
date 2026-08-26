/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F111B",
        panel: "#171A28",
        panel2: "#1E2233",
        line: "#2B3048",
        gold: "#E8B34A",
        goldDim: "#8A6D2E",
        lavender: "#9B93D6",
        mist: "#EDEAF6",
        muted: "#7D7A93",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

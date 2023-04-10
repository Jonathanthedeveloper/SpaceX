/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs,js}", "./views/partials/**/*.ejs"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        darkBlue: "#0D47A1",
        lightBlue: "#64B5F6",
        grey: "#757575",
      },
    },
  },
  plugins: [],
};

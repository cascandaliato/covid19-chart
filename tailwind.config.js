module.exports = {
  purge: [
    "src/**/*.js",
    "src/**/*.jsx",
    "src/**/*.ts",
    "src/**/*.tsx",
    "public/**/*.html",
  ],
  theme: {
    extend: {
      height: {
        "11/12": "91.666667%",
      },
      gridTemplateRows: {
        12: "repeat(12, minmax(0, 1fr))",
      },
      gridRow: {
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "start-8": "8",
        "start-9": "9",
        "start-10": "10",
        "start-11": "11",
        "start-12": "12",
      },
      minWidth: {
        "10rem": "10rem",
        "13rem": "13rem",
        "16rem": "16rem",
      },
    },
    fontFamily: {
      sans: [
        '"Open Sans"',
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
  },
  variants: {
    extend: {
      cursor: ["hover"],
      margin: ["responsive", "hover", "focus"],
    },
  },
  plugins: [require("@tailwindcss/custom-forms")],
};

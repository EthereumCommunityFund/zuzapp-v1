/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        dark: "hsl(var(--dark))",
        grayBackground: "#2F3232",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        textPrimary: "#ffffff",
        textSecondary: "#ffffff70",
        pagePrimary: "#222222",
        componentPrimary: "#2F3131",
        itemHover: "#393C3C",
        inputField: "#242727",
        inputBgActive: "#FFFFFF",
        buttonDarkNavInactive: "#F1F1F133",
        buttonDarkNavHover: "#F1F1F166",
        trackItemHover: "#434646",
        trackDateColor: "#4D5050",
        itemBgPrimary: "#2D2D2D",
        btnPrimary: "#FFFFFF",
        btnBlue: "#67DAFF",
        btnBlueLight: "rgba(78, 170, 255, 0.20)",
        btnRed: "#FF5D5D",
        btnYellow: "#F3BE6F",
        btnPrimaryGreen: "#D7FFC4",
        btnStrongerGreen: "#79916E",
        btnStrongerGreenHover: "#96B488",
        borderPrimary: "#393939",
        userFacingItem: "#393C3C",
        borderSecondary: "#575959",
        iconBg: "#565757",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(-2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        inter: ["Inter", "Inter Placeholder", "sans-serif"],
      },
      spacing: {
        "2.5": "10px",
      },
      width: {
        inherit: "inherit",
        "fill-available": "-webkit-fill-available",
      },
      boxShadow: {
        blur: "-webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px);",
      },
    },
    screens: {
      sm: "320px",
      md: "810px",
      lg: "1200px",
      slider_md: "768px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export { };

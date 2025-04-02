/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkmode: "class",
	theme: {
	  extend: {
		fontFamily: {
		  roboto: ["Roboto", "sans-serif"],
		  poppins: ["Poppins", "sans-serif"]
		},
		borderRadius: {
		  lg: 'var(--radius)',
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)'
		},
		colors: {
		  primary: '#800000', // Maroon
		  secondary: '#8B0000', // Dark Red
		}
	  }
	},
	plugins: [require("tailwindcss-animate")],
  };
  
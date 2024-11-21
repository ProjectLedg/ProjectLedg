/** @type {import('tailwindcss').Config} */

export default {
	darkMode: ["class"],
	content: [
	  './src/**/*.{js,jsx,ts,tsx}',
	  './public/index.html',
	],
	theme: {
    	extend: {
			screens: {
				'xl-monitor': '1600px', 
			},
			transitionTimingFunction: {
				'fade-delay': 'cubic-bezier(0.7, 0, 0.2, 1)', 
			},
			transitionDuration:{
				'3000': '3000ms'
			},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
			backgroundImage:{
				'dark-gradient': 'linear-gradient(to top, #0d0d0f, #1a1a1f)',
			},
    		colors: {
				darkBackground: '#121212',
				darkBorder: '#303030',
				darkSurface: '#1f1f1f',
				darkSecondary: '#b0b0b0',
				darkPositive: '#00B8D9',
				darkNegative: '#FF6F00',
				darkNeutral: '#FFB300',
				text: {
					DEFAULT: 'hsl(var(--foreground))', // Standard textfärg
					dark: 'white', // Vit text för mörkt läge
				},

    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		keyframes: {
    			'bg-fade': {
    				'0%': {
    					backgroundColor: 'rgba(243, 244, 246, 1)'
    				},
    				'10%': {
    					backgroundColor: 'rgba(255, 255, 255, 1)'
    				},
    				'100%': {
    					backgroundColor: 'rgba(243, 244, 246, 1)'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'bg-fade': 'bg-fade 4s cubic-bezier(0.25, 1, 0.5, 1)',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography')	
	],
	
};

import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./1777053630054694611.html"
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				nunito: ['Nunito', 'sans-serif'],
				fredoka: ['"Fredoka One"', 'cursive'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				game: {
					bg: '#1a0a2e',
					bgLight: '#2d1b4e',
					yellow: '#FFD700',
					orange: '#FF6B35',
					pink: '#FF4D8F',
					cyan: '#00E5FF',
					green: '#39FF14',
					purple: '#9B5DE5',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
					'60%': { transform: 'scale(1.2) rotate(5deg)', opacity: '1' },
					'100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'20%': { transform: 'translateX(-8px) rotate(-2deg)' },
					'40%': { transform: 'translateX(8px) rotate(2deg)' },
					'60%': { transform: 'translateX(-5px)' },
					'80%': { transform: 'translateX(5px)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-12px)' }
				},
				'combo-flash': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.4)', opacity: '0.8', filter: 'brightness(2)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'hp-drain': {
					'0%': { transform: 'scaleX(1)' },
					'100%': { transform: 'scaleX(var(--hp-scale))' }
				},
				'star-spin': {
					'0%': { transform: 'rotate(0deg) scale(1)' },
					'50%': { transform: 'rotate(180deg) scale(1.3)' },
					'100%': { transform: 'rotate(360deg) scale(1)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 10px currentColor' },
					'50%': { boxShadow: '0 0 30px currentColor, 0 0 60px currentColor' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(40px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'damage-pop': {
					'0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
					'50%': { transform: 'translateY(-30px) scale(1.5)', opacity: '1' },
					'100%': { transform: 'translateY(-60px) scale(1)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-in': 'bounce-in 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
				'shake': 'shake 0.4s ease-in-out',
				'float': 'float 3s ease-in-out infinite',
				'combo-flash': 'combo-flash 0.3s ease-in-out',
				'star-spin': 'star-spin 1s ease-in-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.4s ease-out',
				'damage-pop': 'damage-pop 0.8s ease-out forwards',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

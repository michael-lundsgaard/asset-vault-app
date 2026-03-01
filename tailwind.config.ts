import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'class',
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			borderRadius: {
				'2xl': '1rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			colors: {
				// Shared accent — vivid teal-cyan
				brand: {
					50: '#edfcfc',
					100: '#d0f5f7',
					200: '#a6ecf0',
					300: '#67dce4',
					400: '#25c4cf', // <-- primary accent
					500: '#13a9b5',
					600: '#138697',
					700: '#156c7a',
					800: '#185763',
					900: '#194954',
				},
				// Dark theme
				dark: {
					bg: '#0f1117',
					surface: '#181c26',
					card: '#1e2333',
					border: '#2a3045',
					muted: '#3d4561',
					subtle: '#6b7490',
					text: '#e8eaf2',
					dim: '#9aa0b8',
				},
				// Light theme
				light: {
					bg: '#f5f7ff',
					surface: '#ffffff',
					card: '#ffffff',
					border: '#e4e8f5',
					muted: '#c8d0e8',
					subtle: '#8892b0',
					text: '#1a1f36',
					dim: '#5a6380',
				},
			},
			fontFamily: {
				display: ['var(--font-display)'],
				body: ['var(--font-body)'],
				mono: ['var(--font-mono)', 'monospace'],
			},
			boxShadow: {
				'glow-sm': '0 0 12px 0 rgba(37,196,207,0.25)',
				glow: '0 0 24px 0 rgba(37,196,207,0.30)',
				'card-dark': '0 4px 24px rgba(0,0,0,0.35)',
				'card-light': '0 4px 24px rgba(100,120,180,0.10)',
			},
			keyframes: {
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
				pop: {
					'0%': { transform: 'scale(0.94)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
				float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
			},
			animation: {
				'fade-up': 'fade-up 0.4s cubic-bezier(.16,1,.3,1) forwards',
				'fade-in': 'fade-in 0.3s ease forwards',
				pop: 'pop 0.35s cubic-bezier(.16,1,.3,1) forwards',
				shimmer: 'shimmer 2s linear infinite',
				float: 'float 3s ease-in-out infinite',
			},
		},
	},
	plugins: [],
};
export default config;

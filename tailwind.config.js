/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'"Public Sans"',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'Segoe UI',
					'sans-serif'
				],
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
			},
			fontSize: {
				'display': ['clamp(2.75rem, 6vw + 1rem, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
				'section': ['clamp(1.875rem, 2.5vw + 1rem, 2.625rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }]
			},
			colors: {
				ink: {
					50: '#f6f6f7',
					100: '#e7e7e9',
					200: '#cfcfd3',
					300: '#a8a8af',
					400: '#7a7a83',
					500: '#5a5a63',
					600: '#42424a',
					700: '#2e2e35',
					800: '#1c1c22',
					900: '#0e0e12'
				},
				accent: {
					50: '#fff7ed',
					100: '#ffedd5',
					400: '#fb923c',
					500: '#f97316',
					600: '#ea580c',
					700: '#c2410c'
				}
			}
		}
	},
	plugins: []
};

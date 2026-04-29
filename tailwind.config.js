/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'Segoe UI',
					'Helvetica',
					'Arial',
					'sans-serif'
				],
				mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
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

import typographyPlugin from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'

import typographyStyles from './typography'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class'],
  plugins: [typographyPlugin, require("tailwindcss-animate")],
  theme: {
  	fontSize: {
  		xs: ['0.8125rem', { lineHeight: '1.5rem' }],
  		sm: ['0.875rem', { lineHeight: '1.5rem' }],
  		base: ['1rem', { lineHeight: '1.75rem' }],
  		lg: ['1.125rem', { lineHeight: '1.75rem' }],
  		xl: ['1.25rem', { lineHeight: '2rem' }],
  		'2xl': ['1.5rem', { lineHeight: '2rem' }],
  		'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  		'4xl': ['2rem', { lineHeight: '2.5rem' }],
  		'5xl': ['3rem', { lineHeight: '3.5rem' }],
  		'6xl': ['3.75rem', { lineHeight: '1' }],
  		'7xl': ['4.5rem', { lineHeight: '1' }],
  		'8xl': ['6rem', { lineHeight: '1' }],
  		'9xl': ['8rem', { lineHeight: '1' }]
  	},
  	typography: 'typographyStyles',
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
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
  			},
  			// 莫奈色系
  			monet: {
  				'blue': '#6C9BD1',      // 莫奈蓝
  				'blue-light': '#B8D4F0', // 浅莫奈蓝
  				'blue-dark': '#4A73A8',  // 深莫奈蓝
  				'green': '#8FBC8F',      // 莫奈绿
  				'green-light': '#B8D4B8', // 浅莫奈绿
  				'green-dark': '#6B9A6B',  // 深莫奈绿
  				'purple': '#9370DB',     // 莫奈紫
  				'purple-light': '#C4A8E8', // 浅莫奈紫
  				'purple-dark': '#7051B8', // 深莫奈紫
  				'pink': '#DDA0DD',       // 莫奈粉
  				'pink-light': '#F0C4F0',  // 浅莫奈粉
  				'pink-dark': '#B878B8',   // 深莫奈粉
  				'yellow': '#F0E68C',     // 莫奈黄
  				'yellow-light': '#F8F2B8', // 浅莫奈黄
  				'yellow-dark': '#C8BA70'  // 深莫奈黄
  			}
  		}
  	}
  },
} satisfies Config

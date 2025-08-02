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
  			// 莫兰迪色系
  			morandi: {
  				'blue': '#A8C0D6',      // 莫兰迪蓝
  				'blue-light': '#C4D4E4', // 浅莫兰迪蓝
  				'blue-dark': '#8BA3C0',  // 深莫兰迪蓝
  				'green': '#B8C5B8',      // 莫兰迪绿
  				'green-light': '#D1DCD1', // 浅莫兰迪绿
  				'green-dark': '#9FB09F',  // 深莫兰迪绿
  				'purple': '#C4B5C4',     // 莫兰迪紫
  				'purple-light': '#D8CCD8', // 浅莫兰迪紫
  				'purple-dark': '#A89BA8', // 深莫兰迪紫
  				'pink': '#D4B8C4',       // 莫兰迪粉
  				'pink-light': '#E4CCD4',  // 浅莫兰迪粉
  				'pink-dark': '#B8A0AC',   // 深莫兰迪粉
  				'yellow': '#D4C8A8',     // 莫兰迪黄
  				'yellow-light': '#E4D8C4', // 浅莫兰迪黄
  				'yellow-dark': '#B8A890',  // 深莫兰迪黄
  				'gray': '#C4C4C4',       // 莫兰迪灰
  				'gray-light': '#D8D8D8',  // 浅莫兰迪灰
  				'gray-dark': '#A8A8A8'   // 深莫兰迪灰
  			}
  		}
  	}
  },
} satisfies Config

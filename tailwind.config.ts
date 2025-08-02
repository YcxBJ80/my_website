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
  				'beige': '#F5F1E8',      // 米白
  				'beige-dark': '#E8E0D1',  // 深米白
  				'cream': '#F8F6F0',       // 奶油色
  				'cream-dark': '#EFE8D8',  // 深奶油色
  				'rose': '#E8D5C4',        // 玫瑰灰
  				'rose-dark': '#D4C1B0',   // 深玫瑰灰
  				'lavender': '#D8D0E3',    // 薰衣草灰
  				'lavender-dark': '#C4B8D1', // 深薰衣草灰
  				'sage': '#C8D5C8',        // 鼠尾草灰
  				'sage-dark': '#B4C4B4',   // 深鼠尾草灰
  				'peach': '#E8C8B8',       // 桃灰
  				'peach-dark': '#D4B4A4',  // 深桃灰
  				'blue': '#B8C8D8',        // 蓝灰
  				'blue-dark': '#A4B4C4',   // 深蓝灰
  				'green': '#B8C8B8',       // 绿灰
  				'green-dark': '#A4B4A4',  // 深绿灰
  				'purple': '#C8B8D8',      // 紫灰
  				'purple-dark': '#B4A4C4', // 深紫灰
  				'yellow': '#E8D8B8',      // 黄灰
  				'yellow-dark': '#D4C4A4', // 深黄灰
  				'gray': '#D8D8D8',        // 浅灰
  				'gray-dark': '#C4C4C4',   // 深灰
  				'warm-gray': '#E0D8D0',   // 暖灰
  				'warm-gray-dark': '#CCC4BC' // 深暖灰
  			}
  		}
  	}
  },
} satisfies Config

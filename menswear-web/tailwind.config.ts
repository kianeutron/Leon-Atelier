import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F2EA',
        sand: '#E8DCCD',
        umber: '#6A4B3A',
        umberDark: '#2E221A',
        gold: '#C7A17A',
        brown: '#6A4B3A',
        brownDark: '#2E221A',
        accent: '#C7A17A',
        terracotta: '#C96F55',
        clay: '#B77B61',
        olive: '#6C7A3F',
        pine: '#2F4F4F',
        charcoal: '#2B2B2B',
        champagne: '#F0E3C4',
        ivory: '#FBF7EF',
        taupe: '#8B715E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(46,34,26,0.08)',
        glow: '0 0 0 6px rgba(199,161,122,0.15)',
      },
      borderRadius: {
        xl: '14px',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config

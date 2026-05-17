/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        base:    '#000000',
        mantle:  '#0a0a0a',
        crust:   '#050505',
        surface: '#1a1a1a',
        overlay: '#ffffff',
        muted:   '#666666',
        subtle:  '#999999',
        text:    '#ffffff',
        blue:    '#3399ff',
        lavender:'#6699ff',
        green:   '#33cc33',
        red:     '#ff6666',
        yellow:  '#ffff33',
        peach:   '#ff9966',
        mauve:   '#cc66ff',
        teal:    '#33cccc',
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px',
      },
      animation: {
        'bounce-dot': 'bounceDot 1.2s infinite ease-in-out',
        'pulse-slow': 'pulse 2s infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%':           { transform: 'scale(1)',   opacity: '1'   },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',   opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

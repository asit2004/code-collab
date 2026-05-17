/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      colors: {
        // Catppuccin Mocha-inspired dark palette
        base:    '#1e1e2e',
        mantle:  '#181825',
        crust:   '#11111b',
        surface: '#313244',
        overlay: '#45475a',
        muted:   '#6c7086',
        subtle:  '#a6adc8',
        text:    '#cdd6f4',
        blue:    '#89b4fa',
        lavender:'#b4befe',
        green:   '#a6e3a1',
        red:     '#f38ba8',
        yellow:  '#f9e2af',
        peach:   '#fab387',
        mauve:   '#cba6f7',
        teal:    '#94e2d5',
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

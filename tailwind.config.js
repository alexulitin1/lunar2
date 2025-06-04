/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,vue,html}',
  ],
  theme: {
    extend: {
      colors: {
        'space-deep': '#030407',
        'space-navy': '#1B2350',
        'space-gray': '#E6E9F2',
        'space-star': '#A3B1FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        cosmic: '10px',
      },
      animation: {
        'satellite': 'orbit 30s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'breathe-in': 'breatheIn 5s ease-in-out',
        'breathe-hold': 'breatheHold 3s ease-in-out',
        'breathe-out': 'breatheOut 7s ease-in-out',
        'wave': 'wave 3s ease-in-out infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(140px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(140px) rotate(-360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, boxShadow: '0 0 10px rgba(163, 177, 255, 0.3)' },
          '50%': { opacity: 1, boxShadow: '0 0 20px rgba(163, 177, 255, 0.6)' },
        },
        breatheIn: {
          '0%': { transform: 'scale(1)', opacity: '0.3' },
          '100%': { transform: 'scale(1.2)', opacity: '1' },
        },
        breatheHold: {
          '0%, 100%': { transform: 'scale(1.2) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
        },
        breatheOut: {
          '0%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.3' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
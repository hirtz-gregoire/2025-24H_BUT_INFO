export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          rose: '#f72585',
          bleu: '#3a86ff',
          violet: '#7209b7',
          cyan: '#4cc9f0'
        },
        sombre: {
          900: '#0d0d0d',
          800: '#1a1a1a',
          700: '#2d2d2d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(247, 37, 133, 0.5)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(247, 37, 133, 0.8)' 
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
};

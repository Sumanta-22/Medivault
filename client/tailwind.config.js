/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef7ff',
                    100: '#d9edff',
                    200: '#bce0ff',
                    300: '#8eccff',
                    400: '#59b0ff',
                    500: '#338dff',
                    600: '#1a6ef5',
                    700: '#1458e1',
                    800: '#1747b6',
                    900: '#193e8f',
                    950: '#142757',
                },
                medical: {
                    teal: '#0d9488',
                    'teal-light': '#5eead4',
                    'teal-dark': '#0f766e',
                    blue: '#0284c7',
                    'blue-light': '#7dd3fc',
                    green: '#16a34a',
                    red: '#dc2626',
                    'red-light': '#fca5a5',
                },
                surface: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'spin-slow': 'spin 8s linear infinite',
                'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                'medical': '0 4px 24px -2px rgba(13, 148, 136, 0.2)',
                'emergency': '0 4px 24px -2px rgba(220, 38, 38, 0.3)',
            },
        },
    },
    plugins: [],
};

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
    content: [],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', ...defaultTheme.fontFamily.sans],
            },
            screens: {
                'xs': '390px',
                'mxs': {'max': '390px'},
                'msm': {'max': '640px'},
                'mmd': {'max': '768px'}
            }
        }
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#079292",
                    "secondary": "#079292",
                    "accent": "#079292",
                    "neutral": "#ffffff",
                    "base-100": "#ffffff",
                    "info": "#3abff8",
                    "success": "#36d399",
                    "warning": "#fbbd23",
                    "error": "#f87272",
                    "tooltip-bg": "#d3d3d3",
                }
            }
        ]
    }
}


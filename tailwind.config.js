/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bitrix: {
                    blue: '#2FC6F6',
                    dark: '#1a2332',
                    sidebar: '#252d3d',
                    primary: '#2FC6F6',
                }
            }
        },
    },
    plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        float1: 'float1 12s ease-in-out infinite',
        float2: 'float2 16s ease-in-out infinite',
        float3: 'float3 20s ease-in-out infinite',
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(20px) translateX(15px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-25px) translateX(-20px)' },
        },
        float3: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(15px) translateX(-10px)' },
      }
    },
      colors: {
        accent: 'var(--tw-color-accent, #6366f1)',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),      // Plugin per far funzionare React (JSX, Fast Refresh, ecc.)
    tailwindcss(), // Plugin per Tailwind CSS v4
  ],
})

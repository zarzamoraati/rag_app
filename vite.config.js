import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'


dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"https://zarzamoraati.github.io/rag_app/"
})

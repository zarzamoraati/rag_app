import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    "/api":{
      target:"https://zarzamoraati.github.io/rag_app/",
      changeOrigin:true,
      rewrite:(path)=>path.replace(/^\/api/,"")
    }
  }
})

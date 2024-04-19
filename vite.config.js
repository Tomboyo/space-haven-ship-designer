import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '', // use relative imports, i.e. src="./index.js" not "/index.js"
  plugins: [react()],
})

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist', // Ensure the build output goes to 'dist'
  },
  base: '/', // Set base to '/' if deploying to the root
  server: {
    https: true, // This is only for local development, not needed in production
  },
})

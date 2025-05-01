import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Unfonts from 'unplugin-fonts/vite'


export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    Unfonts({
      custom: {
        families: [{
          name: 'BeaufortforLOL',
          local: 'BeaufortforLOL',
          src: './src/assets/fonts/BeaufortforLOL-*.ttf',
        }],
      },
    }),
  ],
  build: {
    outDir: "../backend/static",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

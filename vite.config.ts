import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'; 

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
    
        main: resolve(__dirname, 'index.html'),
        
        blog: resolve(__dirname, 'src/pages/Blog.vue'),
        
      },
    },
  }, 
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
    }
  },
})

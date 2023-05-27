import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: [
            '@mui/material',
            '@mui/joy',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          dexie: ['dexie', 'dexie-react-hooks'],
          virt: ['react-virtuoso'],
        },
      },
    },
  },
})

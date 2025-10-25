import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {
            // React Compiler options
            compilationMode: 'infer',
            runtimeModule: 'react/compiler-runtime'
          }]
        ]
      }
    })
  ],
})

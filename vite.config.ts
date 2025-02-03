import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import packageJson from './package.json';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': '/src',
            // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
            '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
        },
    },
    plugins: [
        react(),
        tailwindcss()
    ],
    define: {
        __APP_VERSION__: JSON.stringify(packageJson.version),
    },
})

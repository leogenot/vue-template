import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path"


export default defineConfig({
    resolve: { alias: { '@': '/src' } },
    plugins: [
        vue(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
            symbolId: "icon-[dir]-[name]",
            customDomId: "spritesheet",
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/scss/main.scss";`,
            },
        },
        devSourcemap: true,
    },
    base: "/"

})

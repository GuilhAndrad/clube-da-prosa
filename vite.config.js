import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: '/clube-da-prosa/', // O nome do seu repo
  plugins: [svelte()],
})

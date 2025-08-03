// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://hugolepage.github.io/codenames-pictures',
  base: '/codenames-pictures/', // Base path for GitHub Pages
  output: 'static', // Still use static output for GitHub Pages
});

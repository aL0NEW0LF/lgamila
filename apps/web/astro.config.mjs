// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import favicons from 'astro-favicons';
import {
  CHROME_EXTENSION_URL,
  FIREFOX_EXTENSION_URL,
} from './src/lib/constants';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lgamila.ma',

  integrations: [
    react(),
    favicons(),
    sitemap({
      customPages: [
        'https://www.lgamila.ma/chrome',
        'https://www.lgamila.ma/firefox',
        'https://www.lgamila.ma/brave',
        'https://www.lgamila.ma/opera',
        'https://www.lgamila.ma/edge',
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  redirects: {
   '/brave': {
     status: 308,
     destination: CHROME_EXTENSION_URL,
   },
   '/opera': {
     status: 308,
     destination: CHROME_EXTENSION_URL,
   },
   '/edge': {
     status: 308,
     destination: CHROME_EXTENSION_URL,
   },
   '/chrome': {
     status: 308,
     destination: CHROME_EXTENSION_URL,
   },
   '/firefox': {
     status: 308,
     destination: FIREFOX_EXTENSION_URL,
   },
 },

  adapter: netlify(),
});
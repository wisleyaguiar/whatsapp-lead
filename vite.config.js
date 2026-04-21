import { defineConfig } from 'vite';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'WhatsAppLeadWidget',
      formats: ['iife'],
      fileName: () => 'whatsapp-widget.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.names.includes('style.css')) return 'whatsapp-widget.css';
          if (assetInfo.name === 'style.css') return 'whatsapp-widget.css';
          // Fallback para o nome que o Cloudflare gerou no log anterior
          if (assetInfo.name && assetInfo.name.includes('whatsapp-lead')) return 'whatsapp-widget.css';
          return assetInfo.name;
        }
      }
    }
  }
});
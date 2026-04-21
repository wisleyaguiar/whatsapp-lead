import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'WhatsAppTrayLeadWidget',
      formats: ['iife'],
      fileName: () => 'whatsapp-widget.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'whatsapp-widget.css';
          return assetInfo.name;
        }
      }
    }
  }
});

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'WhatsAppTrayLeadWidget',
      formats: ['iife', 'es'],
      fileName: (format) => `whatsapp-tray-lead-widget.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: 'whatsapp-tray-lead-widget.[ext]'
      }
    }
  }
});

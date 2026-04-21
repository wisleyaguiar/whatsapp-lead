import './styles.css';
import { createConfig } from './config.js';
import { LeadWidget } from './ui/widget.js';

export function initWhatsAppLeadWidget(options = {}, win = window) {
  const config = createConfig(options);
  const widget = new LeadWidget(config, win).mount();
  widget.attachProductTriggers();
  return widget;
}

// Exporta 'init' para que o Vite crie window.WhatsAppLeadWidget.init() no build IIFE
export { initWhatsAppLeadWidget as init };


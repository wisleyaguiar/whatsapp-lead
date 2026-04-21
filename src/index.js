import './styles.css';
import { createConfig } from './config.js';
import { LeadWidget } from './ui/widget.js';

export function initWhatsAppLeadWidget(options = {}, win = window) {
  const config = createConfig(options);
  const widget = new LeadWidget(config, win).mount();
  widget.attachProductTriggers();
  return widget;
}

if (typeof window !== 'undefined') {
  window.WhatsAppLeadWidget = {
    init: (options = {}) => initWhatsAppLeadWidget(options, window)
  };
}

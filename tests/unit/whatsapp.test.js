import { describe, expect, it } from 'vitest';
import { buildWhatsappUrl } from '../../src/core/whatsapp.js';

describe('WhatsApp URL builder', () => {
  it('builds a wa.me URL with normalized destination and encoded message', () => {
    const url = buildWhatsappUrl('(11) 98888-7777', {
      nome: 'Maria Souza',
      assunto: 'Pedidos',
      origem_trafego: 'Site da loja'
    });

    expect(url).toContain('https://wa.me/5511988887777?text=');
    expect(decodeURIComponent(url)).toContain('Me chamo Maria Souza');
  });
});

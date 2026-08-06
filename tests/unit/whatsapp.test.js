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

  it('builds a wa.me URL with simplified message when payload has no name', () => {
    const urlGlobal = buildWhatsappUrl('(11) 98888-7777', {
      origem_trafego: 'Site da loja'
    });
    expect(urlGlobal).toContain('https://wa.me/5511988887777?text=');
    expect(decodeURIComponent(urlGlobal)).toContain('Ola! Gostaria de atendimento.');

    const urlProduct = buildWhatsappUrl('(11) 98888-7777', {
      produto_interesse: 'Anel de Diamante',
      origem_trafego: 'Site da loja'
    });
    expect(urlProduct).toContain('https://wa.me/5511988887777?text=');
    expect(decodeURIComponent(urlProduct)).toContain('Ola! Gostaria de atendimento sobre Anel de Diamante.');
  });
});

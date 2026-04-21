import { describe, expect, it } from 'vitest';
import { buildLeadPayload, hasRequiredPayloadShape } from '../../src/core/payload.js';
import { buildWhatsappMessage } from '../../src/core/whatsapp.js';

const date = new Date('2026-04-20T14:05:06');

describe('payload helpers', () => {
  it('builds a valid global lead payload', () => {
    const payload = buildLeadPayload({
      name: 'Joao Silva',
      whatsapp: '(11) 99999-9999',
      subject: 'Pedidos',
      origin: 'Google / cpc',
      sourceUrl: 'https://loja.test',
      date
    });

    expect(payload).toMatchObject({
      nome: 'Joao Silva',
      whatsapp: '5511999999999',
      assunto: 'Pedidos',
      origem_trafego: 'Google / cpc',
      url_origem: 'https://loja.test',
      data_hora: '2026-04-20 14:05:06'
    });
    expect(hasRequiredPayloadShape(payload)).toBe(true);
  });

  it('builds a product lead payload', () => {
    const payload = buildLeadPayload({
      name: 'Maria Souza',
      whatsapp: '11988887777',
      productContext: {
        productName: 'Anel de Diamante Vereda',
        productId: '123'
      },
      origin: 'Site da loja',
      sourceUrl: 'https://loja.test/produto',
      date
    });

    expect(payload.produto_interesse).toBe('Anel de Diamante Vereda');
    expect(payload.produto_id).toBe('123');
    expect(payload.assunto).toBeUndefined();
    expect(hasRequiredPayloadShape(payload)).toBe(true);
  });

  it('builds the final WhatsApp message', () => {
    const payload = buildLeadPayload({
      name: 'Joao Silva',
      whatsapp: '11999999999',
      subject: 'Cadastro',
      origin: 'Site da loja',
      sourceUrl: 'https://loja.test',
      date
    });

    expect(buildWhatsappMessage(payload)).toContain('Ola! Me chamo Joao Silva');
    expect(buildWhatsappMessage(payload)).toContain('atendimento sobre Cadastro');
  });
});

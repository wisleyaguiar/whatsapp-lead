import { describe, expect, it } from 'vitest';
import { buildWhatsappMessage, buildWhatsappUrl } from '../../src/core/whatsapp.js';

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

describe('messageTemplate rendering', () => {
  it('resolves placeholders, including {topico}, from config.messageTemplate', () => {
    const message = buildWhatsappMessage(
      { nome: 'Joao', assunto: 'Pedidos' },
      { messageTemplate: 'Ola {nome}, sobre {topico}' }
    );
    expect(message).toBe('Ola Joao, sobre Pedidos');
  });

  it('falls back to the default message when messageTemplate is absent/empty/non-string', () => {
    const withoutName = buildWhatsappMessage({ origem_trafego: 'Site' }, {});
    expect(withoutName).toBe('Ola! Gostaria de atendimento.');

    const emptyTemplate = buildWhatsappMessage({ nome: 'Joao', assunto: 'Pedidos' }, { messageTemplate: '   ' });
    expect(emptyTemplate).toContain('Me chamo Joao');

    const nonStringTemplate = buildWhatsappMessage({ nome: 'Joao', assunto: 'Pedidos' }, { messageTemplate: 123 });
    expect(nonStringTemplate).toContain('Me chamo Joao');
  });

  it('resolves extra field placeholders, e.g. {cnpj}', () => {
    const message = buildWhatsappMessage({ cnpj: '12.345.678/0001-90' }, { messageTemplate: 'CNPJ: {cnpj}' });
    expect(message).toBe('CNPJ: 12.345.678/0001-90');
  });

  it('turns missing placeholders into empty string instead of throwing, and produces a decodable URL', () => {
    const url = buildWhatsappUrl('(11) 98888-7777', { nome: 'Joao' }, { messageTemplate: 'Ola {nome}, ref {inexistente}' });
    expect(url).toContain('https://wa.me/5511988887777?text=');
    expect(decodeURIComponent(url)).toBe('https://wa.me/5511988887777?text=Ola Joao, ref ');
  });
});

import { describe, expect, it } from 'vitest';
import { getTrafficOrigin, readProductContext } from '../../src/core/context.js';

describe('context helpers', () => {
  it('extracts product context from stable data attributes', () => {
    const element = document.createElement('button');
    element.dataset.productName = 'Anel de Diamante Vereda';
    element.dataset.productId = '123';

    const context = readProductContext(element, { location: { href: 'https://loja.test/produto' } });

    expect(context).toEqual({
      type: 'produto',
      productName: 'Anel de Diamante Vereda',
      productId: '123',
      sourceUrl: 'https://loja.test/produto'
    });
  });

  it('falls back when product attributes are missing', () => {
    const element = document.createElement('button');
    element.textContent = 'Anel visivel que nao deve ser raspado';
    expect(readProductContext(element)).toBeNull();
  });

  it('uses UTM source, medium and campaign as traffic origin', () => {
    const win = {
      location: { search: '?utm_source=Google&utm_medium=cpc&utm_campaign=joias' },
      document: { referrer: '' }
    };
    expect(getTrafficOrigin(win)).toBe('Google / cpc / joias');
  });
});

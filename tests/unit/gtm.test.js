import { describe, expect, it } from 'vitest';
import { pushGtmEvent } from '../../src/integrations/gtm.js';

describe('GTM integration', () => {
  it('pushes structured events when dataLayer exists', () => {
    const win = { dataLayer: [] };
    const pushed = pushGtmEvent(win, 'wpp_qualificacao_inicio', { contexto: 'global' });

    expect(pushed).toBe(true);
    expect(win.dataLayer).toEqual([
      {
        event: 'wpp_qualificacao_inicio',
        contexto: 'global',
        produto_id: null,
        assunto: null
      }
    ]);
  });

  it('does not throw when dataLayer is absent', () => {
    expect(pushGtmEvent({}, 'wpp_qualificacao_inicio')).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { createConfig } from '../../src/config.js';
import { createElementFromHtml, getWidgetMarkup } from '../../src/ui/template.js';

function renderForm(overrides = {}) {
  const config = createConfig(overrides);
  const section = createElementFromHtml(getWidgetMarkup(config));
  return section.querySelector('form');
}

describe('getWidgetMarkup dynamic fields', () => {
  it('renders extra fields in order after whatsapp', () => {
    const form = renderForm({ fields: ['email', 'cnpj'] });
    const names = Array.from(form.elements).map((el) => el.name);
    const whatsappIndex = names.indexOf('whatsapp');
    expect(names.indexOf('email')).toBe(whatsappIndex + 1);
    expect(names.indexOf('cnpj')).toBe(whatsappIndex + 2);
  });

  it('renders no extra fields when fields is empty', () => {
    const form = renderForm({ fields: [] });
    expect(form.elements.email).toBeUndefined();
    expect(form.elements.cnpj).toBeUndefined();
    expect(form.elements.razaoSocial).toBeUndefined();
  });

  it('marks required fields prefixed with *', () => {
    const form = renderForm({ fields: ['*cnpj'] });
    expect(form.elements.cnpj.required).toBe(true);
  });

  it('wraps each extra field in a label with the expected text', () => {
    const form = renderForm({ fields: ['email'] });
    const label = form.elements.email.closest('label');
    expect(label.textContent).toContain('E-mail');
  });

  it('keeps subject/lgpd/honeypot after the dynamic block', () => {
    const form = renderForm({ fields: ['email', 'cnpj'] });
    const names = Array.from(form.elements).map((el) => el.name);
    const cnpjIndex = names.indexOf('cnpj');
    expect(names.indexOf('subject')).toBeGreaterThan(cnpjIndex);
    expect(names.indexOf('lgpd')).toBeGreaterThan(cnpjIndex);
  });
});

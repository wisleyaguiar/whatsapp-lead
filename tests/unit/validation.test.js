import { describe, expect, it } from 'vitest';
import { validateLeadForm, validateName } from '../../src/core/validation.js';

const validValues = {
  name: 'Joao Silva',
  whatsapp: '(11) 99999-9999',
  subject: 'Pedidos',
  lgpdAccepted: true,
  honeypot: ''
};

describe('lead validation', () => {
  it('requires a full name', () => {
    expect(validateName('Joao Silva')).toBe(true);
    expect(validateName('Joao')).toBe(false);
  });

  it('accepts a valid global lead', () => {
    expect(validateLeadForm(validValues).valid).toBe(true);
  });

  it('blocks without LGPD consent', () => {
    const result = validateLeadForm({ ...validValues, lgpdAccepted: false });
    expect(result.valid).toBe(false);
    expect(result.errors.lgpd).toBeTruthy();
  });

  it('blocks incomplete WhatsApp numbers', () => {
    const result = validateLeadForm({ ...validValues, whatsapp: '1199' });
    expect(result.valid).toBe(false);
    expect(result.errors.whatsapp).toBeTruthy();
  });

  it('flags honeypot submissions as bots', () => {
    const result = validateLeadForm({ ...validValues, honeypot: 'https://spam.test' });
    expect(result.bot).toBe(true);
    expect(result.valid).toBe(false);
  });
});

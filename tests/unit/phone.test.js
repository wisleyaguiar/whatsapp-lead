import { describe, expect, it } from 'vitest';
import { formatPhoneForDisplay, isValidBrazilianWhatsapp, normalizeWhatsapp, onlyDigits } from '../../src/core/phone.js';

describe('phone helpers', () => {
  it('keeps only digits', () => {
    expect(onlyDigits('(11) 99999-9999')).toBe('11999999999');
  });

  it('normalizes a local mobile number with Brazil country code', () => {
    expect(normalizeWhatsapp('(11) 99999-9999')).toBe('5511999999999');
  });

  it('validates complete Brazilian WhatsApp numbers', () => {
    expect(isValidBrazilianWhatsapp('(11) 99999-9999')).toBe(true);
    expect(isValidBrazilianWhatsapp('11999')).toBe(false);
  });

  it('formats while typing', () => {
    expect(formatPhoneForDisplay('11999999999')).toBe('(11) 99999-9999');
    expect(formatPhoneForDisplay('1133334444')).toBe('(11) 3333-4444');
  });
});

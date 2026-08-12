import { describe, expect, it } from 'vitest';
import { resolveFields } from '../../src/core/fields.js';

describe('resolveFields', () => {
  it('preserves the given order', () => {
    expect(resolveFields(['email', 'cnpj'])).toEqual([
      { id: 'email', required: false },
      { id: 'cnpj', required: false }
    ]);
  });

  it('marks fields prefixed with * as required', () => {
    expect(resolveFields(['*cnpj'])).toEqual([{ id: 'cnpj', required: true }]);
  });

  it('ignores name, whatsapp and unknown identifiers', () => {
    expect(resolveFields(['name', 'whatsapp', 'x'])).toEqual([]);
  });

  it('returns an empty array for an empty input', () => {
    expect(resolveFields([])).toEqual([]);
    expect(resolveFields()).toEqual([]);
  });
});

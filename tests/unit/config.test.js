import { describe, expect, it } from 'vitest';
import { createConfig, DEFAULT_CONFIG } from '../../src/config.js';

describe('config fields default', () => {
  it('defaults fields to an empty array', () => {
    expect(DEFAULT_CONFIG.fields).toEqual([]);
    expect(createConfig().fields).toEqual([]);
  });

  it('reflects overrides', () => {
    expect(createConfig({ fields: ['*cnpj'] }).fields).toEqual(['*cnpj']);
  });
});

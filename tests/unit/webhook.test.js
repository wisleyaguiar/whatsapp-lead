import { describe, expect, it, vi } from 'vitest';
import { postLead, REGISTRATION_STATUS } from '../../src/integrations/webhook.js';

describe('webhook integration', () => {
  it('maps successful responses to success status', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    const result = await postLead('/webhook', { nome: 'Joao' }, { fetchImpl, timeoutMs: 50 });

    expect(result.status).toBe(REGISTRATION_STATUS.SUCCESS);
    expect(fetchImpl).toHaveBeenCalledWith('/webhook', expect.objectContaining({ method: 'POST' }));
  });

  it('maps HTTP failures to handled fallback status', async () => {
    const result = await postLead('/webhook', {}, {
      fetchImpl: vi.fn().mockResolvedValue({ ok: false, status: 500 }),
      timeoutMs: 50
    });

    expect(result.status).toBe(REGISTRATION_STATUS.HANDLED_FAILURE);
    expect(result.reason).toBe('http_error');
  });

  it('maps timeout to handled fallback status', async () => {
    const fetchImpl = vi.fn((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        reject(error);
      });
    }));

    const result = await postLead('/webhook', {}, { fetchImpl, timeoutMs: 1 });
    expect(result.status).toBe(REGISTRATION_STATUS.HANDLED_FAILURE);
    expect(result.reason).toBe('timeout');
  });
});

export const REGISTRATION_STATUS = {
  SUCCESS: 'sucesso',
  HANDLED_FAILURE: 'falha_tratada',
  HONEYPOT_ABORT: 'abortado_honeypot'
};

export async function postLead(webhookUrl, payload, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const timeoutMs = options.timeoutMs || 3000;

  if (!webhookUrl || typeof fetchImpl !== 'function') {
    return {
      ok: false,
      status: REGISTRATION_STATUS.HANDLED_FAILURE,
      reason: 'missing_webhook'
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // text/plain evita o preflight OPTIONS em muitos casos
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (response?.ok) {
      return {
        ok: true,
        status: REGISTRATION_STATUS.SUCCESS,
        httpStatus: response.status
      };
    }

    return {
      ok: false,
      status: REGISTRATION_STATUS.HANDLED_FAILURE,
      httpStatus: response?.status || 0,
      reason: 'http_error'
    };
  } catch (error) {
    return {
      ok: false,
      status: REGISTRATION_STATUS.HANDLED_FAILURE,
      reason: error?.name === 'AbortError' ? 'timeout' : 'network_error',
      error
    };
  } finally {
    clearTimeout(timeout);
  }
}

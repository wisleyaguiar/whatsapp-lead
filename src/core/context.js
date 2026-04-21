import { GLOBAL_SUBJECTS } from '../config.js';

export function readProductContext(element, win = window) {
  if (!element?.dataset) {
    return null;
  }

  const productName = element.dataset.productName?.trim();
  const productId = element.dataset.productId?.trim();

  if (!productName || !productId) {
    return null;
  }

  return {
    type: 'produto',
    productName,
    productId,
    sourceUrl: win.location?.href || ''
  };
}

export function getTrafficOrigin(win = window, defaultOrigin = 'Site da loja') {
  const location = win.location;
  const params = new URLSearchParams(location?.search || '');
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');

  if (source || medium || campaign) {
    return [source, medium, campaign].filter(Boolean).join(' / ');
  }

  if (win.document?.referrer) {
    return win.document.referrer;
  }

  return defaultOrigin;
}

export function createGlobalContext(win = window) {
  return {
    type: 'global',
    sourceUrl: win.location?.href || ''
  };
}

export function isValidSubject(subject, subjects = GLOBAL_SUBJECTS) {
  return subjects.includes(subject);
}

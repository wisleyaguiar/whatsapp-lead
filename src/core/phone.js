export function onlyDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

export function normalizeWhatsapp(value = '', countryCode = '55') {
  let digits = onlyDigits(value);

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (!digits.startsWith(countryCode) && (digits.length === 10 || digits.length === 11)) {
    digits = `${countryCode}${digits}`;
  }

  return digits;
}

export function isValidBrazilianWhatsapp(value = '') {
  const digits = normalizeWhatsapp(value);
  return /^55\d{10,11}$/.test(digits);
}

export function formatPhoneForDisplay(value = '') {
  const digits = onlyDigits(value).slice(0, 11);
  const area = digits.slice(0, 2);
  const prefix = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const suffix = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

  if (digits.length <= 2) return area ? `(${area}` : '';
  if (!suffix) return `(${area}) ${prefix}`;
  return `(${area}) ${prefix}-${suffix}`;
}

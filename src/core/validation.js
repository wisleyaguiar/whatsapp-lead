import { isValidBrazilianWhatsapp } from './phone.js';
import { isValidSubject } from './context.js';

export function validateName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
}

export function validateLeadForm(values, options = {}) {
  const errors = {};
  const subjects = options.subjects || undefined;
  const honeypot = String(values.honeypot || '').trim();

  if (honeypot) {
    return {
      valid: false,
      bot: true,
      errors: { honeypot: 'Envio bloqueado.' }
    };
  }

  if (!validateName(values.name)) {
    errors.name = 'Informe seu nome completo.';
  }

  if (!isValidBrazilianWhatsapp(values.whatsapp)) {
    errors.whatsapp = 'Informe um WhatsApp valido com DDD.';
  }

  if (!values.lgpdAccepted) {
    errors.lgpd = 'Aceite a politica de privacidade para continuar.';
  }

  if (!values.productContext && !isValidSubject(values.subject, subjects)) {
    errors.subject = 'Selecione um assunto de atendimento.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    bot: false,
    errors
  };
}

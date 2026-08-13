import { normalizeWhatsapp } from './phone.js';
import { getLeadTopic } from './payload.js';

export function renderMessageTemplate(template, payload) {
  return template.replace(/\{(\w+)\}/g, (_, field) => {
    if (field === 'topico') return getLeadTopic(payload);
    return payload[field] ?? '';
  });
}

export function buildWhatsappMessage(payload, config = {}) {
  if (typeof config.messageTemplate === 'string' && config.messageTemplate.trim()) {
    return renderMessageTemplate(config.messageTemplate, payload);
  }

  const topic = getLeadTopic(payload);
  if (!payload.nome) {
    return topic ? `Ola! Gostaria de atendimento sobre ${topic}.` : 'Ola! Gostaria de atendimento.';
  }
  return `Ola! Me chamo ${payload.nome} e gostaria de atendimento sobre ${topic}. Podem me ajudar? Vim pelo site. (Ref: ${payload.origem_trafego}).`;
}

export function buildWhatsappUrl(phoneNumber, payload, config = {}) {
  const phone = normalizeWhatsapp(phoneNumber);
  const message = encodeURIComponent(buildWhatsappMessage(payload, config));
  return `https://wa.me/${phone}?text=${message}`;
}

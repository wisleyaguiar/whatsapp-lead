import { normalizeWhatsapp } from './phone.js';
import { getLeadTopic } from './payload.js';

export function buildWhatsappMessage(payload) {
  const topic = getLeadTopic(payload);
  return `Ola! Me chamo ${payload.nome} e gostaria de atendimento sobre ${topic}. Podem me ajudar? Vim pelo site. (Ref: ${payload.origem_trafego}).`;
}

export function buildWhatsappUrl(phoneNumber, payload) {
  const phone = normalizeWhatsapp(phoneNumber);
  const message = encodeURIComponent(buildWhatsappMessage(payload));
  return `https://wa.me/${phone}?text=${message}`;
}

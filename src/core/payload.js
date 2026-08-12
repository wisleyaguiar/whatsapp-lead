import { normalizeWhatsapp } from './phone.js';
import { FIELD_DEFINITIONS } from './fields.js';

export function formatDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join('-') + ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function buildLeadPayload(input) {
  const payload = {
    nome: String(input.name || '').trim(),
    whatsapp: normalizeWhatsapp(input.whatsapp),
    origem_trafego: input.origin || 'Site',
    url_origem: input.sourceUrl || '',
    data_hora: formatDateTime(input.date || new Date())
  };

  if (input.productContext?.productName && input.productContext?.productId) {
    payload.produto_interesse = input.productContext.productName;
    payload.produto_id = input.productContext.productId;
  } else {
    payload.assunto = input.subject;
  }

  for (const field of input.fields || []) {
    payload[FIELD_DEFINITIONS[field.id].payloadKey] = String(input[field.id] || '').trim();
  }

  return payload;
}

export function getLeadTopic(payload) {
  return payload.produto_interesse || payload.assunto || '';
}

export function hasRequiredPayloadShape(payload) {
  const hasBase = Boolean(
    payload?.nome &&
      /^55\d{10,11}$/.test(payload.whatsapp || '') &&
      payload.origem_trafego &&
      payload.url_origem &&
      payload.data_hora
  );
  const hasTopic = Boolean(
    (payload.produto_interesse && payload.produto_id) ||
      ['Duvida tecnica', 'Pedidos', 'Cadastro'].includes(payload.assunto)
  );
  return hasBase && hasTopic;
}

export function pushGtmEvent(win, eventName, data = {}) {
  if (!win?.dataLayer || !Array.isArray(win.dataLayer)) {
    return false;
  }

  win.dataLayer.push({
    event: eventName,
    contexto: data.contexto || 'global',
    produto_id: data.produto_id || null,
    assunto: data.assunto || null
  });
  return true;
}

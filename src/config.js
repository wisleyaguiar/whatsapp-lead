export const GLOBAL_SUBJECTS = ['Duvida tecnica', 'Pedidos', 'Cadastro'];

export const DEFAULT_CONFIG = {
  brandColor: '#25D366',
  textColor: '#1f2933',
  productSubjectValue: '__product__',
  productSubjectLabel: 'Sobre o produto',
  phoneNumber: '',
  webhookUrl: '',
  webhookTimeoutMs: 3000,
  openEventName: 'wpp_qualificacao_inicio',
  completeEventName: 'wpp_qualificacao_concluida',
  floatingButtonSelector: '[data-wpp-lead-button]',
  productTriggerSelector: '.wpp-lead-product-trigger',
  widgetRootId: 'wpp-lead-widget-root',
  honeypotName: 'company_url',
  defaultOrigin: 'Site da loja',
  redirectMode: 'location',
  onRedirect: null,
  fetchImpl: null,
  now: () => new Date()
};

export function createConfig(overrides = {}) {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    subjects: Array.isArray(overrides.subjects) && overrides.subjects.length > 0
      ? overrides.subjects
      : GLOBAL_SUBJECTS
  };
}

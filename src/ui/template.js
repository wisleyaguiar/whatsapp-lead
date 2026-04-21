export function createElementFromHtml(html, doc = document) {
  const template = doc.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

export function getWidgetMarkup(config) {
  const subjects = config.subjects
    .map((subject) => `<option value="${subject}">${subject}</option>`)
    .join('');

  return `
    <section class="wpp-lead-panel" aria-label="Atendimento por WhatsApp" hidden>
      <header class="wpp-lead-header">
        <div>
          <strong>Atendimento pelo WhatsApp</strong>
          <p>Preencha seus dados para iniciar a conversa.</p>
        </div>
      </header>
      <form class="wpp-lead-form" novalidate>
        <div class="wpp-lead-product-question" data-role="product-question" hidden>
          <span class="wpp-lead-product-bubble">
            Atendimento sobre <strong data-role="product-name"></strong>
          </span>
        </div>
        <label>
          Nome completo
          <input name="name" autocomplete="name" required />
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" inputmode="tel" autocomplete="tel" required />
        </label>
        <label data-role="subject-field">
          Assunto
          <select name="subject" required>
            <option value="">Selecione</option>
            <option value="${config.productSubjectValue}" hidden>${config.productSubjectLabel}</option>
            ${subjects}
          </select>
        </label>
        <label class="wpp-lead-lgpd">
          <input name="lgpd" type="checkbox" />
          Aceito compartilhar meus dados para atendimento conforme a LGPD.
        </label>
        <input class="wpp-lead-hp" name="${config.honeypotName}" tabindex="-1" autocomplete="off" />
        <div class="wpp-lead-errors" role="alert" aria-live="polite"></div>
        <button class="wpp-lead-submit" type="submit">Enviar e Iniciar Conversa</button>
      </form>
    </section>
  `;
}

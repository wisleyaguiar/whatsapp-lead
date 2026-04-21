import { formatPhoneForDisplay } from '../core/phone.js';
import { createGlobalContext, getTrafficOrigin, readProductContext } from '../core/context.js';
import { validateLeadForm } from '../core/validation.js';
import { buildLeadPayload } from '../core/payload.js';
import { buildWhatsappUrl } from '../core/whatsapp.js';
import { pushGtmEvent } from '../integrations/gtm.js';
import { postLead, REGISTRATION_STATUS } from '../integrations/webhook.js';
import { createElementFromHtml, getWidgetMarkup } from './template.js';

export class LeadWidget {
  constructor(config, win = window) {
    this.config = config;
    this.win = win;
    this.doc = win.document;
    this.context = createGlobalContext(win);
    this.isOpen = false;
    this.root = null;
    this.button = null;
    this.panel = null;
    this.form = null;
    this.errors = null;
  }

  mount() {
    this.doc.getElementById(this.config.widgetRootId)?.remove();

    this.root = this.doc.createElement('div');
    this.root.id = this.config.widgetRootId;
    this.root.className = 'wpp-lead-root';
    this.root.style.setProperty('--wpp-lead-color', this.config.brandColor);
    this.root.style.setProperty('--wpp-lead-text', this.config.textColor);

    this.button = this.doc.createElement('button');
    this.button.type = 'button';
    this.button.className = 'wpp-lead-button';
    this.button.dataset.wppLeadButton = 'true';
    this.button.setAttribute('aria-label', 'Abrir atendimento pelo WhatsApp');
    this.button.setAttribute('aria-expanded', 'false');
    this.button.innerHTML = this.getButtonIconMarkup();

    this.panel = createElementFromHtml(getWidgetMarkup(this.config), this.doc);
    this.form = this.panel.querySelector('form');
    this.errors = this.panel.querySelector('.wpp-lead-errors');

    this.root.append(this.button, this.panel);
    this.doc.body.append(this.root);

    this.bindEvents();
    return this;
  }

  bindEvents() {
    this.button.addEventListener('click', () => {
      this.toggle(createGlobalContext(this.win));
    });

    this.getField('whatsapp').addEventListener('input', (event) => {
      event.target.value = formatPhoneForDisplay(event.target.value);
    });

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submit();
    });
  }

  attachProductTriggers() {
    const triggers = this.doc.querySelectorAll(this.config.productTriggerSelector);
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        const productContext = readProductContext(trigger, this.win);
        this.open(productContext || createGlobalContext(this.win));
      });
    });
  }

  toggle(context) {
    if (this.isOpen) {
      this.close();
    } else {
      this.open(context);
    }
  }

  open(context = createGlobalContext(this.win)) {
    this.context = context;
    this.isOpen = true;
    this.panel.hidden = false;
    this.button.setAttribute('aria-label', 'Fechar atendimento pelo WhatsApp');
    this.button.setAttribute('aria-expanded', 'true');
    this.root.classList.add('is-open');
    this.renderContext();
    pushGtmEvent(this.win, this.config.openEventName, this.getEventData());
  }

  close() {
    this.isOpen = false;
    this.panel.hidden = true;
    this.button.setAttribute('aria-label', 'Abrir atendimento pelo WhatsApp');
    this.button.setAttribute('aria-expanded', 'false');
    this.root.classList.remove('is-open');
  }

  renderContext() {
    const question = this.panel.querySelector('[data-role="product-question"]');
    const productName = this.panel.querySelector('[data-role="product-name"]');
    const subjectField = this.panel.querySelector('[data-role="subject-field"]');
    const subjectSelect = this.getField('subject');
    const productOption = subjectSelect?.querySelector(`option[value="${this.config.productSubjectValue}"]`);

    if (this.context?.type === 'produto') {
      question.hidden = false;
      productName.textContent = this.context.productName;
      subjectField.hidden = false;
      if (productOption) {
        productOption.hidden = false;
      }
      subjectSelect.value = this.config.productSubjectValue;
      subjectSelect.disabled = true;
    } else {
      question.hidden = true;
      productName.textContent = '';
      subjectField.hidden = false;
      if (productOption) {
        productOption.hidden = true;
      }
      subjectSelect.disabled = false;
      subjectSelect.value = '';
    }

    this.clearErrors();
  }

  collectValues() {
    return {
      name: this.getField('name').value,
      whatsapp: this.getField('whatsapp').value,
      subject: this.getField('subject').value,
      lgpdAccepted: this.getField('lgpd').checked,
      honeypot: this.getField(this.config.honeypotName)?.value || '',
      productContext: this.context?.type === 'produto' ? this.context : null
    };
  }

  async submit() {
    const values = this.collectValues();
    const validation = validateLeadForm(values, { subjects: this.config.subjects });

    if (validation.bot) {
      this.showErrors(['Envio bloqueado.']);
      return { status: REGISTRATION_STATUS.HONEYPOT_ABORT };
    }

    if (!validation.valid) {
      this.showErrors(Object.values(validation.errors));
      return { status: 'erro_validacao', errors: validation.errors };
    }

    this.showStatus('Enviando seus dados...');
    const payload = buildLeadPayload({
      ...values,
      origin: getTrafficOrigin(this.win, this.config.defaultOrigin),
      sourceUrl: this.win.location?.href || '',
      date: this.config.now()
    });

    const registration = await postLead(this.config.webhookUrl, payload, {
      fetchImpl: this.config.fetchImpl,
      timeoutMs: this.config.webhookTimeoutMs
    });

    pushGtmEvent(this.win, this.config.completeEventName, this.getEventData(payload));
    const url = buildWhatsappUrl(this.config.phoneNumber, payload);
    this.redirect(url);
    this.showStatus(registration.ok ? 'Abrindo WhatsApp...' : 'Abrindo WhatsApp mesmo assim...');

    return { status: registration.status, payload, redirectUrl: url };
  }

  redirect(url) {
    if (this.config.redirectMode === 'callback' && typeof this.config.onRedirect === 'function') {
      this.config.onRedirect(url);
      return;
    }

    this.win.location.href = url;
  }

  getEventData(payload = null) {
    if (this.context?.type === 'produto') {
      return {
        contexto: 'produto',
        produto_id: this.context.productId,
        assunto: this.context.productName
      };
    }

    return {
      contexto: 'global',
      produto_id: null,
      assunto: payload?.assunto || this.getField('subject')?.value || null
    };
  }

  getField(name) {
    return this.form?.elements?.[name];
  }

  getButtonIconMarkup() {
    return `
      <span class="wpp-lead-button-icon" aria-hidden="true">
        <svg class="wpp-lead-button-icon-whatsapp" viewBox="0 0 24 24" focusable="false">
          <path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.62 2 2.2 6.42 2.2 11.83c0 1.73.45 3.42 1.31 4.91L2 22l5.42-1.42a9.8 9.8 0 0 0 4.61 1.17h.01c5.41 0 9.83-4.42 9.83-9.83 0-2.63-1.03-5.11-2.82-7.01Zm-7.02 15.17h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.22.85.86-3.14-.2-.32a8.1 8.1 0 0 1-1.25-4.33c0-4.48 3.65-8.13 8.14-8.13a8.04 8.04 0 0 1 5.77 2.39 8.06 8.06 0 0 1 2.37 5.74c0 4.48-3.65 8.15-8.13 8.15Zm4.46-6.1c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.22-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.48-.4-.41-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.01.4 1.35.52.57.18 1.08.15 1.48.09.45-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
        </svg>
        <svg class="wpp-lead-button-icon-close" viewBox="0 0 24 24" focusable="false">
          <path fill="currentColor" d="M18.3 7.71 16.89 6.3 12.3 10.89 7.71 6.3 6.3 7.71 10.89 12.3 6.3 16.89l1.41 1.41 4.59-4.59 4.59 4.59 1.41-1.41-4.59-4.59z" />
        </svg>
      </span>
    `;
  }

  showErrors(messages) {
    this.errors.textContent = messages.filter(Boolean).join(' ');
  }

  showStatus(message) {
    this.errors.textContent = message;
  }

  clearErrors() {
    this.errors.textContent = '';
  }
}

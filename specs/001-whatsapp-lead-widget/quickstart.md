# Quickstart: Widget de Qualificacao de Leads WhatsApp Tray

## 1. Install Development Dependencies

```bash
npm install
```

## 2. Run Automated Checks

```bash
npm run lint
npm run test:unit
npm run test:integration
```

## 3. Validate Global Flow

1. Open a sample storefront page without product attributes.
2. Click the floating WhatsApp button.
3. Confirm the panel opens with slide/fade transition and the icon changes to close.
4. Fill full name, valid WhatsApp, select "Duvida tecnica" and accept LGPD.
5. Submit and confirm:
   - `wpp_qualificacao_inicio` is emitted on open.
   - Lead payload contains name, normalized WhatsApp, subject, origin, URL and date/time.
   - `wpp_qualificacao_concluida` is emitted.
   - WhatsApp opens with the expected message.

## 4. Validate Product Flow

1. Add the product snippet with:

```html
<button
  class="wpp-lead-product-trigger"
  data-product-name="Anel de Diamante Vereda"
  data-product-id="123"
>
  Comprar pelo WhatsApp
</button>
```

2. Click the snippet and confirm the widget asks about the product.
3. Submit a valid lead and confirm the payload includes product name and product ID.
4. Remove one product attribute and confirm the widget falls back to the global subject
   menu without scraping page text.

## 5. Validate Blocking Rules

1. Submit without LGPD accepted and confirm no payload or WhatsApp redirect occurs.
2. Submit with incomplete WhatsApp and confirm validation blocks the flow.
3. Fill the hidden honeypot field and confirm payload and redirect are both aborted.

## 6. Validate Webhook Fallback

1. Simulate a successful registration response and confirm WhatsApp opens after success.
2. Simulate a network error.
3. Simulate a timeout.
4. Confirm valid leads still reach WhatsApp for error and timeout scenarios.

## 7. Validate Mobile Usability

1. Test at 360px width.
2. Confirm fields, validation messages and final button remain readable and reachable.
3. Confirm the widget does not cover required form controls.

# WhatsApp Tray Lead Widget

Widget embutivel para qualificar visitantes da Tray antes de abrir o WhatsApp. Ele
captura nome, telefone, assunto ou produto de interesse, aceite LGPD, origem de trafego,
evento GTM e payload de lead para webhook externo.

## Instalar no tema Tray

1. Gere o bundle:

```bash
npm install
npm run build
```

2. Publique os arquivos de `dist/` no ambiente de assets do tema.
3. Inclua o script final no rodape do tema.
4. Inicialize o widget com as configuracoes da loja:

```html
<script>
  window.WhatsAppTrayLeadWidget.init({
    phoneNumber: '5511999999999',
    webhookUrl: 'https://exemplo.com/webhook',
    brandColor: '#25D366'
  });
</script>
```

## Snippet de produto

Insira o gatilho no template de produto para enviar contexto estruturado via Twig:

```html
<button
  class="wpp-lead-product-trigger"
  data-product-name="{{ product.name }}"
  data-product-id="{{ product.id }}"
>
  Tenho uma duvida sobre esta joia
</button>
```

Se `data-product-name` ou `data-product-id` estiverem ausentes, o widget usa o fluxo
global com assunto manual. Ele nao tenta ler texto visual da pagina.

## Configuracoes

- `phoneNumber`: numero de destino do WhatsApp com DDI.
- `webhookUrl`: destino HTTP para registrar o lead.
- `webhookTimeoutMs`: limite para aguardar o registro antes do fallback.
- `brandColor`: cor principal do widget.
- `openEventName`: nome do evento de abertura no dataLayer.
- `completeEventName`: nome do evento de conclusao no dataLayer.
- `productTriggerSelector`: seletor dos botoes/snippets de produto.

## Validacao

```bash
npm run lint
npm run test:unit
npm run test:integration
npm run build
```

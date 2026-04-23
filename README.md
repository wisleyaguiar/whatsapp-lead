# WhatsApp Lead Widget

Widget embutível para qualificar visitantes de e-commerces (como a plataforma Tray) antes de abrir o WhatsApp. Ele captura nome, telefone, assunto ou produto de interesse, aceite LGPD, origem de tráfego, evento GTM e envia os dados para um webhook externo.

## Instalação Rápida (CDN)

A maneira mais fácil de usar o widget é carregar os arquivos diretamente da CDN do **Cloudflare Pages**:

```html
<!-- 1. Estilos do Widget -->
<link rel="stylesheet" href="https://whatsapp-lead.wisleyaguiar.workers.dev/whatsapp-widget.css">

<!-- 2. Script do Widget -->
<script src="https://whatsapp-lead.wisleyaguiar.workers.dev/whatsapp-widget.js"></script>

<!-- 3. Inicialização -->
<script>
  window.addEventListener('DOMContentLoaded', () => {
    if (window.WhatsAppLeadWidget) {
      window.WhatsAppLeadWidget.init({
        phoneNumber: '5511999999999',
        webhookUrl: 'https://seu-webhook.com/leads',
        brandColor: '#25D366',
        subjects: ['Dúvida técnica', 'Pedidos', 'Trocas', 'Outros']
      });
    }
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
  Comprar pelo WhatsApp
</button>
```

Se `data-product-name` ou `data-product-id` estiverem ausentes, o widget usa o fluxo
global com assunto manual. Ele nao tenta ler texto visual da pagina.

## Configuracoes

- `phoneNumber`: número de destino do WhatsApp com DDI.
- `webhookUrl`: destino HTTP para registrar o lead.
- `subjects`: (Array) Lista de opções para o campo de assunto. Padrão: `['Dúvida técnica', 'Pedidos', 'Cadastro', 'Outros']`.
- `webhookTimeoutMs`: limite para aguardar o registro antes do fallback.
- `brandColor`: cor principal do widget.
- `openEventName`: nome do evento de abertura no dataLayer.
- `completeEventName`: nome do evento de conclusao no dataLayer.
- `productTriggerSelector`: seletor dos botoes/snippets de produto.

## Desenvolvimento e Deploy

O projeto utiliza **Vite 6** e está configurado para deploy contínuo no **Cloudflare Pages**.

### Fluxo de Trabalho
1. Faça as alterações no código em `src/`.
2. Teste localmente com `npm run dev`.
3. Garanta que os testes passem: `npm test`.
4. Envie para o GitHub: `git push origin main`.
5. O Cloudflare Pages detectará o push e atualizará o widget automaticamente em segundos.

### Comandos Disponíveis
- `npm run dev`: Servidor de desenvolvimento.
- `npm run build`: Gera o bundle manualmente em `dist/`.
- `npm test`: Executa todos os testes (Unit + Integration).
- `npm run lint`: Verifica o estilo do código.

## Tagueamento e Métricas com o Google Tag Manager

O widget envia eventos para o Data Layer que podem ser consumidos pelo Google Tag Manager (GTM) para disparo de metas, eventos, remarketing e análises. Os eventos padrão são `wpp_qualificacao_inicio` quando a pessoa clica no botão e abre a janela do formulário e `wpp_qualificacao_concluida` quando a pessoa clica em enviar mensagem, mas os nomes podem ser personalizados via configuração. Use `openEventName` e `completeEventName` para configurar os nomes dos eventos na configuração do widget.
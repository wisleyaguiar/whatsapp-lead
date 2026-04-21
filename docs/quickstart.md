# Quickstart de Validacao

## Fluxo Global

1. Abra uma pagina sem atributos de produto.
2. Clique em "WhatsApp".
3. Preencha nome completo, WhatsApp valido, assunto e aceite LGPD.
4. Envie o formulario.
5. Confirme payload, eventos `wpp_qualificacao_inicio` e
   `wpp_qualificacao_concluida`, e URL do WhatsApp com mensagem preenchida.

## Fluxo de Produto

1. Insira um botao com `data-product-name` e `data-product-id`.
2. Clique no snippet.
3. Confirme a pergunta sobre o produto.
4. Envie um lead valido.
5. Confirme que payload e mensagem incluem produto e identificador.

## Bloqueios

1. Envie sem LGPD: deve bloquear registro e redirecionamento.
2. Envie telefone incompleto: deve mostrar erro.
3. Preencha o honeypot: deve abortar webhook, evento de conclusao e WhatsApp.

## Fallback de Webhook

1. Simule resposta de sucesso: WhatsApp abre apos registro.
2. Simule erro externo: WhatsApp ainda abre.
3. Simule timeout: WhatsApp ainda abre.

## UX e Acessibilidade

1. Teste largura de 360px.
2. Confirme que campos e botao final ficam legiveis e alcancaveis.
3. Confirme foco visivel em campos, select e botoes.
4. Confirme contraste suficiente entre texto, fundo e controles.
5. Confirme abertura visual em menos de 500ms.

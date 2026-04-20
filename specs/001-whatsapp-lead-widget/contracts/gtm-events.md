# Contract: GTM Events

## wpp_qualificacao_inicio

Dispatched when the qualification window opens.

```json
{
  "event": "wpp_qualificacao_inicio",
  "contexto": "global",
  "produto_id": null,
  "assunto": null
}
```

## wpp_qualificacao_concluida

Dispatched after valid submission reaches successful registration or handled fallback.

```json
{
  "event": "wpp_qualificacao_concluida",
  "contexto": "produto",
  "produto_id": "123",
  "assunto": "Anel de Diamante Vereda"
}
```

## Safety Rules

- If `window.dataLayer` is absent, the widget MUST continue without throwing.
- Event names MUST be configurable but default to the values above.
- Honeypot aborts MUST NOT dispatch the conclusion event.

# Implementation Plan: Widget de Qualificacao de Leads WhatsApp Tray

**Branch**: `001-whatsapp-lead-widget` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-whatsapp-lead-widget/spec.md`

## Summary

Implementar um widget embutivel para lojas Tray que qualifica visitantes antes do
WhatsApp. A solucao tera um botao global, um snippet de produto, formulario com nome,
telefone, assunto/produto e aceite LGPD, registro externo do lead, eventos de
mensuracao e fallback comercial para abrir WhatsApp mesmo se o registro externo falhar.

## Technical Context

**Language/Version**: JavaScript ES2020, HTML5, CSS3  
**Primary Dependencies**: Nenhuma dependencia de runtime; ferramentas de desenvolvimento
propostas: Vite para empacotamento simples, Vitest para unidade e Playwright para fluxo
DOM em navegador  
**Storage**: Sem armazenamento local persistente; lead enviado para webhook externo  
**Testing**: Vitest para funcoes puras; Playwright para abertura/fechamento, validacao,
honeypot, eventos e fallback de webhook  
**Target Platform**: Lojas Tray renderizadas em navegadores desktop/mobile modernos  
**Project Type**: Script frontend embutivel com snippet HTML de produto  
**Performance Goals**: Widget abre visualmente em menos de 500ms apos clique; formulario
valido redireciona para WhatsApp em ate 2s quando o webhook responde, ou ate 3s com
timeout tratado  
**Constraints**: Nao depender de scraping visual; nao bloquear WhatsApp por falha de
webhook; exigir LGPD; abortar bots via honeypot; configuracoes centralizadas  
**Scale/Scope**: Uma loja Tray por instalacao, multiplas paginas, fluxos global e produto
compartilhando a mesma base de codigo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Codigo modular e configuravel**: PASS. O plano separa configuracao, leitura de
  contexto, validacao, payload, mensuracao, webhook e redirecionamento em modulos de
  `src/`.
- **Integracao Tray/Twig estavel**: PASS. O contrato de produto usa `data-product-name`
  e `data-product-id`; scraping visual fica proibido.
- **Testes nos caminhos criticos**: PASS. Testes de unidade e integracao cobrem mascara,
  LGPD, honeypot, payload, eventos, mensagem, sucesso e falha de webhook.
- **Experiencia consistente e consentimento claro**: PASS. O mesmo fluxo atende widget
  global e snippet de produto, com validacao visivel e acao final unica.
- **Performance e resiliencia comercial**: PASS. O webhook sera assincrono com timeout e
  fallback, e a ausencia de `dataLayer` nao quebra o fluxo.

## Project Structure

### Documentation (this feature)

```text
specs/001-whatsapp-lead-widget/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── lead-payload.schema.json
│   ├── product-context.md
│   └── gtm-events.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── config.js
├── index.js
├── styles.css
├── snippet.html
├── core/
│   ├── context.js
│   ├── validation.js
│   ├── payload.js
│   ├── phone.js
│   └── whatsapp.js
├── integrations/
│   ├── gtm.js
│   └── webhook.js
└── ui/
    ├── widget.js
    └── template.js

tests/
├── unit/
│   ├── phone.test.js
│   ├── validation.test.js
│   ├── payload.test.js
│   └── whatsapp.test.js
└── integration/
    ├── global-widget.spec.js
    ├── product-widget.spec.js
    └── webhook-fallback.spec.js
```

**Structure Decision**: Usar uma estrutura frontend unica, sem backend proprio, porque
o produto sera distribuido como script/snippet embutivel em Tray e envia leads para
servicos externos configuraveis.

## Phase 0: Research

Gerado em [research.md](./research.md). As decisoes principais sao: JavaScript vanilla
modular para runtime, configuracao centralizada, contrato data-* para produto, webhook
com timeout e fallback, GTM tolerante a ausencia de `dataLayer`, e testes com Vitest e
Playwright.

## Phase 1: Design & Contracts

Gerados:

- [data-model.md](./data-model.md)
- [contracts/lead-payload.schema.json](./contracts/lead-payload.schema.json)
- [contracts/product-context.md](./contracts/product-context.md)
- [contracts/gtm-events.md](./contracts/gtm-events.md)
- [quickstart.md](./quickstart.md)

## Constitution Check (Post-Design)

- **Codigo modular e configuravel**: PASS. A estrutura define arquivos especificos para
  configuracao, core, integracoes e UI.
- **Integracao Tray/Twig estavel**: PASS. `product-context.md` documenta os atributos
  aceitos e fallback global quando ausentes.
- **Testes nos caminhos criticos**: PASS. `quickstart.md` e a estrutura de testes cobrem
  todos os caminhos obrigatorios pela constituicao.
- **Experiencia consistente e consentimento claro**: PASS. O contrato de UI preserva uma
  unica acao final e bloqueia envio sem LGPD.
- **Performance e resiliencia comercial**: PASS. O timeout de webhook e o fallback para
  WhatsApp estao documentados como obrigatorios.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

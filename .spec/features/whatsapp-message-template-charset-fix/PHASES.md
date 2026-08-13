# Phases: whatsapp-message-template-charset-fix

Gerado por /plan a partir de PLAN.md — view executável para `./ralph.sh .spec/features/whatsapp-message-template-charset-fix/PHASES.md`.

## Phase 1: Config, core message rendering, docs e charset dos assets

Antes de implementar, leia:
1. `.spec/features/whatsapp-message-template-charset-fix/SPEC.md` — requisitos RIGID que esta fase cobre
2. `.spec/features/whatsapp-message-template-charset-fix/PLAN.md` — decomposição completa, dependências e riscos
3. `.spec/features/whatsapp-message-template-charset-fix/openapi.yaml` — contrato de header `charset=utf-8` dos assets (CT-02)

- [x] T01 — Adicionar `messageTemplate` à configuração
      Arquivos: `src/config.js`
      Mudança: adicionar `messageTemplate: null` a `DEFAULT_CONFIG` (chave opcional, default `null`); `createConfig` já propaga overrides via spread, sem mudança adicional.
      Cobre: CT-01
      Acceptance criteria: `DEFAULT_CONFIG.messageTemplate` é `null`; `createConfig({ messageTemplate: 'x' }).messageTemplate === 'x'`.
      Testes: `tests/unit/config.test.js` — novo describe cobrindo default `null` e override refletido.

- [x] T02 — Implementar substituição de placeholders em `buildWhatsappMessage`
      Arquivos: `src/core/whatsapp.js`
      Mudança: adicionar `renderMessageTemplate(template, payload)` (regex `/\{(\w+)\}/g`; `{topico}` resolve via `getLeadTopic(payload)`, demais placeholders resolvem via `payload[campo] ?? ''`). Estender `buildWhatsappMessage(payload, config = {})` e `buildWhatsappUrl(phoneNumber, payload, config = {})` com parâmetro `config` opcional (retrocompatível): se `typeof config.messageTemplate === 'string'` e não vazio após `.trim()`, usar `renderMessageTemplate`; senão manter exatamente a lógica atual (byte-idêntica).
      Cobre: RF-01, RF-02, RF-03, RF-04, RF-05, RNF-02
      Acceptance criteria: as 2 asserções pré-existentes de `tests/unit/whatsapp.test.js` continuam passando inalteradas (RNF-02); `messageTemplate: 'Ola {nome}, sobre {topico}'` + payload `{nome:'Joao', assunto:'Pedidos'}` retorna `'Ola Joao, sobre Pedidos'`; template com placeholder ausente do payload retorna string vazia no lugar (nunca lança exceção, nunca deixa `{campo}` literal); `messageTemplate` não-string cai no fallback de RF-02.
      Testes: `tests/unit/whatsapp.test.js` — casos RF-01 (placeholder resolvido), RF-02 (fallback com/sem `nome`), RF-03 (placeholder de campo extra, ex. `{cnpj}`), RF-04 (placeholder ausente vira `''` e `buildWhatsappUrl` retorna URL válida/decodificável), RF-05 (`messageTemplate: 123` cai no fallback).

- [x] T04 — Documentar `messageTemplate` no README
      Arquivos: `README.md`
      Mudança: na seção `## Configuracoes`, adicionar item `messageTemplate` com tipo, comportamento de fallback (ausente/vazio/tipo inválido), lista completa dos placeholders de RF-03 (`{nome}`, `{whatsapp}`, `{origem_trafego}`, `{url_origem}`, `{data_hora}`, `{assunto}`, `{produto_interesse}`, `{produto_id}`, `{topico}`, `{cnpj}`, `{razao_social}`, `{email}`), comportamento de placeholder sem valor, e um bloco de exemplo com template customizado + exemplo do fallback padrão.
      Cobre: RF-08
      Acceptance criteria: `README.md` seção `## Configuracoes` contém a string `messageTemplate`, todos os placeholders listados acima, e um bloco de exemplo de uso.
      Testes: verificação manual (`grep`); não é comportamento de código.

- [x] T05 — Forçar `charset=utf-8` nos assets do widget
      Arquivos: `public/_headers`
      Mudança: criar `public/_headers` com regras de header para `/whatsapp-widget.js` (`Content-Type: text/javascript; charset=utf-8`) e `/whatsapp-widget.css` (`Content-Type: text/css; charset=utf-8`). `vite.config.js` usa `publicDir` padrão (`'public'`), então o Vite copia o arquivo para a raiz do `dist/` em todo `vite build`; nenhuma alteração em `index.html`/`snippet.html` do site consumidor (RF-07).
      Cobre: RF-06, RF-07, CT-02, RNF-03
      Acceptance criteria: após `npm run build && npm run preview`, `curl -I http://127.0.0.1:<porta>/whatsapp-widget.js` e `/whatsapp-widget.css` retornam `Content-Type` contendo `charset=utf-8`; nenhuma instrução de alteração de `<meta charset>`/headers do site hospedeiro é adicionada ao README.
      Testes: sem teste automatizado (Playwright roda contra `npm run dev`, que não reproduz o pipeline de assets estáticos do Workers); verificação via `curl -I` local (`npm run preview`) e pós-deploy, conforme AC literal de RF-06/RNF-03.

## Phase 2: Wiring do widget

Antes de implementar, leia:
1. `.spec/features/whatsapp-message-template-charset-fix/SPEC.md` — requisitos RIGID que esta fase cobre
2. `.spec/features/whatsapp-message-template-charset-fix/PLAN.md` — decomposição completa, dependências e riscos

- [x] T03 — Propagar `config` para `buildWhatsappUrl` no widget
      Arquivos: `src/ui/widget.js`
      Mudança: nos dois call sites existentes de `buildWhatsappUrl(this.config.phoneNumber, payload)` — em `open()` (modo `disableForm`) e em `submit()` — adicionar `this.config` como terceiro argumento: `buildWhatsappUrl(this.config.phoneNumber, payload, this.config)`.
      Cobre: RF-01 (cobertura do fluxo `open()`/`disableForm`)
      Acceptance criteria: ambos os call sites passam `this.config` como terceiro argumento; `tests/integration/global-widget.spec.js` e `tests/integration/disable-form.spec.js` continuam passando sem alteração.
      Testes: `tests/integration/global-widget.spec.js`, `tests/integration/disable-form.spec.js` — regressão (sem novo teste; wiring de 1 linha por call site, já coberta unitariamente em T02).

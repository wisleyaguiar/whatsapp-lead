# Phases: lead-form-configurable-fields

Gerado por /plan a partir de PLAN.md — view executável para `./ralph.sh .spec/features/lead-form-configurable-fields/PHASES.md`.

## Phase 1: Módulo de resolução de campos e config base

Antes de implementar, leia:
1. `.spec/features/lead-form-configurable-fields/SPEC.md` — requisitos RIGID que esta fase cobre
2. `.spec/features/lead-form-configurable-fields/PLAN.md` — decomposição completa, dependências e riscos

- [x] T01 — Módulo `core/fields.js` (resolução pura de campos configuráveis)
      Arquivos: `src/core/fields.js`
      Mudança: Exportar `FIELD_DEFINITIONS` (mapa `cnpj`/`razaoSocial`/`email` → `{label, payloadKey, errorMessage}`) e `resolveFields(fieldsConfig = [])`, que remove prefixo `"*"` (seta `required: true`), filtra apenas identificadores conhecidos (ignora `"name"`/`"whatsapp"`/desconhecidos) e preserva a ordem original, retornando `[{id, required}]`.
      Cobre: RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07
      Acceptance criteria: `resolveFields(["email","cnpj"])` retorna `[{id:'email',required:false},{id:'cnpj',required:false}]` na ordem dada; `resolveFields(["*cnpj"])` retorna `required:true` para `cnpj`; `resolveFields(["name","whatsapp","x"])` retorna `[]`.
      Testes: `tests/unit/fields.test.js` — ordem preservada, prefixo `*`, name/whatsapp ignorados, desconhecido ignorado, array vazio.
- [x] T02 — Novo default `fields: []` em `config.js`
      Arquivos: `src/config.js`
      Mudança: Adicionar `fields: []` a `DEFAULT_CONFIG`, convenção `camelCase` consistente com `webhookTimeoutMs`/`honeypotName`.
      Cobre: CT-01
      Acceptance criteria: `DEFAULT_CONFIG.fields` é `[]`; `createConfig({fields:['*cnpj']}).fields` reflete o override; `createConfig().fields` é `[]` por default.
      Testes: `tests/unit/config.test.js` — asserts acima.
- [x] T07 — Hook de teste `fields` via querystring em `index.html`
      Arquivos: `index.html`
      Mudança: Ler `new URLSearchParams(window.location.search).get('fields')`, `.split(',')` se presente, passar como `fields` no objeto de config de `initWhatsAppLeadWidget`, seguindo o precedente de `window.__wppLeadMode` (hook só-para-teste, fora do bundle `dist/`).
      Cobre: infraestrutura de teste para RF-01..RF-11, UI-01, UI-02
      Acceptance criteria: acessar `/?fields=email,cnpj` inicializa o widget com `config.fields === ['email','cnpj']`; sem o param, comportamento AS IS é preservado (`fields` não definido no objeto de config, resultando no default `[]`).
      Testes: exercitado indiretamente por `tests/integration/configurable-fields.spec.js` (T08).

## Phase 2: Consumo do resolver em template, validação e payload

Antes de implementar, leia:
1. `.spec/features/lead-form-configurable-fields/SPEC.md` — requisitos RIGID que esta fase cobre
2. `.spec/features/lead-form-configurable-fields/PLAN.md` — decomposição completa, dependências e riscos

- [x] T03 — Renderização dinâmica dos campos em `template.js`
      Arquivos: `src/ui/template.js`
      Mudança: Importar `resolveFields`, `FIELD_DEFINITIONS` de `../core/fields.js`; manter Nome/WhatsApp fixos nas 2 primeiras posições; inserir loop sobre `resolveFields(config.fields)` entre WhatsApp e o bloco de Assunto, gerando `<label>{label}<input name="{id}" required?/></label>` no padrão estrutural existente; Assunto/LGPD/honeypot permanecem na mesma posição relativa.
      Cobre: RF-01, RF-02, RF-03, RF-04, RF-05, RF-08, UI-01, UI-02
      Acceptance criteria: `getWidgetMarkup({...config, fields:['email','cnpj']})` renderizado produz `form.elements.email`/`.cnpj` nessa ordem após `whatsapp`; `fields:[]` não renderiza os 3 campos extras; `fields:['*cnpj']` marca `input[name=cnpj]` com `required`; cada campo extra envolvido em `<label>` com texto esperado; Assunto/LGPD/honeypot permanecem após o bloco dinâmico.
      Testes: `tests/unit/template.test.js` — casos acima (jsdom).
- [x] T05 — Validação condicional de obrigatoriedade em `validation.js`
      Arquivos: `src/core/validation.js`
      Mudança: Importar `FIELD_DEFINITIONS` de `./fields.js`; estender `validateLeadForm(values, options={})` para ler `options.fields=[]`; após as checagens existentes (honeypot→nome→whatsapp→lgpd→assunto), iterar `options.fields` e, para `required:true` com `values[id]` vazio após `.trim()`, setar `errors[id] = FIELD_DEFINITIONS[id].errorMessage`; `required:false` nunca gera erro.
      Cobre: RF-06, RF-07, RF-09
      Acceptance criteria: `validateLeadForm(values, {fields:[{id:'cnpj',required:true}]})` com `values.cnpj` vazio/espaços resulta em `errors.cnpj` definido e `valid===false`; mesmo caso com `required:false` não gera erro; chamada sem `fields` preserva comportamento atual.
      Testes: `tests/unit/validation.test.js` — casos acima, mais regressão dos testes existentes.
- [x] T06 — Chaves condicionais no payload em `payload.js`
      Arquivos: `src/core/payload.js`
      Mudança: Importar `FIELD_DEFINITIONS` de `./fields.js`; estender `buildLeadPayload(input)` para ler `input.fields=[]`; após montar o payload base, iterar `input.fields` e setar `payload[FIELD_DEFINITIONS[id].payloadKey] = String(input[id]||'').trim()` para cada entrada.
      Cobre: RF-10, RF-11, CT-02
      Acceptance criteria: `buildLeadPayload({...input, fields:[{id:'cnpj'},{id:'email'}], cnpj:'x', email:'y'})` resulta em `payload.cnpj==='x'`, `payload.email==='y'`, `payload.razao_social` ausente; `fields:[]`/omitido não adiciona nenhuma das 3 chaves.
      Testes: `tests/unit/payload.test.js` — casos acima, mais regressão dos testes existentes.

## Phase 3: Orquestração no widget

Antes de implementar, leia:
1. `.spec/features/lead-form-configurable-fields/SPEC.md` — requisitos RIGID que esta fase cobre
2. `.spec/features/lead-form-configurable-fields/PLAN.md` — decomposição completa, dependências e riscos

- [x] T04 — Orquestração em `widget.js` (coleta de valores, validação, payload)
      Arquivos: `src/ui/widget.js`
      Mudança: Importar `resolveFields` de `../core/fields.js`; em `collectValues()`, adicionar `values[id] = this.getField(id)?.value || ''` para cada entrada de `resolveFields(this.config.fields)`; em `submit()`, passar `fields: resolveFields(this.config.fields)` para `validateLeadForm` (junto com `subjects`) e para o objeto passado a `buildLeadPayload`. Nenhuma chamada de rede nova (síncrono).
      Cobre: RF-06, RF-07, RF-09, RF-10, RF-11, RNF-02
      Acceptance criteria: com `config.fields=['*cnpj']` e CNPJ vazio, `submit()` não chama `postLead`/`buildWhatsappUrl` e retorna `{status:'erro_validacao', errors:{cnpj:...}}`; com CNPJ preenchido, payload enviado ao webhook contém `cnpj`.
      Testes: `tests/integration/configurable-fields.spec.js` (T08) — `widget.js` é camada `ui/` orquestradora, sem unit test dedicado (padrão do repo: unit tests mirram `core/`+`integrations/`).

## Phase 4: Verificação end-to-end e documentação

Antes de implementar, leia:
1. `.spec/features/lead-form-configurable-fields/SPEC.md` — requisitos RIGID que esta fase cobre
2. `.spec/features/lead-form-configurable-fields/PLAN.md` — decomposição completa, dependências e riscos

- [ ] T08 — Suíte de integração ponta-a-ponta para `config.fields`
      Arquivos: `tests/integration/configurable-fields.spec.js`
      Mudança: Casos Playwright: default sem `?fields=` só Nome/WhatsApp; `?fields=email,cnpj` ordem Email antes de CNPJ após WhatsApp; `?fields=email,whatsapp,cnpj` WhatsApp fixo na 2ª posição; `?fields=*email` vazio bloqueia submit (sem rede/redirect); `?fields=cnpj` vazio sem `*` permite submit; `?fields=cnpj,email` preenchidos aparecem no payload capturado, `razao_social` ausente; rótulos "CNPJ"/"Razão Social"/"E-mail" visíveis envolvendo os inputs.
      Cobre: RF-01, RF-02, RF-03, RF-04, RF-05, RF-06, RF-07, RF-08, RF-09, RF-10, RF-11, UI-01, UI-02
      Acceptance criteria: todos os 7 casos Playwright acima passam (`npx playwright test tests/integration/configurable-fields.spec.js`).
      Testes: este arquivo é o teste.
- [ ] T09 — Documentação do novo config em `README.md`
      Arquivos: `README.md`
      Mudança: Adicionar entrada em `## Configuracoes` documentando `fields: string[]` — sintaxe, prefixo `"*"`, identificadores disponíveis (`cnpj`, `razaoSocial`, `email`; `name`/`whatsapp` sempre presentes), default `[]`.
      Cobre: CT-01 (documentação)
      Acceptance criteria: `README.md` contém uma entrada `fields` na seção `## Configuracoes` citando os 3 novos identificadores, o prefixo `"*"` e o default `[]`.
      Testes: nenhum — mudança documental sem comportamento a testar.

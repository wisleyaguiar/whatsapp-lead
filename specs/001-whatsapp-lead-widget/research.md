# Research: Widget de Qualificacao de Leads WhatsApp Tray

## Decision: Runtime em JavaScript modular sem dependencias externas

**Rationale**: O widget precisa ser embutido em temas Tray com baixo risco de conflito.
JavaScript modular com build simples permite separar responsabilidades e publicar um
bundle pequeno.

**Alternatives considered**:

- Framework de UI: rejeitado por aumentar peso e superficie de conflito no tema.
- Script monolitico: rejeitado por dificultar testes e customizacao segura.

## Decision: Configuracao centralizada

**Rationale**: Cores, telefone, webhook, eventos e seletores precisam mudar por loja sem
editar a logica do fluxo. Um arquivo/objeto unico de configuracao atende a constituicao
e reduz duplicacao.

**Alternatives considered**:

- Constantes espalhadas pelos modulos: rejeitado por risco de divergencia.
- Configuracao apenas por edicao manual no bundle final: rejeitado por baixa
  manutenibilidade.

## Decision: Contexto de produto via atributos data-* ou JSON estruturado

**Rationale**: O PRD exige integracao estavel com Tray/Twig. `data-product-name` e
`data-product-id` no snippet sao o contrato minimo; JSON estruturado pode ser aceito
como extensao futura sem depender de scraping visual.

**Alternatives considered**:

- Ler titulo visivel da pagina: rejeitado por fragilidade com temas e traducoes.
- Exigir endpoint adicional da loja: rejeitado por aumentar dependencia de backend.

## Decision: Webhook com timeout e fallback comercial

**Rationale**: O lead deve ser registrado antes do WhatsApp quando possivel, mas a venda
nao pode ser perdida por instabilidade externa. Timeout de 3 segundos e fallback para
WhatsApp equilibram persistencia e conversao.

**Alternatives considered**:

- Bloquear ate resposta do webhook: rejeitado por risco de travar a venda.
- Redirecionar imediatamente sem aguardar registro: rejeitado por maior perda de dados.

## Decision: Mensuracao tolerante a ausencia de dataLayer

**Rationale**: Nem toda pagina pode ter GTM carregado no momento da interacao. O fluxo
de atendimento nao deve quebrar quando a camada de mensuracao nao estiver disponivel.

**Alternatives considered**:

- Exigir GTM sempre presente: rejeitado por fragilidade operacional.
- Ignorar mensuracao: rejeitado por perda de visibilidade do funil.

## Decision: Vitest e Playwright para validacao

**Rationale**: Funcoes puras como mascara, validacao, payload e mensagem final devem ser
testadas rapidamente em unidade. Fluxos de DOM, abertura/fechamento, validacao visual e
fallback de webhook precisam de teste em navegador.

**Alternatives considered**:

- Apenas validacao manual: rejeitado por nao proteger caminhos criticos.
- Apenas testes unitarios: rejeitado por nao cobrir interacao real do widget.

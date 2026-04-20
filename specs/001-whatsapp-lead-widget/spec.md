# Feature Specification: Widget de Qualificacao de Leads WhatsApp Tray

**Feature Branch**: `001-whatsapp-lead-widget`  
**Created**: 2026-04-20  
**Status**: Draft  
**Input**: User description: "Baseado no arquivo PRD.md crie as especificações do produto, plano de implementação e tarefas para o widget de qualificação de leads e automação WhatsApp na Tray"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante inicia atendimento pelo widget global (Priority: P1)

Como visitante em qualquer pagina da loja, quero abrir um widget flutuante,
informar meus dados e escolher o assunto do atendimento para iniciar conversa no
WhatsApp sem procurar manualmente o contato da loja.

**Why this priority**: Este e o fluxo minimo de captura de lead em todas as paginas
da loja e entrega valor mesmo sem contexto de produto.

**Independent Test**: Em uma pagina sem produto, abrir o botao flutuante, preencher
nome, WhatsApp, assunto e aceite LGPD, enviar o formulario e verificar que a conversa
do WhatsApp e iniciada com mensagem preenchida.

**Acceptance Scenarios**:

1. **Given** o visitante esta em uma pagina da loja, **When** ele clica no botao
   circular fixo, **Then** a janela de qualificacao abre e o icone muda para fechar.
2. **Given** o visitante abriu o widget global, **When** ele preenche nome,
   WhatsApp valido, seleciona "Duvida tecnica", "Pedidos" ou "Cadastro", aceita a
   LGPD e envia, **Then** o lead e registrado, o evento de conclusao e contado e o
   WhatsApp abre com a mensagem final contendo nome, assunto e origem.
3. **Given** o visitante tenta enviar sem aceitar a LGPD, **When** ele clica em
   "Enviar e Iniciar Conversa", **Then** o envio e bloqueado e o widget informa que o
   aceite e obrigatorio.

---

### User Story 2 - Visitante inicia atendimento a partir de produto (Priority: P2)

Como visitante em uma pagina de produto, quero iniciar atendimento ja com o produto
atual selecionado para que a loja saiba exatamente sobre qual joia estou perguntando.

**Why this priority**: O contexto de produto aumenta a qualidade do lead e reduz
friccao no atendimento comercial.

**Independent Test**: Em uma pagina de produto com nome e identificador fornecidos
pelo template da loja, clicar no snippet de atendimento, confirmar o produto,
preencher dados e verificar que o payload e a mensagem incluem o produto correto.

**Acceptance Scenarios**:

1. **Given** a pagina contem dados estruturados de produto, **When** o visitante abre
   o atendimento pelo snippet do produto, **Then** o widget pergunta se a duvida e
   sobre aquele produto e deixa o assunto pre-selecionado.
2. **Given** o visitante confirma atendimento sobre o produto, **When** ele envia o
   formulario valido, **Then** o registro do lead contem nome do produto,
   identificador do produto, origem e URL da pagina.
3. **Given** os dados estruturados de produto estao ausentes, **When** o visitante
   abre o snippet, **Then** o widget usa o fluxo global sem tentar inferir produto
   por texto visual da pagina.

---

### User Story 3 - Loja registra e mede leads sem perder atendimento (Priority: P3)

Como responsavel por marketing ou atendimento, quero que cada lead qualificado seja
registrado e medido antes do redirecionamento, mas que o visitante ainda chegue ao
WhatsApp se a automacao externa falhar.

**Why this priority**: A loja precisa conciliar mensuracao, persistencia e conversao,
priorizando a venda quando houver instabilidade externa.

**Independent Test**: Enviar um lead em condicoes de sucesso e outro simulando falha
no registro externo; verificar que o primeiro registra e redireciona, e o segundo
redireciona mesmo com falha tratada.

**Acceptance Scenarios**:

1. **Given** o formulario valido foi enviado, **When** o registro externo responde com
   sucesso, **Then** o lead e persistido, o evento de conclusao e contado e o
   WhatsApp abre.
2. **Given** o registro externo falha ou demora alem do limite definido, **When** o
   formulario ja foi validado, **Then** o WhatsApp ainda abre e o visitante nao fica
   bloqueado.
3. **Given** o campo oculto anti-bot foi preenchido, **When** o formulario e enviado,
   **Then** o registro externo e o redirecionamento sao abortados.

### Edge Cases

- WhatsApp informado com menos digitos que um numero movel brasileiro valido.
- Nome preenchido apenas com espacos ou com uma unica palavra curta.
- Visitante fecha e reabre o widget durante o preenchimento.
- Visitante abre o widget global apos ter aberto um snippet de produto na mesma pagina.
- Origem de trafego nao identificada por parametros ou referencias.
- Mensuracao indisponivel no momento da abertura ou conclusao.
- Registro externo indisponivel, lento ou retornando erro.
- Campo honeypot preenchido por automacao.
- Dados de produto ausentes, vazios ou inconsistentes.
- Uso em telas pequenas em que o widget pode encobrir conteudo importante.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a circular floating button fixed in the lower-right
  area of the storefront.
- **FR-002**: System MUST toggle the floating button icon between WhatsApp and close
  states when the qualification window opens and closes.
- **FR-003**: System MUST provide a product-page entry point that opens the same
  qualification window with the current product context preselected when product data
  is available.
- **FR-004**: System MUST collect full name and WhatsApp number before allowing a
  qualified lead to proceed.
- **FR-005**: System MUST format the WhatsApp number while the visitor types and MUST
  reject incomplete numbers before submission.
- **FR-006**: System MUST require explicit LGPD consent before registering the lead or
  opening WhatsApp.
- **FR-007**: System MUST show a global subject menu with "Duvida tecnica", "Pedidos"
  and "Cadastro" when no product context is available.
- **FR-008**: System MUST ask whether the visitor's question is about the current
  product when product context is available.
- **FR-009**: System MUST register valid leads with nome, whatsapp, produto_interesse
  or assunto, origem_trafego, url_origem and data_hora.
- **FR-010**: System MUST count `wpp_qualificacao_inicio` when the widget opens.
- **FR-011**: System MUST count `wpp_qualificacao_concluida` when the lead reaches
  successful registration or handled fallback before WhatsApp redirection.
- **FR-012**: System MUST generate the WhatsApp message:
  "Ola! Me chamo [Nome] e gostaria de atendimento sobre [Produto/Assunto]. Podem me
  ajudar? Vim pelo site da loja. (Ref: [Origem])."
- **FR-013**: System MUST redirect the visitor to WhatsApp after a valid submission
  when the registration succeeds or fails in a handled way.
- **FR-014**: System MUST abort registration and redirection when the hidden anti-bot
  field is filled.
- **FR-015**: System MUST allow business configuration of WhatsApp number, destination
  for lead registration, main color, event names and public selectors without changing
  the qualification flow.
- **FR-016**: System MUST avoid inferring product context from visible page text when
  structured product data is unavailable.

### Quality Requirements

- **QR-001**: System MUST define which values are configurable without changing core
  logic, including colors, phone number, webhook URL, GTM event names and public
  selectors.
- **QR-002**: System MUST define stable Tray/Twig data contracts for product context and
  MUST NOT require scraping visible theme markup.
- **QR-003**: System MUST specify required validation for phone mask, LGPD consent,
  honeypot behavior, payload shape, dataLayer events and WhatsApp message generation.
- **QR-004**: System MUST specify the webhook failure and timeout behavior that still
  allows WhatsApp redirection.
- **QR-005**: System MUST define measurable UX and performance outcomes for desktop and
  mobile use.

### Key Entities *(include if feature involves data)*

- **Lead Qualificado**: Registro gerado quando um visitante envia o formulario valido;
  contem nome, WhatsApp normalizado, produto ou assunto, origem de trafego, URL de
  origem, data/hora e status de registro.
- **Contexto de Produto**: Dados estruturados da pagina de produto; contem nome do
  produto, identificador do produto e URL de origem.
- **Assunto de Atendimento**: Motivo selecionado no fluxo global ou produto confirmado
  no fluxo de produto.
- **Evento de Mensuracao**: Registro de abertura e conclusao usado para medir inicio e
  conversao do funil.
- **Consentimento LGPD**: Confirmacao obrigatoria do visitante antes de qualquer
  registro ou redirecionamento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% dos visitantes em teste conseguem abrir o widget, preencher dados
  validos e iniciar o WhatsApp em ate 45 segundos.
- **SC-002**: 100% dos envios validos incluem nome, WhatsApp normalizado, assunto ou
  produto, origem, URL e data/hora no registro do lead.
- **SC-003**: 100% dos envios sem aceite LGPD, com telefone incompleto ou com honeypot
  preenchido sao bloqueados antes de registro e redirecionamento.
- **SC-004**: 100% dos envios validos continuam para o WhatsApp mesmo quando o registro
  externo falha ou atinge timeout tratado.
- **SC-005**: 100% das aberturas e conclusoes validas disparam os eventos de mensuracao
  esperados quando a camada de mensuracao esta disponivel.
- **SC-006**: O widget permanece utilizavel em larguras de tela de 360px ou maiores,
  sem impedir leitura dos campos ou acesso ao botao final.
- **SC-007**: A abertura da janela apresenta transicao visual perceptivel em menos de
  500ms para o visitante.

## Assumptions

- A loja fornecera um numero de WhatsApp de destino valido.
- A loja fornecera uma URL de registro de leads configuravel antes da publicacao.
- Quando a origem de trafego nao puder ser detectada, o valor padrao sera "Site da
  loja".
- O produto de interesse sera considerado ausente quando nome ou identificador estiverem
  vazios.
- O publico principal usa dispositivos desktop e mobile modernos com suporte a abertura
  de links do WhatsApp.
- O aceite LGPD cobre o envio dos dados para atendimento e registro comercial do lead.

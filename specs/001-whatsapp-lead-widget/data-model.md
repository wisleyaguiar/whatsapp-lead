# Data Model: Widget de Qualificacao de Leads WhatsApp Tray

## LeadQualificado

Representa um visitante que enviou o formulario valido.

**Fields**:

- `nome`: string obrigatoria, minimo 2 palavras ou nome completo informado.
- `whatsapp`: string obrigatoria em formato normalizado com codigo do pais.
- `produto_interesse`: string opcional quando o fluxo vem de produto.
- `produto_id`: string opcional quando o fluxo vem de produto.
- `assunto`: string obrigatoria quando nao ha produto; valores: `Duvida tecnica`,
  `Pedidos`, `Cadastro`.
- `origem_trafego`: string obrigatoria; usa "Site da loja" quando nao identificada.
- `url_origem`: string obrigatoria com a URL da pagina de envio.
- `data_hora`: string obrigatoria com data/hora local do envio.
- `lgpd_aceito`: boolean obrigatorio e verdadeiro para envio humano valido.
- `registro_status`: `sucesso`, `falha_tratada` ou `abortado_honeypot`.

**Validation Rules**:

- `nome` nao pode ser vazio nem conter apenas espacos.
- `whatsapp` deve conter digitos suficientes para um telefone movel brasileiro com DDI.
- `lgpd_aceito` deve ser verdadeiro antes de registro ou redirecionamento.
- `produto_interesse` ou `assunto` deve estar presente.
- Honeypot preenchido muda o fluxo para `abortado_honeypot`.

## ContextoProduto

Representa os dados estruturados de produto fornecidos pela pagina Tray.

**Fields**:

- `productName`: string obrigatoria para fluxo de produto.
- `productId`: string obrigatoria para fluxo de produto.
- `sourceUrl`: string obrigatoria.

**Validation Rules**:

- Se `productName` ou `productId` estiverem vazios, o fluxo deve cair para assunto
  global.
- Dados visiveis da pagina nao devem ser usados para completar campos ausentes.

## AssuntoAtendimento

Representa o motivo do contato.

**Fields**:

- `type`: `produto` ou `global`.
- `label`: texto exibido e usado na mensagem final.
- `productId`: string presente apenas quando `type` e `produto`.

**Validation Rules**:

- Fluxo global aceita somente os tres assuntos definidos.
- Fluxo de produto usa o nome do produto como `label`.

## EventoMensuracao

Representa eventos do funil de qualificacao.

**Fields**:

- `event`: `wpp_qualificacao_inicio` ou `wpp_qualificacao_concluida`.
- `contexto`: `global` ou `produto`.
- `produto_id`: string opcional.
- `assunto`: string opcional.

**Validation Rules**:

- Evento de inicio ocorre quando a janela abre.
- Evento de conclusao ocorre apos sucesso de registro ou fallback tratado.

## State Transitions

```text
fechado -> aberto -> preenchendo -> validando
validando -> abortado_honeypot
validando -> erro_validacao
validando -> registrando
registrando -> registrado -> redirecionado_whatsapp
registrando -> falha_tratada -> redirecionado_whatsapp
```

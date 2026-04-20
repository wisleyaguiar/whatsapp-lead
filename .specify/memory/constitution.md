<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- PRINCIPLE_1_NAME -> I. Codigo Modular e Configuravel
- PRINCIPLE_2_NAME -> II. Integracao Estavel com Tray e Twig
- PRINCIPLE_3_NAME -> III. Testes nos Caminhos Criticos
- PRINCIPLE_4_NAME -> IV. Experiencia Consistente e Consentimento Claro
- PRINCIPLE_5_NAME -> V. Performance e Resiliencia Comercial
Added sections:
- Padroes de Produto e Integracao
- Fluxo de Qualidade
Removed sections:
- Nenhuma
Templates requiring updates:
- updated: .specify/templates/plan-template.md
- updated: .specify/templates/spec-template.md
- updated: .specify/templates/tasks-template.md
- not applicable: .specify/templates/commands/*.md (directory not present)
- reviewed: .specify/templates/checklist-template.md
- reviewed: .specify/templates/agent-file-template.md
Follow-up TODOs:
- Nenhum
-->
# WhatsApp Tray Constitution

## Core Principles

### I. Codigo Modular e Configuravel
Todo codigo de widget, snippet, estilo e integracao MUST ser modular, sem dependencias
implicitas de DOM fora dos pontos documentados. Configuracoes de cor, telefone, URL de
webhook, nomes de eventos GTM e seletores publicos MUST ficar centralizadas e alteraveis
sem edicao profunda da logica. Funcoes de leitura de contexto, validacao, formatacao,
envio de webhook, dataLayer e redirecionamento MUST permanecer separadas e testaveis.

Rationale: o widget sera inserido em templates Tray e precisa sobreviver a variacoes de
tema, pagina e campanha sem exigir retrabalho ou raspagem fragil de HTML.

### II. Integracao Estavel com Tray e Twig
A captura de produto MUST usar dados estruturados fornecidos pelo template, como
atributos data-* ou JSON injetado, e MUST NOT depender de scraping visual de nome,
preco ou identificadores. O fluxo global e o fluxo de pagina de produto MUST compartilhar
a mesma maquina de estados e diferir apenas pelo contexto inicial. Payloads de webhook
MUST preservar nome, WhatsApp normalizado, produto ou assunto, origem, URL de origem e
data/hora em formato definido.

Rationale: a plataforma Tray pode mudar markup de tema, mas contratos explicitos via
Twig e data attributes mantem a automacao previsivel.

### III. Testes nos Caminhos Criticos
Cada mudanca funcional MUST incluir testes ou validacoes reproduziveis para mascara de
telefone, obrigatoriedade da LGPD, honeypot, selecao de assunto/produto, payload do
webhook, eventos dataLayer e mensagem final do WhatsApp. Fluxos de falha de webhook MUST
ser testados para confirmar que o lead ainda e encaminhado ao WhatsApp. Testes de unidade
MUST cobrir funcoes puras; testes de integracao ou validacao manual documentada MUST
cobrir abertura, fechamento, animacoes essenciais e envio do formulario.

Rationale: o sistema opera no ponto de conversao da loja; regressao silenciosa em
validacao, mensuracao ou redirecionamento causa perda direta de lead.

### IV. Experiencia Consistente e Consentimento Claro
A interface MUST manter comportamento consistente entre widget flutuante e snippet de
produto: abertura previsivel, fechamento claro, estados de validacao visiveis e uma unica
acao final "Enviar e Iniciar Conversa". O aceite LGPD MUST bloquear o envio enquanto nao
marcado. Mensagens de erro MUST orientar a correcao sem impedir a continuidade comercial
quando a falha for externa, como instabilidade do webhook. A identidade visual do
WhatsApp MUST ser reconhecivel, mas controles, contraste e responsividade MUST preservar
legibilidade em desktop e mobile.

Rationale: o usuario deve entender por que informa dados pessoais e deve conseguir
iniciar atendimento com o menor atrito possivel.

### V. Performance e Resiliencia Comercial
O script MUST ser leve, assincrono e nao bloqueante. O carregamento inicial MUST evitar
trabalho desnecessario ate a interacao do usuario, e o envio do webhook MUST usar
async/await com timeout ou fallback controlado. O redirecionamento ao WhatsApp MUST
ocorrer apos sucesso do webhook ou apos falha/timeout tratado, nunca ficando bloqueado
indefinidamente. Eventos GTM MUST ser disparados sem quebrar o fluxo quando dataLayer nao
existir.

Rationale: o widget nao pode degradar a loja nem perder uma oportunidade de venda por
falha de rede, automacao ou mensuracao.

## Padroes de Produto e Integracao

- A solucao MUST funcionar como script JS/CSS/HTML embutivel em Tray, com snippet de
  produto e botao global usando a mesma base de codigo.
- O telefone MUST ser exibido com mascara durante digitacao e enviado normalizado para
  webhook e mensagem de WhatsApp.
- O honeypot MUST abortar webhook e redirecionamento quando preenchido.
- O payload do webhook MUST ser JSON e manter nomes de campos estaveis.
- Os eventos GTM obrigatorios sao `wpp_qualificacao_inicio` e
  `wpp_qualificacao_concluida`.
- Customizacoes de marca MUST ser feitas por variaveis ou constantes declaradas em area
  unica do script.
- Dados pessoais MUST ser coletados apenas quando necessarios para iniciar atendimento e
  com consentimento explicito.

## Fluxo de Qualidade

- Toda especificacao MUST declarar criterios mensuraveis de UX, desempenho, privacidade,
  mensuracao e comportamento de falha.
- Todo plano MUST registrar como cada principio desta constituicao sera atendido antes da
  pesquisa tecnica e revalidado apos o desenho da solucao.
- Toda lista de tarefas MUST incluir verificacoes de lint/formatacao, testes aplicaveis,
  validacao de acessibilidade basica, validacao de payload/eventos e teste do fallback de
  webhook.
- Revisoes MUST bloquear mudancas que introduzam scraping instavel, constantes duplicadas,
  falha sem fallback no webhook, ausencia de consentimento LGPD ou regressao no
  redirecionamento ao WhatsApp.
- Excecoes MUST ser registradas no plano com justificativa, risco e alternativa mais
  simples rejeitada.

## Governance

Esta constituicao prevalece sobre decisoes informais de implementacao. Alteracoes MUST
ser propostas com motivacao, impacto em templates e efeito esperado em qualidade,
experiencia, testes ou desempenho.

Versionamento segue SemVer:
- MAJOR para remocao ou redefinicao incompativel de principios.
- MINOR para novos principios, novas secoes obrigatorias ou expansao material de gates.
- PATCH para clarificacoes sem mudanca de obrigacao.

Toda especificacao, plano e lista de tarefas MUST passar pelo Constitution Check antes de
implementacao. Quando um principio nao puder ser cumprido integralmente, o plano MUST
registrar a violacao em Complexity Tracking e a revisao MUST aceitar explicitamente o
risco.

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20

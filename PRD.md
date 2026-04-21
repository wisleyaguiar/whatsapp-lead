# 📄 PRD: Widget de Qualificação de Leads & Automação

## 1. Visão Geral
Desenvolver um script modular (JS/CSS/HTML) para a plataforma Tray que atue como um filtro de qualificação. O sistema deve capturar dados do visitante, identificar o contexto da navegação (produto atual) via Twig, enviar eventos de conversão para o GTM e persistir os dados em uma planilha externa via Webhook antes de redirecionar o usuário para o WhatsApp.

## 2. Requisitos Funcionais

### A. Widget Flutuante (Global)
- Botão circular fixo (bottom-right).
- Transição de ícone: WhatsApp $\rightarrow$ "X" (fechar) ao abrir a janela.
- Comportamento: Abre a janela de chat de qualificação.

### B. Widget de Página de Produto (Snippet)
- **Implementação:** Bloco HTML inserido no template da Tray.
- **Captura Dinâmica:** Uso de atributos `data-product-name="{{ product.name }}"` e `data-product-id="{{ product.id }}"` para que o script saiba exatamente qual joia o cliente está visualizando.
- **Ação:** Abre a janela de qualificação já com o assunto pré-selecionado para o produto em questão.

### C. Fluxo de Qualificação (Interface de Chat)
1. **Identificação:** Coleta de Nome Completo e WhatsApp (com máscara de telefone).
2. **Contextualização:** 
   - Se na página de produto: Apresenta balão de contexto sobre o produto específico.
   - Se global: Menu suspenso com opções de assunto.
3. **Customização de Assuntos:** Permite definir a lista de opções do seletor de assunto via configuração inicial.
4. **Privacidade:** Checkbox obrigatório de aceite da LGPD.
5. **Finalização:** Botão "Enviar e Iniciar Conversa" (com ícones animados).

## 3. Requisitos Técnicos e Integrações

### A. Infraestrutura e Hospedagem
- **Repositório:** GitHub (`wisleyaguiar/whatsapp-lead`).
- **Deploy:** Cloudflare Pages com integração contínua (CI/CD).
- **CDN:** Distribuição global via borda Cloudflare para latência mínima.

### B. Integração com Twig (Tray)
- O script deve ser capaz de ler objetos JSON injetados no HTML ou atributos `data-` para extrair informações do servidor sem depender de raspagem de dados (scraping) instável.
- **Snippet Recomendado:** Botão com atributos `data-product-name` e `data-product-id`.

### C. Disparo de Webhook (Automação)
- **Momento:** Logo após a validação do formulário e antes do redirecionamento.
- **Método:** Requisição `POST` (JSON) para a URL do Webhook.
- **Payload esperado:**
  ```json
  {
    "nome": "João Silva",
    "whatsapp": "5511999999999",
    "produto_interesse": "Anel de Diamante Vereda",
    "origem_trafego": "Google Ads / Facebook Ads",
    "url_origem": "www.loja.com.br/produto-exemplo",
    "data_hora": "2024-05-20 14:00:00"
  }
  ```

### D. Mensuração via GTM (Google Tag Manager)
- O script deve disparar eventos para o `dataLayer`:
  - `wpp_qualificacao_inicio`: Quando o widget é aberto.
  - `wpp_qualificacao_concluida`: No momento do sucesso do Webhook/Redirecionamento.

### E. Segurança e Anti-Bot
- **Honeypot:** Inclusão de um campo oculto via CSS. Se preenchido (por robôs), o script aborta o envio do Webhook e o redirecionamento.

## 4. UI/UX e Estilo
- **Visual:** Identidade visual baseada no WhatsApp (Verde `#25D366`, fontes sans-serif).
- **Animações:** Efeito de *slide-up* e *fade-in* para a janela de chat.
- **Customização:** Variáveis globais no topo do script para fácil alteração de cores, número de telefone e URL do Webhook.

## 5. Comportamento de Saída (WhatsApp)
A mensagem final gerada deve ser amigável e informativa:
> "Olá! Me chamo **[Nome]** e gostaria de atendimento sobre **[Produto/Assunto]**. Podem me ajudar? Vim pelo site da loja. (Ref: **[Origem]**)".

## 6. Requisitos de Qualidade
- **Async/Await no Webhook:** Garante que o script dispare o Webhook de forma assíncrona para não travar a experiência do usuário, mas tenta garantir que o redirecionamento para o WhatsApp só aconteça após o "OK" do disparo.
- **Tratamento de Erros:** Se o Webhook falhar, programa o script para ainda assim abrir o WhatsApp.
- **Máscara de Telefone:** Incluir uma função simples de Regex para formatar o número enquanto o usuário digita.
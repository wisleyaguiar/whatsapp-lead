# Contexto

Você tem um e-commerce de joias que usa a plataforma da Tray e uma das formas de comprar o produto é pelo whatsapp (link). Ao fazer trafego pago para o seu ecommerce, o visitante que chega pode clica, se assim ele quiser, em um botão de comprar pelo whatsapp dentro de um produto ou ao navegar pelas páginas, ele tem um botão de whatsapp flutuante que é clicado também. Ambos os botões levam a pessoa direto para o número de whatsapp da loja via link, sem passar por nenhum tratamento ou filtro. Ao chegar no whatsapp da loja o cliente inicia uma conversa mas sem nexo com a origem do ecommerce, ou seja, que deseja saber como é o produto ou como adquiri-lo e muitas vezes se confunde achando que era uma outra loja ou um outro produto e isso começou a aparecer depois que começaram as campanhas de trafego pago para a loja.

# Tarefa

Preciso que você crie um PRD.md bem estruturado e preciso para eu criar com a ajuda do Antigravity um script, em javascript + estilos css e html, que gere 2 widgets para serem inseridos no site no lugar do botão do whatsapp na página do produto e o botão flutuante que fica fixo em todas as páginas. Esses 2 widgets terão a finalidade de qualificação do contato antes de este ser redirecionado para o link do whatsapp. A plataforma da Tray na parte de templates só aceita scripts em javascript, html e css.

# Como deve funcionar esse script

Deve ser um script que possa ser inserido na página, no rodapé do site, para ser carregado em todas as páginas. Uma das tarefas dele será mostrar o botão flutuante do whatsapp fixo no canto inferiro direito. Ao clicar nesse botão, irá abrir uma janela proxima ao botão como se fosse uma janela de conversa de um chat normal. Nessa janela, o cliente deve responder algumas perguntas antes de ir para o whatsapp propriamente da loja. Ele deve informar o nome completo, o número do celular/whatsapp dele e se ele quer atendimento para o produto que ele está visitando no momento ou dúvidas relativas a loja, a pedidos ou dificuldade de cadastro e compra. O segundo widget que seria o botão que ficará na página do produto, abaixo do botão comprar, pode ser um snippet html que possa ser inserido em qualquer lugar do html da página, que ao ser clicado irá abrir a mesma janela de conversa do formulário na posição que abre a do botão flutuante do whatsapp e mostrar o mesmo formulário, só que dessa fez, na última interação ele irá perguntar se o atendimento é para o produto que ele está visitando e mostrar o nome do produto o outro assunto que ele queira digitar (informar).

# Comportamento esperado da janela

Ao responder as perguntas de qualificação, será mostrado um botão para ele ir de fato para o Whatsapp e junto ao redirecionamento ir um texto prévio formatado com as respostas que ele deu no formulário da janela. Por exempo: "Olá, eu me chamo [nome] e gostaria de atendimento sobre [produto, duvida, etc]. Podem me ajudar? Vim pelo site do e-commerce".

# O QUE É IMPORTANTE ESSE SCRIPT FAZER
- Qualificar se a origem da conversa é de fato uma pessoa humana interessada em falar com a loja.
- Realizar o traqueamento das ações para serem mensuradas como conversão nas campanhas. Disparar um evento tanto no clique dos botões como no botão de envio que irá de fato ao whatsapp da loja.
- Oferecer transparencia sobre proteção de dados e LGPD.
- Implementar uma maneira de excluir bots e não humanos do processo de envio.
- Conseguir mensurar se o clique veio de campanhas páginas, organico search ou tráfego direto.
- Ter um estilo minimalista e alinhado a familiaridade visual do whatsapp para que visivelmente as pessoas entendam que estarão entrando em contato pelo whatsapp.
- Ter um processo de customização dos widgets no sentido de poder trocar cores de background, cores de fonte, inserir o número do whatsapp.
- Ter animações sutis como no botão flutuante ser redondo e o ícone do whatsapp no meio. A janela de conversa abrir deslizando de baixo para cima com efeito fade-in e nisso o icone do whatsapp no centro do botão se transforma em um icone de X sinalizando que ele pode fechar se quiser a janela.
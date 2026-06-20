export interface FeedbackItem {
  description: string;
  solution: string;
  isStrength: boolean;
}

export function getFeedbackForQuestion(qId: string, points: number): FeedbackItem {
  const isStrength = points === 100;
  
  switch (qId) {
    case 'q1': // Google Maps / Busca local
      if (points === 0) {
        return {
          description: "Você relatou que atualmente não possui visibilidade no Google e não tem um perfil profissional configurado, o que faz com que novos pacientes na sua região sequer saibam que você existe quando buscam por socorro ou terapia imediata.",
          solution: "Na Webconverte, nós criamos o seu perfil do Google Meu Negócio do absoluto zero, otimizando postagens, palavras-chave regionais de alta intenção e estruturando um processo ético de captação de avaliações de pacientes para te posicionar organicamente no topo das buscas da sua cidade.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Seu consultório depende hoje de listagens frias em catálogos de convênios médicos ou de um perfil estático no Google sem avaliações recentes, gerando pouca diferenciação e pouca confiança para quem pesquisa pelo seu nome ou especialidade.",
          solution: "Nós otimizamos a sua presença em Posicionamento de Busca Local (Local SEO). Cadastramos e blindamos sua ficha profissional regionalizada com fotos estratégicas para que você pare de depender unicamente da concorrência interna de convênios.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Embora seu perfil no Google esteja atualizado, você mencionou que depende puramente de sorte algorítmica para se destacar e ainda carece de uma página profissional própria focada em converter visitantes em agendamentos particulares.",
          solution: "Nós desenvolvemos uma Página Profissional de Altíssima Conversão integrada a campanhas inteligentes de Google Ads Regionais, tirando sua atração de pacientes do fator acaso e garantindo contatos diários qualificados no WhatsApp.",
          isStrength
        };
      } else {
        return {
          description: "Excelente! Você possui uma forte blindagem digital regional, aparecendo no topo das buscas do Google Maps com avaliações excelentes e uma página de alta conversão ativa.",
          solution: "Como assessoria, analisamos os concorrentes locais adjacentes, expandimos sua captação para outras cidades e fazemos testes de copywriting avançados da sua página para maximizar os lucros sob investimento.",
          isStrength
        };
      }

    case 'q2': // Centralização de info / Site
      if (points === 0) {
        return {
          description: "Você despende esforço contínuo explicando informações burocráticas (CRP, abordagem, dinâmicas de remarcação e valores) manualmente no WhatsApp para cada pessoa que entra em contato.",
          solution: "Desenvolvemos a sua Landing Page premium, onde todas as dúvidas éticas e metodológicas do seu consultório são sanadas de imediato, poupando suas horas de digitação e filtrando curiosos de forma invisível.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Seu único canal de apresentação digital é um link direto na bio do Instagram para o WhatsApp, fazendo com que o interessado salte a etapa de convencimento, gerando contatos frios que apenas perguntam valor e somem.",
          solution: "Substituímos o link cru por um site institucional ou página profissional que aquece o lead, demonstra sua competência e gera profunda autoridade médica/clínica antes mesmo de iniciarem a conversa.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Você possui um site básico profissional, mas sente que os potenciais novos pacientes ainda chegam muito frios, carentes de convencimento e repletos de dúvidas básicas sobre o seu atendimento.",
          solution: "Nossos especialistas reescrevem sua página aplicando Copywriting Neurolinguístico focado no sofrimento e comportamento do paciente ideal, transformando um site básico em uma verdadeira máquina de quebrar objeções na leitura.",
          isStrength
        };
      } else {
        return {
          description: "Ótimo! Sua estrutura de recepção digital aquece os pacientes e resolve as principais burocracias de forma automática antes do primeiro contato humano.",
          solution: "Garantimos a manutenção constante, otimização de velocidade de carregamento (crucial para otimizar custos com anúncios) e inclusão periódica de novas seções de autoridade técnica.",
          isStrength
        };
      }

    case 'q3': // Vitrine do Instagram
      if (points === 0) {
        return {
          description: "Seu perfil no Instagram está com a comunicação mista entre conquistas pessoais e profissionais, o que reduz drasticamente a clareza sobre como você pode resolver a dor específica da sua audiência.",
          solution: "Nossa equipe realiza o redesenho gráfico e conceitual do seu Instagram. Definimos bio estratégica, foto de perfil profissional que transmite acolhimento e organizamos os destaques vitais obrigatórios para receber pacientes comerciais.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Seu perfil é profissional, mas sua bio exibe apenas uma frase poética de efeito e os destaques do seu perfil não estão organizados para conduzir as pessoas passo a passo até a conversão por WhatsApp.",
          solution: "Nós estruturamos seu perfil no modelo de 'Bio-Funil'. Geramos títulos claros de autoridade, configuramos posts fixados com roteiros de apresentação e destaques estruturados de triagem.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Seu Instagram está esteticamente organizado, mas você notou que o conteúdo acaba atraindo majoritariamente outros estudantes de psicologia e colegas do CRP, em vez de captar pacientes reais na sua área de atenção.",
          solution: "Pivotamos sua comunicação clínica através da nossa metodologia de 'Linha Editorial Paciente'. Eliminamos a linguagem excessivamente acadêmica e a substituímos por narrativas que engajam quem realmente está passando pela dor.",
          isStrength
        };
      } else {
        return {
          description: "Incrível! Seu perfil funciona de fato como um funil estruturado ligando bio, destaques e encaminhamento de agendamento clínico.",
          solution: "Auxiliamos na escala de novos formatos (como collabs, lives direcionadas e anúncios de perfil qualificado) e aprimoramos suas métricas de engajamento diário.",
          isStrength
        };
      }

    case 'q4': // Planejamento de Posts
      if (points === 0) {
        return {
          description: "Suas decisões de postagens são reativas e espontâneas, sem cronograma estruturado, consistência de publicação ou ritmo promocional planejado.",
          solution: "Nós criamos e entregamos um Calendário Editorial sob medida para psicologia. Fornecemos roteiros validados de Reels, ganchos de posts fixados e scripts de Stories prontificados para você apenas gravar ou revisar sem esforço.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Você foca em posts amplamente educativos e genéricos sobre saúde mental, que até ganham algumas curtidas empáticas, mas quase nunca se revertem em solicitações de agendamento no seu consultório.",
          solution: "Implementamos nossa tática de 'Conteúdo de Intenção Especial'. Adicionamos chamadas invisíveis e elegantes de agendamento que ativam a consciência da dor do leitor e o encaminham de forma ética para o agendamento.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Você gasta diversas horas semanais criando posts e roteiros, sentindo-se refém da rotina exaustiva do Instagram sem enxergar o retorno financeiro dessa dedicação.",
          solution: "Criamos a sua rotina de 'Gravação de 1 Hora por Mês'. Nós assumimos todo o trabalho pesado de pesquisa, design de posts, roteirização perfeita e legenda. Você gasta pouquíssimo tempo por semana, dedicando suas horas reais aos seus pacientes.",
          isStrength
        };
      } else {
        return {
          description: "Excepcional! Seus roteiros focam na dor do paciente ideal e criam engajamento genuíno.",
          solution: "Injetamos técnicas avançadas de retenção (como ganchos de 3 segundos, quebra de padrões estéticos e edição dinámica silenciosa) para explodir suas taxas de atração orgânica.",
          isStrength
        };
      }

    case 'q5': // Tráfego Pago Instagram
      if (points === 0) {
        return {
          description: "Seu consultório depende unicamente da entrega do algoritmo orgânico do Instagram, que sabidamente limita o alcance a uma minúscula fração de pessoas na sua cidade ou região.",
          solution: "Ativamos nossa estratégia integrada de campanhas de 'Meta Ads para Captação Regional'. Colocamos seus melhores conteúdos diretamente na tela de quem mora próximo a você e precisa de atendimento agora.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Você impulsiona conteúdos soltos utilizando o botão 'Turbinar' do celular, gerando cliques aleatórios, seguidores fantasmas e sensação de que está jogando dinheiro no lixo.",
          solution: "Migramos suas iniciativas para o Gerenciador de Anúncios avançado do Meta. Segmentamos suas campanhas de forma inteligente (por idade, geolocalização cirúrgica e interesses psicológicos reais) maximizando a eficiência de cada real investido.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Você tenta pilotar o Gerenciador de Anúncios da Meta de forma autônoma, porém se perde nas infinitas opções, públicos complexos e não possui certeza de estar atraindo contatos qualificados.",
          solution: "A Webconverte assume a gestão completa do seu tráfego pago na Meta. Criamos as campanhas, testamos os criativos, monitoramos os dados de cliques diários e otimizamos o seu orçamento para gerar o menor custo por paciente possível.",
          isStrength
        };
      } else {
        return {
          description: "Excelente! Você investe em tráfego segmentado gerando fluxo constante de leads interessados.",
          solution: "Criamos públicos semelhantes (lookalike), estruturamos remarketing ético para quem visitou o site e refinamos seus custos de aquisição (CAC).",
          isStrength
        };
      }

    case 'q6': // WhatsApp / Preço da sessão
      if (points === 0) {
        return {
          description: "No WhatsApp, você responde o valor da consulta diretamente, enviando o preço cru sem agregar nenhum valor ou estabelecer vínculo, fazendo com que a maioria dos interlocutores visualize e desapareça.",
          solution: "Nós implementamos o 'Roteiro de Triagem Ética e Acolhimento'. Estruturamos uma conversa em etapas onde seu assistente ou você compreende a demanda do paciente, gera identificação humana e quebra as principais resistência para agendamento.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Sua resposta ao 'qual o valor' envolve enviar um bloco massivo de texto explicativo sobre as regras do CRP e sua abordagem acadêmica, o que assusta o comprador e encerra o canal de diálogo.",
          solution: "Otimizamos seus scripts de contato transformando blocos de texto cansativos em mensagens dinâmicas, intercaladas com perguntas abertas acolhedoras de triagem recomendadas por especialistas.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Você tenta conduzir um diálogo personalizado e acolhedor, mas essa digitação manual repetitiva consome dezenas de minutos todos os dias entre suas sessões, gerando fadiga operacional.",
          solution: "Configuramos um Funil de Respostas Rápidas personalizadas direto no teclado do seu WhatsApp Business, permitindo que você envie mensagens perfeitamente escritas e acolhedoras em menos de 2 segundos.",
          isStrength
        };
      } else {
        return {
          description: "Excelente! Suas abordagens de fechamento respeitam plenamente o CRP ao mesmo tempo em que guiam o interessado na triagem com eficácia.",
          solution: "Oferecemos assessoria analítica nas suas conversas reais de fechamento, mapeando micro-objeções e refinando as taxas de agendamento final no seu WhatsApp.",
          isStrength
        };
      }

    case 'q7': // Recuperação de contatos (WhatsApp Followup)
      if (points === 0) {
        return {
          description: "Você deixa de realizar o acompanhamento de interessados que pararam de responder, acreditando erroneamente que isso demonstraria desespero clínico ou inconveniência profissional.",
          solution: "Nós implementamos a metodologia de 'Recuperação Silenciosa Humanizada'. Roteiros baseados em autocuidado e lembretes éticos de saúde mental que reatam o contato de forma extremamente sutil e profissional.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Seu acompanhamento consiste em enviar mensagens genéricas do tipo 'Olá, pensou sobre a terapia?', as quais costumam obter apenas silêncio ou vácuos persistentes como resposta.",
          solution: "Criamos gatilhos de follow-up acolhedores com abordagens agregadoras de valor, como: 'Olá Carolina, lembrei de você ao ler este artigo de estratégias contra Burnout... conseguimos conciliar o seu horário?'",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Você faz tentativas de cobrança e reengajamento, mas confia em anotações físicas de papel ou na própria memória, o que acarreta no esquecimento de dezenas de potenciais pacientes no seu funil comercial.",
          solution: "Instalamos e parametrizamos o sistema de CRM Visual via Funil de Etiquetas do WhatsApp Business, garantindo que você organize seus leads por status (ex: aguardando retorno, triagem feita) com total clareza visual.",
          isStrength
        };
      } else {
        return {
          description: "Parabéns! Seus fluxos de etiquetagem e mensagens reativas de reengajamento reouvem excelentes fatias de pacientes frios.",
          solution: "Otimizamos a automação de feedbacks periódicos (como revisões de alta ou de manutenção de quadros crônicos) agregando valor e impulsionando consultas recorrentes.",
          isStrength
        };
      }

    case 'q8': // Rastreamento de Leads
      if (points === 0) {
        return {
          description: "Você não mensura a fonte de origem dos seus pacientes, confiando puramente na memória ou em perguntas esporádicas de anamnese.",
          solution: "Nós instalamos o Pixel Inteligente da Meta e Tags de Conversão do Google Ads no seu site. Toda vez que alguém clica para agendar, nossa inteligência aponta de forma precisa de onde veio aquela receita.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Você monitora as estatísticas superficiais do Instagram (curtidas, comentários) sem possuir a real certeza de quantos cliques nessas mídias de fato se transformam em consultas pagas no consultório.",
          solution: "Estruturamos as Metas de Conversão de WhatsApp no painel de tráfego. Suas campanhas param de focar em curtidas irrelevantes e passam a perseguir estritamente solicitações reais de agendamentos.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Você tenta realizar o preenchimento manual de planilhas de contatos, mas a exaustação da rotina clínica te faz abandonar o preenchimento após poucos dias, gerando um brecha analítica.",
          solution: "Desenvolvemos painéis de consolidação de dados totalmente automáticos. Os dados de cliques, origens e contatos chegam mastigados sob a forma de dashboards visuais sem que você precise digitar um único número.",
          isStrength
        };
      } else {
        return {
          description: "Excelente! Você conhece as ferramentas de rastreio e valida os canais de forma assertiva.",
          solution: "Realizamos refinamentos de tags avançadas para cruzar dados de dias da semana e horários de maior propensão de pacientes, maximizando o ROI.",
          isStrength
        };
      }

    case 'q9': // Predição Financeira / Dashboard
      if (points === 0) {
        return {
          description: "Seu acompanhamento financeiro é estritamente reativo, limitando-se a consultar o saldo bancário ao fim do mês e torcer para que novas adesões cubram suas despesas.",
          solution: "Entregamos a planilha integrada de Finanças e Previsibilidade Webconverte, ensinando você a monitorar seu Custo de Aquisição (CAC) e a calcular sua expectativa de recebimento do mês que vem.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Você realiza o controle de pacientes em agendas analógicas de papel e calcula sua margem de lucros mensal estimada de cabeça, sem segurança contra inadimplências.",
          solution: "Disponibilizamos modelos de controle de contratos terapêuticos digitais que geram projeções automáticas de faturamento, alertando sobre possíveis quebras de caixa sazonais antes de feriados prolongados.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Você possui uma planilha em Excel ou similar, mas ela se tornou excessivamente complicada e lenta, provocando desmotivação e atrasos constantes no registro dos dados financeiros.",
          solution: "Nossa equipe desenvolve um Dashboard Simplificado e Inteligente onde você insere no celular apenas os agendamentos semanais e visualiza gráficos intuitivos da sua receita imediata, faturamento previsto e ticket médio.",
          isStrength
        };
      } else {
        return {
          description: "Fantástico! Você tem visibilidade integral do seu funil e da saúde financeira do seu consultório.",
          solution: "Formatamos relatórios complexos com análise avançada de LTV (Lifetime Value) para viabilizar investimentos maiores e seguros na expansão de novos consultórios físicos ou digitais.",
          isStrength
        };
      }

    case 'q10': // Prevenção de buracos de agenda
      if (points === 0) {
        return {
          description: "Ao notar 'buracos' ou faltas nas semanas seguintes do consultório, você reage sob extrema ansiedade e torce passivamente para que indicações ou acasos milagrosos tragam pacientes particulares.",
          solution: "Nós criamos o seu 'Botão de Captação Acelerada'. Deixamos campanhas de Google Ads preparadas no piloto automático e prontas para receber acionamento de emergência com vergas dinâmicas quando sua taxa de ocupação cair de 85%.",
          isStrength
        };
      } else if (points === 30) {
        return {
          description: "Sua reação preventiva envolve postar no Instagram frases como 'Surgiram novos horários livres nesta semana', que costumam depor contra sua autoridade clínica e raramente trazem agendamentos particulares.",
          solution: "Substituímos campanhas reativas de escassez negativa por anúncios de nicho focados em sintomas específicos (burnout corporativo, pânico, luto) para rechear sua grade de forma elegante e valorosa.",
          isStrength
        };
      } else if (points === 70) {
        return {
          description: "Você tenta contornar a vacância da agenda efetuando alterações amadoras e aleatórias na bio ou mudando radicalmente as mídias sem validação estatística pregressa.",
          solution: "Nossos analistas auxiliam em auditorias periódicas do seu ecossistema. Orientamos de forma estruturada e científica qual ponte do seu funil (se site lento, bio confusa ou script do WhatsApp) causou a flutuação temporária na agenda.",
          isStrength
        };
      } else {
        return {
          description: "Excelente! Você toma decisões inteligentes e preventivas embasadas em métricas consolidadas.",
          solution: "Ajudamos você a automatizar as campanhas ajustando algoritmos inteligentes para aumentar o investimento em momentos sazonais de pico de busca regional.",
          isStrength
        };
      }

    default:
      return {
        description: "Opção respondida.",
        solution: "A Webconverte pode trabalhar com você na otimização dessa área para maximizar seu ROI.",
        isStrength: false
      };
  }
}

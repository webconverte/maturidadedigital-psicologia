import { Question, PersonaDetails } from '../types';

export const QUESTIONS: Question[] = [
  // PILAR 1: Base de Presença e Visibilidade Local
  {
    id: 'q1',
    pillarId: 'presence',
    pillarName: 'Presença & Visibilidade Local',
    text: 'Quando um paciente busca por "psicólogo perto de mim" ou "terapia para ansiedade" no Google, o que ele encontra sobre você?',
    options: [
      { text: 'Nada. Não apareço no Google ou não tenho um perfil profissional configurado.', points: 0 },
      { text: 'Meu perfil em plataformas de convênio/catálogos ou um perfil no Google sem avaliações recentes.', points: 30 },
      { text: 'Meu perfil no Google está atualizado, mas dependo da sorte para aparecer nas primeiras posições e não tenho uma página própria.', points: 70 },
      { text: 'Tenho uma página profissional própria e meu perfil no Google é otimizado, aparecendo no topo das buscas com dezenas de avaliações 5 estrelas.', points: 100 }
    ]
  },
  {
    id: 'q2',
    pillarId: 'presence',
    pillarName: 'Presença & Visibilidade Local',
    text: 'Onde você centraliza suas informações profissionais (CRP, abordagem, valores e políticas de remarcação)?',
    options: [
      { text: 'Explico tudo manualmente no WhatsApp toda vez que alguém pergunta.', points: 0 },
      { text: 'Tenho apenas um link na bio do Instagram que leva direto para o meu WhatsApp.', points: 30 },
      { text: 'Tenho um site básico, mas sinto que os pacientes ainda chegam com muitas dúvidas básicas.', points: 70 },
      { text: 'Tenho uma página profissional completa que quebra objeções, gera autoridade e filtra curiosos antes mesmo de me chamarem no WhatsApp.', points: 100 }
    ]
  },
  // PILAR 2: Atração e Conteúdo (Instagram)
  {
    id: 'q3',
    pillarId: 'instagram',
    pillarName: 'Atração & Conteúdo (Instagram)',
    text: 'Como está organizada a "vitrine" do seu Instagram hoje (Bio, Destaques e Fixados)?',
    options: [
      { text: 'É uma mistura de perfil pessoal com profissional. Não fica claro logo de cara como eu posso ajudar.', points: 0 },
      { text: 'É profissional, mas a bio tem apenas uma frase bonita e não tenho destaques organizados para guiar o paciente.', points: 30 },
      { text: 'É organizado, mas sinto que meu conteúdo atrai mais estudantes de psicologia e colegas do que pacientes reais.', points: 70 },
      { text: 'Meu perfil funciona como um funil: bio estratégica, destaques que tiram dúvidas e posts fixados que conduzem a pessoa para o agendamento.', points: 100 }
    ]
  },
  {
    id: 'q4',
    pillarId: 'instagram',
    pillarName: 'Atração & Conteúdo (Instagram)',
    text: 'Como você decide o que postar e o que falar nos seus vídeos e postagens?',
    options: [
      { text: 'Posto o que vem à cabeça no dia, sem planejamento nenhum.', points: 0 },
      { text: 'Faço posts educativos gerais, recebo curtidas, mas isso quase nunca vira um pedido de agendamento.', points: 30 },
      { text: 'Gasto horas criando conteúdo, sinto que virei refém do Instagram e não vejo o retorno financeiro desse esforço.', points: 70 },
      { text: 'Tenho um planejamento claro. Uso roteiros focados nas dores do meu paciente ideal e sequências de stories que geram desejo pelo meu atendimento.', points: 100 }
    ]
  },
  {
    id: 'q5',
    pillarId: 'instagram',
    pillarName: 'Atração & Conteúdo (Instagram)',
    text: 'Como você faz para que seus melhores conteúdos cheguem a novas pessoas na sua cidade ou região?',
    options: [
      { text: 'Dependo 100% da entrega orgânica do Instagram (que está cada vez menor).', points: 0 },
      { text: 'Às vezes aperto o botão "Turbinar" no aplicativo sem muita estratégia e sinto que rasgo dinheiro.', points: 30 },
      { text: 'Tento fazer anúncios complexos, mas me perco nas configurações e não sei se o público que estou atraindo é qualificado.', points: 70 },
      { text: 'Impulsiono meus melhores conteúdos com uma verba baixa e controlada, focando no público exato que eu quero atender, gerando tráfego qualificado todos os dias.', points: 100 }
    ]
  },
  // PILAR 3: Triagem, Conversão e Recuperação (WhatsApp)
  {
    id: 'q6',
    pillarId: 'whatsapp',
    pillarName: 'Triagem, Conversão & WhatsApp',
    text: 'Como é o seu processo no WhatsApp quando alguém manda a clássica pergunta: "Qual o valor da sessão?"',
    options: [
      { text: 'Respondo o valor direto. A maioria visualiza e some.', points: 0 },
      { text: 'Mando um texto longo explicando minha abordagem e regras, mas a pessoa para de responder.', points: 30 },
      { text: 'Tento conversar e entender o caso, mas perco muito tempo digitando as mesmas coisas entre um atendimento e outro.', points: 70 },
      { text: 'Uso mensagens estratégicas e padronizadas. Qualifico o paciente, entendo a demanda dele e quebro objeções de forma acolhedora, sem parecer que estou "vendendo".', points: 100 }
    ]
  },
  {
    id: 'q7',
    pillarId: 'whatsapp',
    pillarName: 'Triagem, Conversão & WhatsApp',
    text: 'O que você faz quando um interessado visualiza os valores da sessão e para de responder?',
    options: [
      { text: 'Deixo para lá. Tenho receio de mandar mensagem e parecer que estou "desesperado(a)" por pacientes.', points: 0 },
      { text: 'Mando um "E aí, pensou?" alguns dias depois, mas quase nunca respondem.', points: 30 },
      { text: 'Tento fazer um acompanhamento, mas anoto no papel ou confio na memória e acabo esquecendo de quem eu deveria chamar.', points: 70 },
      { text: 'Tenho um processo organizado com etiquetas no WhatsApp e mensagens prontas e éticas que recuperam pacientes que haviam sumido.', points: 100 }
    ]
  },
  // PILAR 4: Dados, Gestão e Estratégia
  {
    id: 'q8',
    pillarId: 'metrics',
    pillarName: 'Dados, Gestão & Estratégia',
    text: 'Como você rastreia de onde estão vindo os seus pacientes?',
    options: [
      { text: 'Não meço nada. Só pergunto "como me achou?" na primeira sessão e confio na memória.', points: 0 },
      { text: 'Olho as curtidas e visitas no perfil do Instagram, mas não sei se esses números se transformam em agendamentos reais.', points: 30 },
      { text: 'Tento preencher planilhas manuais de contatos, mas perco muito tempo e acabo abandonando no meio do mês.', points: 70 },
      { text: 'Tenho ferramentas instaladas que rastreiam tudo automaticamente. Sei exatamente quantos cliques no meu WhatsApp vieram de buscas no Google e quantos vieram do Instagram.', points: 100 }
    ]
  },
  {
    id: 'q9',
    pillarId: 'metrics',
    pillarName: 'Dados, Gestão & Estratégia',
    text: 'Como você visualiza a saúde financeira e o volume de contatos do seu consultório?',
    options: [
      { text: 'Só olho o saldo na conta bancária no fim do mês e torço para a agenda encher.', points: 0 },
      { text: 'Conto os pacientes na agenda de papel e tento calcular minha previsão de ganhos de cabeça.', points: 30 },
      { text: 'Tenho uma planilha confusa no computador que me dá preguiça de atualizar.', points: 70 },
      { text: 'Tenho um painel visual automático. Abro um link e vejo em tempo real quantas visitas, contatos e agendamentos eu tive na semana.', points: 100 }
    ]
  },
  {
    id: 'q10',
    pillarId: 'metrics',
    pillarName: 'Dados, Gestão & Estratégia',
    text: 'O que você faz quando percebe que a agenda da próxima semana está com muitos "buracos"?',
    options: [
      { text: 'Entro em desespero e torço para algum paciente atual me indicar para um amigo ou familiar.', points: 0 },
      { text: 'Faço um post de "horários disponíveis" no Instagram (que geralmente não traz ninguém).', points: 30 },
      { text: 'Tento fazer ações isoladas: mudo a bio, faço um vídeo diferente, mas tudo na base do "achismo".', points: 70 },
      { text: 'Analiso meus números da semana, identifico exatamente onde está o gargalo (se pouca gente me chamou ou se muita gente chamou e não fechou) e executo uma ação clara para corrigir o problema.', points: 100 }
    ]
  }
];

export const PERSONAS: Record<string, PersonaDetails> = {
  survival: {
    level: 'survival',
    minVal: 0,
    maxVal: 30,
    title: 'Nível Sobrevivência',
    label: 'Sobrevivência',
    color: 'text-red-600 border-red-200 bg-red-50',
    badgeColor: 'bg-red-100 text-red-800',
    description: 'Você tem um excelente conhecimento clínico, trabalhou duro para se formar, mas infelizmente continua invisível no mundo digital. O seu consultório depende de fatores externos como indicações esporádicas ou parcerias mal-remuneradas com clínicas de convênio. Há uma enorme vulnerabilidade financeira e incerteza no seu negócio.',
    actionPlan: [
      'Criar e cadastrar sua ficha no Google Meu Negócio gratuitamente hoje para posicionamento de busca regional.',
      'Desenvolver uma landing page (página profissional) focada em conversão para servir como o centro de informações e recepção oficial na internet.',
      'Abolir planilhas confusas e registrar os leads iniciais para entender quem está de fato orçando com você.'
    ]
  },
  stagnation: {
    level: 'stagnation',
    minVal: 31,
    maxVal: 60,
    title: 'Nível Estagnação',
    label: 'Estagnação',
    color: 'text-amber-600 border-amber-200 bg-amber-50',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Você já gasta uma energia substancial produzindo conteúdo educativo, fazendo stories e postando com frequência no Instagram, mas os seus esforços parecem uma máquina de moer tempo sem retorno estratégico. O Instagram atrai mais colegas de profissão do que pacientes qualificados, e o processo de venda no WhatsApp perde dezenas de pacientes no meio do caminho porque as conversas não têm método comercial acolhedor.',
    actionPlan: [
      'Substituir postagens teóricas de psicologia por conteúdos com roteiros focados na dor latente do seu paciente ideal com chamadas de agendamento.',
      'Estruturar um roteiro (script) humanizado e profissional no WhatsApp para responder à pergunta "qual o valor?" sem perder o contato.',
      'Ativar etiquetas e organizar o fluxo do WhatsApp Business para reatar conversações com potenciais clientes que sumiram.'
    ]
  },
  growth: {
    level: 'growth',
    minVal: 61,
    maxVal: 85,
    title: 'Nível Crescimento',
    label: 'Crescimento',
    color: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Parabéns, você já se destaca e consegue manter um fluxo razoável de pacientes! Porém, seu progresso está estagnado em um teto operacional. Falta-lhe processos automáticos de aquisição, monitoramento rigoroso e dados estruturados para prever buracos em sua agenda e escalar com verdadeira previsibilidade comercial. Você sente que o consultório ainda depende do seu "achismo" operacional para decidir o próximo passo.',
    actionPlan: [
      'Estabelecer um dashboard de faturamento, volume de contatos e conversas semanais para identificar de forma preditiva os gargalos comerciais.',
      'Iniciar tráfego pago local profissional (Google Ads e Meta Ads direcionados para sua região) para atrair público estritamente qualificado e disposto a pagar o preço integral.',
      'Desenvolver uma rotina clara de reengajamento estratégico de ex-pacientes de forma acolhedora e ética.'
    ]
  },
  authority: {
    level: 'authority',
    minVal: 86,
    maxVal: 100,
    title: 'Nível Autoridade',
    label: 'Autoridade',
    color: 'text-indigo-600 border-indigo-200 bg-indigo-50',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    description: 'Excelente! Você atingiu o patamar mais alto de profissionalismo no marketing digital para psicologia. Sua estrutura atual atrai pacientes constantes e seu fluxo local está maduro. O seu principal desafio agora é a expansão estratégica, o posicionamento premium de alto valor, a criação de infoprodutos, grupos terapeuticos ou a contratação de terapeutas parceiros sob sua tutela para escalabilidade do consultório.',
    actionPlan: [
      'Consolidar seu posicionamento premium (High-Ticket) para aumentar o valor de sua hora clínica.',
      'Estruturar e lançar infoprodutos, e-books autorais ou grupos estruturados de terapia na modalidade online.',
      'Montar uma clínica digital - escalando e repassando leads excedentes para outros psicólogos sob supervisão, criando um modelo de consultoria híbrida.'
    ]
  }
};

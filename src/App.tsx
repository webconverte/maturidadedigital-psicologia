import React, { useState, useEffect } from 'react';
import { 
  QUESTIONS, 
  PERSONAS 
} from './data/questions';
import { 
  AnswerOption, 
  QuizScores, 
  LeadData, 
  PersonaDetails,
  MaturityLevel
} from './types';
import { RadarChart } from './components/RadarChart';
import { getFeedbackForQuestion } from './data/feedback';
import { 
  ArrowRight, 
  Lock, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  ChevronRight,
  TrendingUp, 
  Instagram, 
  MessageCircle, 
  MapPin, 
  BarChart3, 
  Users, 
  Sparkles,
  Inbox,
  ArrowRightLeft,
  Settings,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  // Screen views: 'intro' | 'quiz' | 'capture' | 'loading' | 'results'
  const [view, setView] = useState<'intro' | 'quiz' | 'capture' | 'loading' | 'results'>('intro');
  
  // Quiz state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // Lead form state
  const [lead, setLead] = useState<LeadData>({ name: '', email: '', whatsapp: '' });
  const [submitting, setSubmitting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; status: string } | null>(null);

  // Auto-format phone input for Brazilian phone pattern
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    
    if (value.length > 11) value = value.slice(0, 11);
    
    // Process formatting (XX) XXXXX-XXXX
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    setLead(prev => ({ ...prev, whatsapp: value }));
  };

  const handleSelectOption = (points: number) => {
    const currentQuestion = QUESTIONS[currentIdx];
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: points }));
    
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setView('capture');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Skip lead gate if testing
  const handleSkipLeadGate = () => {
    setLead({
      name: "Psicólogo de Teste",
      email: "teste@webconverte.com",
      whatsapp: "(11) 99999-9999"
    });
    setView('loading');
  };

  // Submit Lead & trigger Webhook
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name || !lead.email || !lead.whatsapp) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    
    // Check if phone number is valid size
    const rawPhone = lead.whatsapp.replace(/\D/g, '');
    if (rawPhone.length < 10) {
      alert("Por favor, insira um número de WhatsApp válido com o DDD.");
      return;
    }

    setView('loading');
  };

  // Instantly scroll window to top when currentIdx or view changes (perfect for mobile question transitions)
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
    };
    
    // Call immediately
    scrollToTop();
    
    // Also call with a slight delay to ensure DOM has fully painted the new view/question
    const timer = setTimeout(scrollToTop, 60);
    return () => clearTimeout(timer);
  }, [currentIdx, view]);

  // Process loading sequence simulation, then go to results
  useEffect(() => {
    if (view === 'loading') {
      const timer = setTimeout(async () => {
        // Submit details behind the scenes
        await sendLeadToBackend();
        setView('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3500); // 3.5 seconds of simulated parsing steps
      return () => clearTimeout(timer);
    }
  }, [view]);

  // Scores calculations
  const calculateFinalMetrics = () => {
    // Total questions answers sum
    let totalScore = 0;
    QUESTIONS.forEach(q => {
      totalScore += answers[q.id] || 0;
    });
    const avgScore = totalScore / QUESTIONS.length; // 0 to 100

    // Pillar breakdown calculations
    const presenceQs = ['q1', 'q2'];
    const instagramQs = ['q3', 'q4', 'q5'];
    const whatsappQs = ['q6', 'q7'];
    const metricsQs = ['q8', 'q9', 'q10'];

    const getPillarAvg = (qIds: string[]) => {
      const sum = qIds.reduce((acc, id) => acc + (answers[id] || 0), 0);
      return Math.round(sum / qIds.length);
    };

    const pillarScores = {
      presence: getPillarAvg(presenceQs),
      instagram: getPillarAvg(instagramQs),
      whatsapp: getPillarAvg(whatsappQs),
      metrics: getPillarAvg(metricsQs),
    };

    // Determine Persona based on average
    let resolvedPersona: PersonaDetails = PERSONAS.survival;
    if (avgScore <= 30) {
      resolvedPersona = PERSONAS.survival;
    } else if (avgScore <= 60) {
      resolvedPersona = PERSONAS.stagnation;
    } else if (avgScore <= 85) {
      resolvedPersona = PERSONAS.growth;
    } else {
      resolvedPersona = PERSONAS.authority;
    }

    // Determine greatest bottleneck (Pillar with lowest score)
    const pilarList = [
      { id: 'presence', name: 'Presença & Visibilidade Local (Google & Site)', score: pillarScores.presence },
      { id: 'instagram', name: 'Atração & Conteúdo (Instagram)', score: pillarScores.instagram },
      { id: 'whatsapp', name: 'Triagem, Conversão & WhatsApp', score: pillarScores.whatsapp },
      { id: 'metrics', name: 'Dados, Gestão & Estratégia', score: pillarScores.metrics }
    ];

    const gargalo = pilarList.reduce((min, p) => p.score < min.score ? p : min, pilarList[0]);

    return {
      average: avgScore,
      pillarScores,
      persona: resolvedPersona,
      gargalo: gargalo
    };
  };

  const getGargaloSalesCopy = (gargaloName: string) => {
    if (gargaloName.includes("PRESENÇA")) {
      return "Seu consultório está invisível no momento em que os pacientes mais precisam de você. Identificamos que você precisa posicionar seu site e Google Meu Negócio estrategicamente no topo das buscas.";
    } else if (gargaloName.includes("INSTAGRAM")) {
      return "Você perde engajamento e conexão ética com seu público. Nossa equipe identificou a urgência de estruturar sua vitrine do Instagram com conteúdos de autoridade validados e tráfego direcionado.";
    } else if (gargaloName.includes("WHATSAPP")) {
      return "Seus contatos se perdem no WhatsApp sem gerar agendamentos. A Webconverte estruturará seus fluxos e aplicará scripts éticos de triagem para dobrar efetivamente a conversão de seus atendimentos.";
    } else if (gargaloName.includes("DADOS")) {
      return "Sua gestão está sendo feita de forma intuitiva, sem base sólida. Vamos implementar um dashboard preciso para termos clareza exata de dados e de faturamento, embasando nossa mentoria de crescimento.";
    }
    return "Nossa equipe de especialistas de negócios irá reestruturar todo o seu fluxo.";
  };

  const results = calculateFinalMetrics();
  const salesCopy = getGargaloSalesCopy(results.gargalo.name);

  const sendLeadToBackend = async () => {
    try {
      setSubmitting(true);
      
      // Get customized localstorage webhook URL if saved
      const customWebhookUrl = localStorage.getItem('webconverte_webhook_url') || '';

      const payload = {
        name: lead.name,
        email: lead.email,
        whatsapp: lead.whatsapp,
        score: results.average / 100,
        levelName: results.persona.title,
        scores: results.pillarScores,
        gargalo: results.gargalo.name,
        gargaloSalesCopy: salesCopy,
        customWebhookUrl
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      // Log response locally in state and localStorage
      const success = res.ok && data.webhookSent;
      const statusText = data.webhookStatus || "Ok";
      
      setWebhookResult({
        success,
        status: statusText
      });

      // Append to local audit logs inside localStorage
      const currentLogs = JSON.parse(localStorage.getItem('webconverte_webhook_logs') || '[]');
      const newLog = {
        timestamp: new Date().toISOString(),
        name: lead.name,
        scoreFinal: `${Math.round(results.average)}%`,
        success: res.ok,
        webhookStatus: statusText
      };
      localStorage.setItem('webconverte_webhook_logs', JSON.stringify([...currentLogs, newLog]));

    } catch (err) {
      console.error("Failed to send webhook to server:", err);
      setWebhookResult({
        success: false,
        status: "Erro de conexão com o servidor local"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Quick helper to determine progress percentage
  const progressPercent = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);

  // Active question details
  const question = QUESTIONS[currentIdx];

  // Dynamically configure CTA WhatsApp link
  // Message: "Olá! Finalizei o Quiz de Maturidade Digital da Webconverte. Fui classificado como [Nivel] (Nota: [X]%). Meu principal gargalo é [Gargalo]. Gostaria de obter sugestões!"
  const handleCTAWhatsApp = () => {
    const isPerfect = results.average >= 100;
    
    let diagnosis = `- *Nome:* ${lead.name}\n- *Nota Geral:* ${Math.round(results.average)}%\n- *Classificação:* ${results.persona.title}\n`;
    if (!isPerfect) {
      diagnosis += `- *Maior Gargalo:* ${results.gargalo.name}\n\n`;
    } else {
      diagnosis += `\n`;
    }

    const encodedText = encodeURIComponent(
      `Olá! Estive analisando meu consultório no Quiz de Maturidade Digital e gostaria de conversar sobre minha maturidade digital.\n\n` +
      `📊 *Meu Diagnóstico:* \n` +
      diagnosis +
      (!isPerfect ? `📝 *Observação sobre meu Gargalo:* ${salesCopy}\n\n` : '') +
      `Gostaria de agendar a minha consultoria personalizada para traçarmos o plano rumo à previsibilidade de pacientes!`
    );
    window.open(`https://wa.me/5548991444144?text=${encodedText}`, '_blank');
  };

  // Helper to map light-themed checklist colors to gorgeous badge styles
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'survival':
        return 'bg-red-50 border border-red-200 text-red-700 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
      case 'stagnation':
        return 'bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
      case 'growth':
        return 'bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
      case 'authority':
        return 'bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
      default:
        return 'bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-700 selection:bg-web-lime selection:text-web-dark flex flex-col justify-between relative overflow-clip">
      {/* BACKGROUND GLOW BLOBS */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-web-lime/5 blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] right-[-15%] w-[500px] h-[500px] rounded-full bg-web-green/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-web-lime/5 blur-[130px] pointer-events-none z-0"></div>

      {/* HEADER REMOVED PER USER REQUEST */}

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 py-8 px-4 max-w-4xl w-full mx-auto z-10 relative">
        
        {/* VIEW 1: INTRO */ }
        {view === 'intro' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-10 animate-fade-in" id="intro-screen">
            <div className="inline-flex items-center space-x-2 bg-slate-50/60 border border-web-green/30 rounded-full px-4 py-1.5 text-xs text-web-green font-bold shadow-md shadow-web-dark/20">
              <Sparkles className="w-3.5 h-3.5 text-web-green" />
              <span>Diagnóstico Gratuito • CRP Ético</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-web-dark tracking-tight leading-tight">
                Seu consultório está pronto para <span className="bg-gradient-to-r from-web-lime to-web-green bg-clip-text text-transparent">atrair pacientes</span> qualificados?
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
                Descubra em menos de 3 minutos se o seu ecossistema de marketing digital está maduro ou se você está deixando dinheiro na mesa e perdendo pacientes todos os dias.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 pt-2">
              <button
                id="btn-start-quiz"
                onClick={() => setView('quiz')}
                className="w-full sm:w-auto bg-web-lime hover:bg-web-lime/90 active:bg-web-lime/85 text-web-dark font-display font-extrabold text-base px-8 py-4 rounded-xl shadow-lg shadow-web-lime/10 transition-all duration-350 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                <span>Descobrir Minha Maturidade</span>
                <ArrowRight className="w-5 h-5 text-web-dark" />
              </button>
              <div className="flex items-center space-x-1.5 text-xs sm:text-sm text-slate-700 font-bold pt-1">
                <Clock className="w-4 h-4 text-web-green" />
                <span>Leva apenas 3 minutos com 10 perguntas estratégicas</span>
              </div>
            </div>

            {/* Visual Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left py-6">
              <div className="bg-slate-50/40 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 flex items-start space-x-3.5 shadow-lg hover:border-web-green/35 transition-colors duration-300">
                <div className="h-8 w-8 rounded-lg bg-slate-50/80 border border-web-green/30 flex items-center justify-center text-web-green shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-web-dark text-sm sm:text-base">4 Pilares de Maturidade</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">Presença, Atração, Conversão e Gestão Estratégica.</p>
                </div>
              </div>
              <div className="bg-slate-50/40 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 flex items-start space-x-3.5 shadow-lg hover:border-web-green/35 transition-colors duration-300">
                <div className="h-8 w-8 rounded-lg bg-slate-50/80 border border-web-green/30 flex items-center justify-center text-web-green shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-web-dark text-sm sm:text-base">Plano de Ação Ético</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">Recomendações técnicas estruturadas sem infringir as diretrizes do CRP.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: QUIZ SCREEN */}
        {view === 'quiz' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in" id="quiz-screen">
            {/* Quiz Progress Header */}
            <div className="bg-slate-50/90 p-5 rounded-2xl border border-web-green/20 shadow-md space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold tracking-wider uppercase">
                <span className="text-web-green font-extrabold">{QUESTIONS[currentIdx].pillarName}</span>
                <span>Pergunta {currentIdx + 1} de {QUESTIONS.length}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-web-green/10">
                <div 
                  className="h-full bg-gradient-to-r from-web-green to-web-lime rounded-full transition-all duration-500 ease-out shadow-sm shadow-web-lime/20"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Active Question Box */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-web-green/20 shadow-xl space-y-6">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-web-dark leading-snug">
                {question.text}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, oIdx) => (
                  <button
                    key={`${question.id}-opt-${oIdx}`}
                    id={`opt-${question.id}-${oIdx}`}
                    onClick={() => handleSelectOption(option.points)}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-web-green/40 bg-white hover:bg-slate-50 text-slate-600 hover:text-web-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-web-green flex items-start space-x-3.5 group cursor-pointer"
                  >
                    <span className="w-6.5 h-6.5 rounded-full border border-slate-200 text-slate-500 group-hover:border-web-lime group-hover:text-web-green font-mono text-xs font-bold flex items-center justify-center shrink-0 transition bg-white group-hover:bg-slate-50 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="text-sm font-medium leading-[22px] mt-0.5">{option.text}</span>
                  </button>
                ))}
              </div>

              {/* Navigation Back */}
              <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-2">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentIdx === 0}
                  className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                    currentIdx === 0 
                      ? 'text-slate-600 cursor-not-allowed' 
                      : 'text-slate-700 hover:text-web-dark hover:bg-white'
                  }`}
                >
                  <span>← Voltar</span>
                </button>
                <div className="text-xs sm:text-sm text-slate-350 font-semibold tracking-wide">
                  Respostas salvas automaticamente
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: LEAD CAPTURE (LEAD GATE) */}
        {view === 'capture' && (
          <div className="max-w-lg mx-auto space-y-6 animate-fade-in" id="lead-gate-screen">
            <div className="text-center space-y-2 mb-2">
              <span className="text-3xl inline-block animate-bounce mb-1">📊</span>
              <h2 className="font-display font-extrabold text-2xl text-web-dark tracking-tight">
                Seu Diagnóstico está quase pronto...
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Analisamos suas respostas. Cadastre-se abaixo para liberar o relatório de maturidade estruturado.
              </p>
            </div>

            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-web-green/20 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-web-green via-web-lime to-web-green"></div>

              <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4.5 flex items-start space-x-3.5 text-amber-100 leading-relaxed">
                <ShieldAlert className="w-5 h-5 text-amber-505 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1.5">
                  <h4 className="font-extrabold text-amber-600 uppercase tracking-wider text-xs">Aviso Ético (Código de Ética do CRP)</h4>
                  <p className="opacity-95 leading-relaxed text-xs text-slate-600">
                    Nossas recomendações seguem as limitações de publicidade ética clínica estabelecidas pelo Conselho Federal de Psicologia. Não incentivamos autopromoção fútil, promessas infundadas ou captação de má-fé.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-web-green uppercase tracking-wider block">Área de Identificação</span>
                <p className="font-display font-extrabold text-base sm:text-lg text-web-dark">
                  Preencha para liberar o seu relatório de maturidade e as sugestões de boas práticas da Webconverte:
                </p>
              </div>

              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={lead.name}
                    onChange={(e) => setLead(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Dra. Carolina Albuquerque"
                    className="w-full px-3.5 py-3 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-web-lime bg-white text-web-dark placeholder-slate-600 focus:border-web-lime/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    E-mail Profissional
                  </label>
                  <input
                    type="email"
                    required
                    value={lead.email}
                    onChange={(e) => setLead(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Ex: carolina@albuquerquepsicologia.com.br"
                    className="w-full px-3.5 py-3 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-web-lime bg-white text-web-dark placeholder-slate-600 focus:border-web-lime/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    WhatsApp (com DDD)
                  </label>
                  <input
                    type="tel"
                    required
                    value={lead.whatsapp}
                    onChange={handlePhoneChange}
                    placeholder="Ex: (48) 99144-4144"
                    className="w-full px-3.5 py-3 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-web-lime bg-white text-web-dark placeholder-slate-600 focus:border-web-lime/60 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-see-diagnosis"
                  className="w-full bg-web-lime hover:bg-web-lime/90 active:bg-web-lime/85 text-web-dark font-display font-extrabold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-web-lime/20 flex items-center justify-center space-x-2 mt-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Lock className="w-4 h-4 text-web-dark shrink-0" />
                  <span>Liberar Meu Diagnóstico Agora</span>
                  <ChevronRight className="w-4 h-4 text-web-dark" />
                </button>
              </form>

              {/* Developer Bypass indicator */}
              <div className="flex justify-between items-center text-[10px] text-slate-450 pt-3 border-t border-slate-200">
                <span>🔒 Seus dados estão 100% seguros</span>
                <button
                  onClick={handleSkipLeadGate}
                  className="font-mono text-web-green hover:underline cursor-pointer"
                >
                  Ignorar captura (Teste Dev)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: SIMULATED LOADING SCREEN */}
        {view === 'loading' && (
          <div className="max-w-md mx-auto text-center space-y-8 py-14 animate-fade-in" id="loading-screen">
            <div className="relative inline-flex">
              {/* Spinner animation */}
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-web-lime animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-lg">💡</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-extrabold text-xl text-web-dark">
                Gerando Seu Diagnóstico de Maturidade...
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Estamos processando suas 10 respostas baseadas nos algoritmos de conversão comercial da Webconverte.
              </p>
            </div>

            {/* checklist of processed items */}
            <div className="max-w-xs mx-auto text-left bg-slate-50 p-5 rounded-2xl border border-web-green/20 shadow-xl space-y-3 text-xs text-slate-600">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-web-green animate-pulse shrink-0" />
                <span className="font-semibold text-web-dark">Compilando respostas dos 4 pilares...</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-web-green animate-pulse shrink-0" />
                <span className="font-semibold text-web-dark">Verificando conformidade ética do CRP...</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-web-green/30 border-t-web-lime animate-spin shrink-0"></div>
                <span className="text-web-green font-semibold animate-pulse">Isolando gargalo de conversão...</span>
              </div>
              <div className="flex items-center space-x-2.5 opacity-30">
                <div className="w-3.5 h-3.5 rounded-full bg-white shrink-0"></div>
                <span>Estruturando sugestões de boas práticas...</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: RESULTS SCREEN WITH CHART AND SALES COPY */}
        {view === 'results' && (
          <div className="space-y-10 animate-fade-in" id="results-screen">
            
            {/* Top Score Summary Banner */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-web-green/20 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-web-lime/5 rounded-full blur-2xl pointer-events-none -z-10"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3.5 text-left flex-1">
                  <div className="flex items-center space-x-3.5">
                    <span className={getBadgeStyle(results.persona.level)}>
                      {results.persona.title}
                    </span>
                  </div>
                  
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-web-dark tracking-tight leading-none">
                    Sua Maturidade Digital é de <span className="text-web-green text-3xl sm:text-4xl font-extrabold">{Math.round(results.average)}%</span>
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                    {results.persona.description}
                  </p>
                </div>

                {results.gargalo.score < 100 && (
                  <div className="shrink-0 bg-white border border-web-green/20 p-5 rounded-xl text-center md:min-w-[170px] shadow-inner">
                    <span className="text-xs text-slate-600 font-extrabold uppercase tracking-widest block">Maior Gargalo</span>
                    <div className="font-display font-extrabold text-web-green text-lg mt-2.5 mb-2.5 max-w-[160px] mx-auto leading-tight">
                      {results.gargalo.name.split(" (")[0]}
                    </div>
                    <span className="text-xs font-mono font-bold bg-amber-100 border border-amber-900/45 text-amber-700 px-3 py-1 rounded-full inline-block">
                      {results.gargalo.score}% de maturidade
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Radar Web Diagram & Gargalo breakdown */}
            <div className="flex flex-col gap-8 items-stretch">
              
              <div className="space-y-4 w-full">
                <div className="bg-slate-50 p-3 sm:p-6 rounded-2xl border border-web-green/20 shadow-xl">
                  <h3 className="font-display font-extrabold text-web-dark mb-1 text-base">Visualização dos Seus Pilares</h3>
                  <p className="text-xs text-slate-450 text-slate-500 mb-4">Veja onde sua estrutura está forte e onde ela está com buracos operacionais.</p>
                  
                  <RadarChart scores={results.pillarScores} />
                </div>
              </div>

              {/* Sugestões de Boas Práticas */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-web-green/20 shadow-xl space-y-4 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-web-green mb-3">
                    <span className="p-1.5 bg-white border border-slate-200/40 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-web-green" />
                    </span>
                    <h3 className="font-display font-extrabold text-web-dark text-base">Seu Relatório de Oportunidades</h3>
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Com base nas suas respostas, identificamos as seguintes fragilidades no seu posicionamento e sugerimos ações práticas executadas pela agência Webconverte para corrigi-las:
                  </p>

                  <div className="space-y-4">
                    {QUESTIONS.map((q) => {
                      const score = answers[q.id] || 0;
                      if (score === 100) return null; // focado nos pontos fracos
                      const feedback = getFeedbackForQuestion(q.id, score);
                      return (
                        <div key={`weak-${q.id}`} className="bg-white/40 p-5 rounded-xl border border-web-green/10 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                            <span className="text-xs font-extrabold text-web-green uppercase tracking-widest bg-slate-50 px-3 py-1 rounded border border-web-green/15">
                              {q.pillarName}
                            </span>
                            <span className="text-xs font-mono text-slate-600 font-bold">
                              Pontuação: {score}%
                            </span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest block">O que você relatou:</span>
                            <p className="text-sm text-web-navy leading-relaxed italic pr-1">
                              &ldquo;{feedback.description}&rdquo;
                            </p>
                          </div>
                          
                          <div className="bg-web-lime/5 p-4 rounded-lg border border-web-lime/15 space-y-1.5">
                            <span className="text-xs font-black text-web-green uppercase tracking-widest block">💡 Como a Webconverte Soluciona:</span>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                              {feedback.solution}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    
                    {QUESTIONS.every(q => (answers[q.id] || 0) === 100) && (
                      <div className="bg-web-lime/5 p-6 text-center rounded-xl border border-web-lime/20 space-y-3">
                        <Sparkles className="w-8 h-8 text-web-green mx-auto animate-pulse" />
                        <h4 className="font-display font-extrabold text-web-dark text-sm uppercase tracking-wide">Maturidade Excepcional!</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Você atingiu nota máxima em todos os 10 pilares da nossa avaliação. Não identificamos pontos fracos imediatos de captação!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!QUESTIONS.every(q => (answers[q.id] || 0) === 100) && (
                  <div className="bg-amber-50 border border-amber-200 text-slate-700 rounded-xl p-4 text-center text-sm leading-relaxed mt-4 shadow-sm">
                    ⚠️ <span className="font-bold text-amber-600">Atenção Especial:</span> Seu pilar de maior sensibilidade é <strong className="text-web-dark font-extrabold">{results.gargalo.name.split(" (")[0]}</strong> (com {results.gargalo.score}%). Recomendamos priorizar a correção desse pilar imediatamente.
                  </div>
                )}
              </div>

            </div>

            {/* Sales Copy: A Ponte para a Webconverte */}
            <div className="bg-slate-50 text-web-dark p-6 sm:p-10 rounded-2xl border border-web-green/30 shadow-2xl space-y-10 text-left relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-80 h-80 bg-web-lime/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-web-green/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
              
              <div className="space-y-4">
                <div className="inline-flex items-center bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Diagnóstico Estratégico</span>
                </div>
                
                <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-web-dark tracking-tight leading-tight">
                  Se a sua teia de maturidade tem lacunas, seu consultório está <span className="text-red-600">perdendo pacientes particulares</span> todos os dias.
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
                  {results.average < 100 ? (
                    <>Seu diagnóstico identificou que o seu maior gargalo atual é o pilar de <strong className="text-web-green font-bold">{results.gargalo.name.split(" (")[0]}</strong>. {salesCopy} Enquanto essa brecha não for blindada profissionalmente, cada interacão ou cada real investido de forma intuitiva acaba sendo desperdiçado, beneficiando concorrentes regionais com menor capacidade clínica, mas maior presença digital.</>
                  ) : (
                    <>Você atingiu a maturidade máxima! No entanto, manter essa estrutura de excelência requer constância e inteligência de mercado contínua para evitar que concorrentes tomem seu espaço.</>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-web-green uppercase tracking-widest">
                    A REALIDADE DO MERCADO:
                  </p>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-web-dark leading-snug">
                    Você se especializou para cuidar de vidas, não para criar sites ou dominar a tecnologia de marketing.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Você precisa aprender como fazer da forma correta e ter uma estrutura completa de canais, que entregamos em nossa implementação, ao invés de desperdiçar seu tempo lidando com configurações técnicas ou tentando improvisar posicionamentos.
                  </p>
                </div>

                <div className="bg-white/55 border border-web-green/10 rounded-xl p-5 hover:border-web-green/20 transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <span className="text-sm font-extrabold text-web-green uppercase tracking-widest block border-b border-slate-200 pb-3">
                      Sua Escolha Estratégica Hoje:
                    </span>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start space-x-3.5">
                        <span className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200 shrink-0 text-[11px] font-black uppercase tracking-wider">Caminho 1</span>
                        <p className="text-slate-600 leading-relaxed"><strong className="text-web-navy">Gastar tempo e recursos testando sozinho:</strong> Tentando aprender design, copywriting de conversão e tecnologias por tentativa e erro, lidando com frustração e resultados estagnados.</p>
                      </div>
                      <div className="flex items-start space-x-3.5">
                        <span className="px-2 py-1 rounded bg-web-lime/10 text-web-green border border-web-green/20 shrink-0 text-[11px] font-black uppercase tracking-wider">Caminho 2</span>
                        <p className="text-slate-700 leading-relaxed"><strong className="text-web-dark">Implementação Webconverte:</strong> Aprender a forma correta e receber um ecossistema digital completo (Site, Instagram, Google Meu Negócio e WhatsApp) estruturado em poucos dias, assumindo o controle da sua captação.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/45 p-6 sm:p-8 rounded-xl border border-web-green/15 hover:border-web-green/25 transition-all duration-300 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="space-y-1.5 relative z-10 text-left">
                  <span className="text-xs font-extrabold text-web-green uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded border border-web-green/15 inline-block mb-1">
                    Nosso Serviço de Implementação Integrado
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Nós montamos, configuramos e organizamos todo o seu ecossistema para que ele se torne um ativo real do seu consultório, respeitando as normas do CFP:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 text-sm relative z-10">
                  <div className="bg-slate-50 p-4.5 rounded-xl border border-web-green/10 hover:border-web-green/20 transition-all duration-300 space-y-2.5">
                    <div className="flex items-center space-x-2 text-web-green">
                      <CheckCircle2 className="w-4.5 h-4.5 text-web-green shrink-0" />
                      <strong className="text-web-navy font-extrabold block text-sm">📍 Planejamento Estratégico</strong>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">Relatório completo do modelo de negócio e criação e otimização total do seu perfil no Google, garantindo que pacientes na sua localidade te encontrem e confiem em você de imediato.</p>
                  </div>

                  <div className="bg-slate-50 p-4.5 rounded-xl border border-web-green/10 hover:border-web-green/20 transition-all duration-300 space-y-2.5">
                    <div className="flex items-center space-x-2 text-web-green">
                      <CheckCircle2 className="w-4.5 h-4.5 text-web-green shrink-0" />
                      <strong className="text-web-navy font-extrabold block text-sm">🌐 Atração e relacionamento</strong>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">Construímos seu Site, estruturamos os acessos do Link da Bio da sua página, Blog para publicação de conteúdos, além da implantação nativa de um Quiz de autopercepção.</p>
                  </div>

                  <div className="bg-slate-50 p-4.5 rounded-xl border border-web-green/10 hover:border-web-green/20 transition-all duration-300 space-y-2.5">
                    <div className="flex items-center space-x-2 text-web-green">
                      <CheckCircle2 className="w-4.5 h-4.5 text-web-green shrink-0" />
                      <strong className="text-web-navy font-extrabold block text-sm">📱 Vendas e encantamento</strong>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">Configuração da Bio, criação de posts e roteiros, planejamento de 90 dias com artes editáveis. Inclui estruturação completa do WhatsApp com scripts validados de conversão sem ferir a ética.</p>
                  </div>

                  <div className="bg-slate-50 p-4.5 rounded-xl border border-web-green/10 hover:border-web-green/20 transition-all duration-300 space-y-2.5">
                    <div className="flex items-center space-x-2 text-web-green">
                      <CheckCircle2 className="w-4.5 h-4.5 text-web-green shrink-0" />
                      <strong className="text-web-navy font-extrabold block text-sm">📊 Dados e gestão</strong>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">Não é "fazer e largar".  Dashboard completo, treinamento para impulsionar conteúdo e um acompanhamento semanal focado para garantir o crescimento acelerado da sua agenda.</p>
                  </div>
                </div>
              </div>

              {/* Pitch comparison block */}
              <div className="border-t border-slate-200 pt-8 text-center space-y-5">
                <div className="max-w-xl mx-auto space-y-2.5">
                  <p className="text-sm sm:text-base font-extrabold text-web-navy">
                    Sua meta é alcançar uma agenda lotada?
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                    Encaminhe o seu diagnóstico diretamente no nosso WhatsApp para agendar uma <strong>Consultoria Personalizada Gratuita</strong>. Analisaremos suas respostas detalhadamente e traçaremos um plano prático para você atrair pacientes qualificados sem infringir as diretrizes do CRP.
                  </p>
                </div>

                <div className="pt-2 space-y-3.5 flex flex-col items-center">
                  <button
                    onClick={handleCTAWhatsApp}
                    className="w-full sm:w-auto bg-web-lime hover:bg-web-lime/90 active:bg-web-lime/85 text-web-dark font-display font-extrabold text-sm sm:text-base px-8 py-4.5 rounded-xl shadow-xl shadow-web-lime/10 transition-all duration-300 transform hover:-translate-y-0.5 flex flex-row items-center justify-center space-x-2.5 cursor-pointer animate-pulse"
                  >
                    <MessageCircle className="w-5.5 h-5.5 fill-web-dark shrink-0 text-web-dark" />
                    <span>Solicitar Consultoria Personalizada por WhatsApp</span>
                    <ArrowRight className="w-4 h-4 text-web-dark" />
                  </button>
                  
                  <div className="text-xs sm:text-sm text-slate-500 font-bold tracking-wide uppercase">
                     Sem compromisso comercial
                  </div>
                </div>
              </div>

            </div>

            {/* CTA to retake quiz */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setView('intro');
                  setCurrentIdx(0);
                  setAnswers({});
                }}
                className="text-xs text-slate-500 hover:text-slate-600 hover:underline inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Refazer o teste de diagnóstico</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER CONTAINER */}
      <footer className="bg-white border-t border-web-green/10 py-8 px-4 mt-12 text-center text-sm text-slate-600 space-y-4 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1.5">
            <span className="font-display font-bold text-web-navy text-sm sm:text-base">Quiz de Maturidade Digital para Psicólogos</span>
            <p className="text-xs sm:text-sm text-slate-600">Uma solução estratégica desenvolvida em parceria com a agência de captação Webconverte.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 shrink-0 justify-center">
            <span className="text-xs bg-slate-50 border border-web-green/20 text-slate-700 px-3 py-1 rounded font-bold font-mono">Versão 1.0.0</span>
            <span className="text-xs text-slate-500 font-semibold">© {new Date().getFullYear()} Webconverte. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

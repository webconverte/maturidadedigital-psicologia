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

  const results = calculateFinalMetrics();

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
    const encodedText = encodeURIComponent(
      `Olá! Estive analisando meu consultório no Quiz de Maturidade Digital e gostaria de conversar sobre o meu relatório de maturidade e as sugestões de boas práticas.\n\n` +
      `📊 *Meu Diagnóstico:* \n` +
      `- *Nome:* ${lead.name}\n` +
      `- *Nota Geral:* ${Math.round(results.average)}%\n` +
      `- *Classificação:* ${results.persona.title}\n` +
      `- *Maior Gargalo:* ${results.gargalo.name}\n\n` +
      `Quero estruturar meu consultório para atrair pacientes qualificados e otimizar minha captação com a ajuda da equipe Webconverte!`
    );
    window.open(`https://wa.me/5548991444144?text=${encodedText}`, '_blank');
  };

  // Helper to map light-themed checklist colors to gorgeous dark-themed badge styles
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'survival':
        return 'bg-red-950/50 border border-red-900/40 text-red-450 text-red-300 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
      case 'stagnation':
        return 'bg-amber-950/50 border border-amber-900/40 text-amber-450 text-amber-300 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
      case 'growth':
        return 'bg-indigo-950/50 border border-indigo-900/40 text-indigo-300 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
      case 'authority':
        return 'bg-emerald-950/50 border border-emerald-900/40 text-emerald-300 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
      default:
        return 'bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm';
    }
  };

  return (
    <div className="min-h-screen bg-web-dark text-web-light selection:bg-web-lime selection:text-web-dark flex flex-col justify-between relative overflow-x-hidden">
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
            <div className="inline-flex items-center space-x-2 bg-web-navy/60 border border-web-green/30 rounded-full px-4 py-1.5 text-xs text-web-lime font-bold shadow-md shadow-web-dark/20">
              <Sparkles className="w-3.5 h-3.5 text-web-lime" />
              <span>Diagnóstico Gratuito • CRP Ético</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                Seu consultório está pronto para <span className="bg-gradient-to-r from-web-lime to-web-green bg-clip-text text-transparent">atrair pacientes</span> qualificados?
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
                Descubra em menos de 3 minutos se o seu ecossistema de marketing digital está maduro ou se você está deixando dinheiro na mesa e perdendo pacientes todos os dias.
              </p>
            </div>

            {/* Visual Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left py-6">
              <div className="bg-web-navy/40 backdrop-blur-sm p-5 rounded-2xl border border-web-navy/80 flex items-start space-x-3.5 shadow-lg hover:border-web-green/35 transition-colors duration-300">
                <div className="h-8 w-8 rounded-lg bg-web-navy/80 border border-web-green/30 flex items-center justify-center text-web-lime shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">4 Pilares de Maturidade</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-medium">Presença, Atração, Conversão e Gestão Estratégica.</p>
                </div>
              </div>
              <div className="bg-web-navy/40 backdrop-blur-sm p-5 rounded-2xl border border-web-navy/80 flex items-start space-x-3.5 shadow-lg hover:border-web-green/35 transition-colors duration-300">
                <div className="h-8 w-8 rounded-lg bg-web-navy/80 border border-web-green/30 flex items-center justify-center text-web-lime shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Plano de Ação Ético</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-medium">Recomendações técnicas estruturadas sem infringir as diretrizes do CRP.</p>
                </div>
              </div>
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
              <div className="flex items-center space-x-1.5 text-xs sm:text-sm text-slate-200 font-bold pt-1">
                <Clock className="w-4 h-4 text-web-lime" />
                <span>Leva apenas 3 minutos com 10 perguntas estratégicas</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: QUIZ SCREEN */}
        {view === 'quiz' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in" id="quiz-screen">
            {/* Quiz Progress Header */}
            <div className="bg-web-navy/90 p-5 rounded-2xl border border-web-green/20 shadow-md space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold tracking-wider uppercase">
                <span className="text-web-lime font-extrabold">{QUESTIONS[currentIdx].pillarName}</span>
                <span>Pergunta {currentIdx + 1} de {QUESTIONS.length}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 w-full bg-web-dark rounded-full overflow-hidden border border-web-green/10">
                <div 
                  className="h-full bg-gradient-to-r from-web-green to-web-lime rounded-full transition-all duration-500 ease-out shadow-sm shadow-web-lime/20"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Active Question Box */}
            <div className="bg-web-navy p-6 sm:p-8 rounded-2xl border border-web-green/20 shadow-xl space-y-6">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-snug">
                {question.text}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, oIdx) => (
                  <button
                    key={`${question.id}-opt-${oIdx}`}
                    id={`opt-${question.id}-${oIdx}`}
                    onClick={() => handleSelectOption(option.points)}
                    className="w-full text-left p-4 rounded-xl border border-web-dark hover:border-web-lime/40 bg-web-dark/40 hover:bg-web-dark/80 text-slate-350 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-web-lime flex items-start space-x-3.5 group cursor-pointer"
                  >
                    <span className="w-6.5 h-6.5 rounded-full border border-web-navy text-slate-400 group-hover:border-web-lime group-hover:text-web-lime font-mono text-xs font-bold flex items-center justify-center shrink-0 transition bg-web-dark group-hover:bg-web-navy mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="text-sm font-medium leading-[22px] mt-0.5">{option.text}</span>
                  </button>
                ))}
              </div>

              {/* Navigation Back */}
              <div className="flex justify-between items-center border-t border-web-dark/80 pt-4 mt-2">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentIdx === 0}
                  className={`text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition flex items-center space-x-1.5 shrink-0 ${
                    currentIdx === 0 
                      ? 'text-slate-600 cursor-not-allowed' 
                      : 'text-slate-200 hover:text-white hover:bg-web-dark'
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
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Seu Diagnóstico está quase pronto...
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Analisamos suas respostas. Cadastre-se abaixo para liberar o relatório de maturidade estruturado.
              </p>
            </div>

            <div className="bg-web-navy p-6 sm:p-8 rounded-2xl border border-web-green/20 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-web-green via-web-lime to-web-green"></div>

              <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4.5 flex items-start space-x-3.5 text-amber-100 leading-relaxed">
                <ShieldAlert className="w-5 h-5 text-amber-505 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1.5">
                  <h4 className="font-extrabold text-amber-400 uppercase tracking-wider text-xs">Aviso Ético (Código de Ética do CRP)</h4>
                  <p className="opacity-95 leading-relaxed text-xs text-slate-300">
                    Nossas recomendações seguem as limitações de publicidade ética clínica estabelecidas pelo Conselho Federal de Psicologia. Não incentivamos autopromoção fútil, promessas infundadas ou captação de má-fé.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-web-lime uppercase tracking-wider block">Área de Identificação</span>
                <p className="font-display font-extrabold text-base sm:text-lg text-white">
                  Preencha para liberar o seu relatório de maturidade e as sugestões de boas práticas da Webconverte:
                </p>
              </div>

              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={lead.name}
                    onChange={(e) => setLead(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Dra. Carolina Albuquerque"
                    className="w-full px-3.5 py-3 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-web-lime bg-web-dark text-white placeholder-slate-600 focus:border-web-lime/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    E-mail Profissional
                  </label>
                  <input
                    type="email"
                    required
                    value={lead.email}
                    onChange={(e) => setLead(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Ex: carolina@albuquerquepsicologia.com.br"
                    className="w-full px-3.5 py-3 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-web-lime bg-web-dark text-white placeholder-slate-600 focus:border-web-lime/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    WhatsApp (com DDD)
                  </label>
                  <input
                    type="tel"
                    required
                    value={lead.whatsapp}
                    onChange={handlePhoneChange}
                    placeholder="Ex: (48) 99144-4144"
                    className="w-full px-3.5 py-3 border border-slate-850 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-web-lime bg-web-dark text-white placeholder-slate-600 focus:border-web-lime/60 font-mono"
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
              <div className="flex justify-between items-center text-[10px] text-slate-450 pt-3 border-t border-web-dark/80">
                <span>🔒 Seus dados estão 100% seguros</span>
                <button
                  onClick={handleSkipLeadGate}
                  className="font-mono text-web-lime hover:underline cursor-pointer"
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
              <div className="w-16 h-16 rounded-full border-4 border-web-navy border-t-web-lime animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-lg">💡</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-extrabold text-xl text-white">
                Gerando Seu Diagnóstico de Maturidade...
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Estamos processando suas 10 respostas baseadas nos algoritmos de conversão comercial da Webconverte.
              </p>
            </div>

            {/* checklist of processed items */}
            <div className="max-w-xs mx-auto text-left bg-web-navy p-5 rounded-2xl border border-web-green/20 shadow-xl space-y-3 text-xs text-slate-300">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-web-lime animate-pulse shrink-0" />
                <span className="font-semibold text-white">Compilando respostas dos 4 pilares...</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-web-lime animate-pulse shrink-0" />
                <span className="font-semibold text-white">Verificando conformidade ética do CRP...</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-web-green/30 border-t-web-lime animate-spin shrink-0"></div>
                <span className="text-web-lime font-semibold animate-pulse">Isolando gargalo de conversão...</span>
              </div>
              <div className="flex items-center space-x-2.5 opacity-30">
                <div className="w-3.5 h-3.5 rounded-full bg-web-dark shrink-0"></div>
                <span>Estruturando sugestões de boas práticas...</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: RESULTS SCREEN WITH CHART AND SALES COPY */}
        {view === 'results' && (
          <div className="space-y-10 animate-fade-in" id="results-screen">
            
            {/* Top Score Summary Banner */}
            <div className="bg-web-navy p-6 sm:p-8 rounded-2xl border border-web-green/20 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-web-lime/5 rounded-full blur-2xl pointer-events-none -z-10"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3.5 text-left flex-1">
                  <div className="flex items-center space-x-3.5">
                    <span className={getBadgeStyle(results.persona.level)}>
                      {results.persona.title}
                    </span>
                  </div>
                  
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                    Sua Maturidade Digital é de <span className="text-web-lime text-3xl sm:text-4xl font-extrabold">{Math.round(results.average)}%</span>
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                    {results.persona.description}
                  </p>
                </div>

                <div className="shrink-0 bg-web-dark border border-web-green/20 p-5 rounded-xl text-center md:min-w-[170px] shadow-inner">
                  <span className="text-xs text-slate-300 font-extrabold uppercase tracking-widest block">Maior Gargalo</span>
                  <div className="font-display font-extrabold text-web-lime text-lg mt-2.5 mb-2.5 max-w-[160px] mx-auto leading-tight">
                    {results.gargalo.name.split(" (")[0]}
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#432f10] border border-amber-900/45 text-amber-300 px-3 py-1 rounded-full inline-block">
                    {results.gargalo.score}% de maturidade
                  </span>
                </div>
              </div>
            </div>

            {/* Radar Web Diagram & Gargalo breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              <div className="space-y-4">
                <div className="bg-web-navy p-5 rounded-2xl border border-web-green/20 shadow-xl">
                  <h3 className="font-display font-extrabold text-white mb-1 text-base">Visualização dos Seus Pilares</h3>
                  <p className="text-xs text-slate-450 text-slate-400 mb-4">Veja onde sua estrutura está forte e onde ela está com buracos operacionais.</p>
                  
                  <RadarChart scores={results.pillarScores} />
                </div>
              </div>

              {/* Sugestões de Boas Práticas */}
              <div className="bg-web-navy p-6 rounded-2xl border border-web-green/20 shadow-xl space-y-4 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-web-lime mb-3">
                    <span className="p-1.5 bg-web-dark border border-web-navy/40 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-web-lime" />
                    </span>
                    <h3 className="font-display font-extrabold text-white text-base">Seu Relatório de Oportunidades</h3>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Com base nas suas respostas, identificamos as seguintes fragilidades no seu posicionamento e sugerimos ações práticas executadas pela agência Webconverte para corrigi-las:
                  </p>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-web-green/20 scrollbar-track-web-dark/50">
                    {QUESTIONS.map((q) => {
                      const score = answers[q.id] || 0;
                      if (score === 100) return null; // focado nos pontos fracos
                      const feedback = getFeedbackForQuestion(q.id, score);
                      return (
                        <div key={`weak-${q.id}`} className="bg-web-dark/40 p-5 rounded-xl border border-web-green/10 space-y-4">
                          <div className="flex items-center justify-between border-b border-web-navy pb-2.5">
                            <span className="text-xs font-extrabold text-web-lime uppercase tracking-widest bg-web-navy px-3 py-1 rounded border border-web-green/15">
                              {q.pillarName}
                            </span>
                            <span className="text-xs font-mono text-slate-300 font-bold">
                              Pontuação: {score}%
                            </span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">O que você relatou:</span>
                            <p className="text-sm text-slate-100 leading-relaxed italic pr-1">
                              &ldquo;{feedback.description}&rdquo;
                            </p>
                          </div>
                          
                          <div className="bg-web-lime/5 p-4 rounded-lg border border-web-lime/15 space-y-1.5">
                            <span className="text-xs font-black text-web-lime uppercase tracking-widest block">💡 Como a Webconverte Soluciona:</span>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                              {feedback.solution}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    
                    {QUESTIONS.every(q => (answers[q.id] || 0) === 100) && (
                      <div className="bg-web-lime/5 p-6 text-center rounded-xl border border-web-lime/20 space-y-3">
                        <Sparkles className="w-8 h-8 text-web-lime mx-auto animate-pulse" />
                        <h4 className="font-display font-extrabold text-white text-sm uppercase tracking-wide">Maturidade Excepcional!</h4>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          Você atingiu nota máxima em todos os 10 pilares da nossa avaliação. Não identificamos pontos fracos imediatos de captação!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#412e14]/50 border border-amber-900/30 text-slate-300 rounded-xl p-4 text-center text-sm leading-relaxed mt-4">
                  ⚠️ <span className="font-bold text-amber-400">Atenção Especial:</span> Seu pilar de maior sensibilidade é <strong className="text-white font-extrabold">{results.gargalo.name.split(" (")[0]}</strong> (com {results.gargalo.score}%). Recomendamos priorizar a correção desse pilar imediatamente.
                </div>
              </div>

            </div>

            {/* Sales Copy: A Ponte para a Webconverte */}
            <div className="bg-web-navy text-white p-6 sm:p-10 rounded-2xl border border-web-green/30 shadow-2xl space-y-10 text-left relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-80 h-80 bg-web-lime/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-web-green/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
              
              <div className="space-y-4">
                <div className="inline-flex items-center bg-red-950/60 border border-red-900/50 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Diagnóstico Estratégico</span>
                </div>
                
                <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                  Se a sua teia de maturidade tem lacunas, seu consultório está <span className="text-red-400">perdendo pacientes particulares</span> todos os dias.
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                  Seu diagnóstico identificou que o seu maior gargalo atual é <strong className="text-web-lime font-bold">{results.gargalo.name.split(" (")[0]}</strong>. Enquanto essa brecha não for blindada profissionalmente, cada post que você publica ou cada real investido de forma intuitiva acaba sendo desperdiçado, beneficiando concorrentes regionais com menor capacidade clínica, mas maior presença digital.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-web-dark/80">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-web-lime uppercase tracking-widest">
                    A REALIDADE DO MERCADO:
                  </p>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white leading-snug">
                    Você se especializou para cuidar de vidas, não para dominar algoritmos e leilões de tráfego.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Seu tempo e energia clínica são nobres demais para serem desperdiçados decifrando o gerenciador de anúncios do Google, editando posts do Instagram, catalogando planilhas lentas ou desenhando processos de triagem no WhatsApp. Esses processos operacionais devem ser delegados a especialistas integrados.
                  </p>
                </div>

                <div className="bg-web-dark/55 border border-web-green/10 rounded-xl p-5 hover:border-web-green/20 transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <span className="text-sm font-extrabold text-web-lime uppercase tracking-widest block border-b border-web-navy pb-3">
                      Sua Escolha Estratégica Hoje:
                    </span>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start space-x-3.5">
                        <span className="px-2 py-1 rounded bg-red-950/60 text-red-405 text-red-400 border border-red-900/40 shrink-0 text-[11px] font-black uppercase tracking-wider">Caminho 1</span>
                        <p className="text-slate-300 leading-relaxed"><strong className="text-slate-100">Gastar tempo e recursos testando sozinho:</strong> Tentando aprender design, copywriting e tráfego pago por tentativa e erro, lidando com contas de anúncios bloqueadas e frustração operacional.</p>
                      </div>
                      <div className="flex items-start space-x-3.5">
                        <span className="px-2 py-1 rounded bg-web-lime/10 text-web-lime border border-web-lime/20 shrink-0 text-[11px] font-black uppercase tracking-wider">Caminho 2</span>
                        <p className="text-slate-200 leading-relaxed"><strong className="text-white">Assessoria Webconverte Operando Tudo:</strong> Focar unicamente nas suas sessões clínicas enquanto nossa equipe técnica assume toda a sua captação no Google, Meta e WhatsApp em poucos dias.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-web-dark/45 p-6 sm:p-8 rounded-xl border border-web-green/15 hover:border-web-green/25 transition-all duration-300 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="space-y-1.5 relative z-10 text-left">
                  <span className="text-xs font-extrabold text-web-lime uppercase tracking-widest bg-web-navy px-3 py-1.5 rounded border border-web-green/15 inline-block mb-1">
                    Como a Webconverte Atua de Ponta a Ponta
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Nós montamos, configuramos e otimizamos o seu ecossistema ativo de captação de pacientes particulares de modo totalmente personalizado, agindo em quatro frentes estruturantes:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm relative z-10">
                  <div className="bg-web-navy p-4.5 rounded-xl border border-web-green/10 hover:border-web-green/20 transition-all duration-300 space-y-2.5">
                    <div className="flex items-center space-x-2 text-web-lime">
                      <CheckCircle2 className="w-4.5 h-4.5 text-web-lime shrink-0" />
                      <strong className="text-slate-100 font-extrabold block text-sm">🧱 Base de Presença Regional</strong>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">Desenvolvimento completo da sua Landing Page premium de alto desempenho e setup estratégico de SEO regional e campanhas do Google Ads direcionadas ao público comprador.</p>
                  </div>

                  <div className="bg-web-navy p-4.5 rounded-xl border border-web-green/10 hover:border-web-green/20 transition-all duration-300 space-y-2.5">
                    <div className="flex items-center space-x-2 text-web-lime">
                      <CheckCircle2 className="w-4.5 h-4.5 text-web-lime shrink-0" />
                      <strong className="text-slate-100 font-extrabold block text-sm">📱 Bio-Funil & Instagram</strong>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">Estruturação de biografia comercial de alta conversão, organização dos destaques vitais, roteirização assertiva de Reels e tráfego altamente segmentado para captação de novos seguidores na sua região.</p>
                  </div>

                  <div className="bg-web-navy p-4.5 rounded-xl border border-web-green/10 hover:border-web-green/20 transition-all duration-300 space-y-2.5">
                    <div className="flex items-center space-x-2 text-web-lime">
                      <CheckCircle2 className="w-4.5 h-4.5 text-web-lime shrink-0" />
                      <strong className="text-slate-100 font-extrabold block text-sm">💬 Scripts no WhatsApp Business</strong>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">Formatação de fluxos de triagem éticas que respondem o &quot;qual o valor&quot; agregando percepção clínica, organização de etiquetas para CRM de contatos e abordagens éticas de resgate de pacientes.</p>
                  </div>

                  <div className="bg-web-navy p-4.5 rounded-xl border border-web-green/10 hover:border-web-green/20 transition-all duration-300 space-y-2.5">
                    <div className="flex items-center space-x-2 text-web-lime">
                      <CheckCircle2 className="w-4.5 h-4.5 text-web-lime shrink-0" />
                      <strong className="text-slate-100 font-extrabold block text-sm">📈 Gestão Inteligente por Dados</strong>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">Setup de pixels e tags de rastreamento para conhecer a origem exata de cada consulta gerada, além de reuniões consultivas de negócios focadas no retorno financeiro real do seu consultório.</p>
                  </div>
                </div>
              </div>

              {/* Pitch comparison block */}
              <div className="border-t border-web-dark/80 pt-8 text-center space-y-5">
                <div className="max-w-md mx-auto space-y-2.5">
                  <p className="text-sm sm:text-base font-extrabold text-slate-105 text-slate-100">
                    Pronto(a) para blindar seu consultório contra buracos sazonais na agenda?
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                    Converse com nossos especialistas de negócios para desenhar sua estrutura ativa e colocar todas essas recomendações em prática de maneira acelerada.
                  </p>
                </div>

                <div className="pt-2 space-y-3.5">
                  <button
                    onClick={handleCTAWhatsApp}
                    className="w-full sm:w-auto bg-web-lime hover:bg-web-lime/90 active:bg-web-lime/85 text-web-dark font-display font-extrabold text-sm sm:text-base px-8 py-4.5 rounded-xl shadow-xl shadow-web-lime/10 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center space-x-2.5 cursor-pointer animate-pulse"
                  >
                    <MessageCircle className="w-5.5 h-5.5 fill-web-dark shrink-0 text-web-dark" />
                    <span>Conectar e Blindar Meu Consultório</span>
                    <ArrowRight className="w-4 h-4 text-web-dark" />
                  </button>
                  
                  <div className="text-xs sm:text-sm text-slate-400 font-bold tracking-wide uppercase">
                    ⚠️ ENVIE SEU DIAGNÓSTICO INTEGRAL NO WHATSAPP PARA INICIAR A CONSULTORIA
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
                className="text-xs text-slate-500 hover:text-slate-300 hover:underline inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Refazer o teste de diagnóstico</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER CONTAINER */}
      <footer className="bg-web-dark border-t border-web-green/10 py-8 px-4 mt-12 text-center text-sm text-slate-300 space-y-4 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1.5">
            <span className="font-display font-bold text-slate-100 text-sm sm:text-base">Quiz de Maturidade Digital para Psicólogos</span>
            <p className="text-xs sm:text-sm text-slate-300">Uma solução estratégica desenvolvida em parceria com a agência de captação Webconverte.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 shrink-0 justify-center">
            <span className="text-xs bg-web-navy border border-web-green/20 text-slate-200 px-3 py-1 rounded font-bold font-mono">Versão 1.0.0</span>
            <span className="text-xs text-slate-400 font-semibold">© {new Date().getFullYear()} Webconverte. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

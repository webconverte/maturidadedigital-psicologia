import React, { useState, useEffect } from 'react';
import { Settings, Check, Copy, ExternalLink, RefreshCw, Send } from 'lucide-react';

interface DeveloperSettingsProps {
  onClose?: () => void;
}

export const DeveloperSettings: React.FC<DeveloperSettingsProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Load persisted webhook
    const saved = localStorage.getItem('webconverte_webhook_url') || '';
    setWebhookUrl(saved);

    // Load webhook execution history logs
    const savedLogs = localStorage.getItem('webconverte_webhook_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        setLogs([]);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('webconverte_webhook_url', webhookUrl);
    alert('Configurações salvas com sucesso!');
  };

  const copySamplePayload = () => {
    const sample = {
      timestamp: new Date().toISOString(),
      name: "Dra. Carolina Souza",
      email: "carolina.souza@psicologia.com.br",
      whatsapp: "(11) 99999-9999",
      scoreFinal: "45%",
      levelName: "Estagnação",
      pilarPresenca: 50,
      pilarInstagram: 30,
      pilarWhatsapp: 40,
      pilarMetricas: 60,
      maiorGargalo: "Atração e Conteúdo (Instagram)",
      leadSource: "Quiz de Maturidade Digital para Psicólogos - Webconverte",
      whatsappLink: "https://wa.me/5511999999999"
    };
    
    navigator.clipboard.writeText(JSON.stringify(sample, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearLogs = () => {
    localStorage.removeItem('webconverte_webhook_logs');
    setLogs([]);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-md rounded-2xl shadow-2xl p-5 max-w-2xl mx-auto my-6 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-indigo-400 animate-spin-slow" />
          <h3 className="font-display font-bold text-white text-base sm:text-lg">Painel de Backoffice & Integração (Webconverte)</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
        >
          {isOpen ? 'Ocultar Ferramentas' : 'Configurar Webhook / Ver Logs'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-5 animate-fade-in text-sm">
          <div>
            <label className="block font-medium text-slate-350 text-slate-300 mb-1.5">
              URL do Webhook (Make, Zapier, n8n)
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hook.us1.make.com/..."
                className="flex-1 px-3 py-2 border border-slate-800 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-950 text-white"
              />
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition flex items-center space-x-1.5 shrink-0 text-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar URL</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Essa URL receberá uma requisição HTTP POST no exato momento em que o lead preencher o formulário de captura de diagnóstico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-300 text-xs">Estrutura do JSON Enviado</span>
                <button
                  onClick={copySamplePayload}
                  className="text-indigo-400 hover:text-indigo-300 font-medium text-xs flex items-center space-x-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Payload'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-slate-300 font-mono text-[10px] rounded-lg h-44 overflow-y-auto leading-relaxed border border-slate-800">
{`{
  "timestamp": "2026-06-20T...",
  "name": "Dra. Carolina Souza",
  "email": "carolina.souza@...",
  "whatsapp": "(11) 99999-9999",
  "scoreFinal": "45%",
  "levelName": "Estagnação",
  "pilarPresenca": 50,
  "pilarInstagram": 30,
  "pilarWhatsapp": 40,
  "pilarMetricas": 60,
  "maiorGargalo": "Atração & Conteúdo",
  "leadSource": "Quiz de Maturidade...",
  "whatsappLink": "https://wa.me/..."
}`}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-300 text-xs">Registro de Disparos Recentes ({logs.length})</span>
                {logs.length > 0 && (
                  <button
                    onClick={clearLogs}
                    className="text-red-400 hover:text-red-300 font-medium text-xs cursor-pointer"
                  >
                    Limpar histórico
                  </button>
                )}
              </div>
              
              <div className="border border-slate-800 rounded-lg h-44 overflow-y-auto p-2 bg-slate-950 space-y-2">
                {logs.length === 0 ? (
                  <div className="text-slate-500 text-xs text-center h-full flex flex-col items-center justify-center space-y-1">
                    <RefreshCw className="w-5 h-5 opacity-40 animate-spin-slow" />
                    <span>Nenhum lead disparado nesta sessão.</span>
                    <span className="text-[10px]">Preencha o formulário para testar.</span>
                  </div>
                ) : (
                  [...logs].reverse().map((log, index) => (
                    <div key={index} className="bg-slate-900 border border-slate-800 p-2 rounded shadow-sm text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                          log.success ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-red-950 text-red-400 border border-red-900/40'
                        }`}>
                          {log.success ? 'SUCESSO' : 'ERRO'}
                        </span>
                      </div>
                      <div className="font-medium text-slate-200">{log.name} ({log.scoreFinal})</div>
                      <div className="text-[10px] text-slate-400 truncate">Status: {log.webhookStatus}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

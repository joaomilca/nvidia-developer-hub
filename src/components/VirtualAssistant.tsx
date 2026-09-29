import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { GeminiMarkdown } from './GeminiMarkdown';
import { 
  X, 
  Send, 
  User, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  RotateCcw,
  ExternalLink,
  Globe,
  Calculator,
  Layers,
  Terminal,
  Cpu,
  Check,
  Copy,
  ArrowRight
} from 'lucide-react';

interface VirtualAssistantProps {
  onOpenCal: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ 
  onOpenCal, 
  onNavigateToSection 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const initialWelcomeMessage: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: `Olá! Sou o **Gemini for NVIDIA AI Developer Hub**, seu assistente inteligente oficial.

Fui projetado para te orientar **exclusivamente sobre os recursos deste portal**:
- 📦 **Catálogo de Modelos NIM** (Llama 3.3 70B, DeepSeek-R1, Nemotron-4, etc.)
- 🧪 **Playground de Inferência** em tempo real com TTFT < 8ms
- 🧮 **Calculadora de Dimensionamento de GPUs** (FP4, FP8, KV Cache e TDP)
- ⚡ **Arquitetura Blackwell & Hopper** (Transformer Engine 2ª Gen, NVLink 1.8 TB/s)
- 📅 **Agendamento de Consultoria Técnica** de 30min via Cal.com

Como posso ajudar você a otimizar sua infraestrutura hoje?`,
    timestamp: 'Agora',
    action: {
      type: 'cal_booking',
      label: 'Agendar Sessão Técnica de 30min',
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const starterPromptCards = [
    {
      title: 'Vantagem do FP4 no Blackwell',
      prompt: 'Como a micro-precisão FP4 do Blackwell reduz o TCO em 70% e economiza VRAM?',
      icon: Cpu,
    },
    {
      title: 'Modelos NIM no Catálogo',
      prompt: 'Quais modelos de LLM e visão estão disponíveis no Catálogo NIM do portal?',
      icon: Layers,
    },
    {
      title: 'Calcular VRAM para 70B',
      prompt: 'Como calcular o dimensionamento de GPU para rodar o Llama 3.3 70B com batch de 16?',
      icon: Calculator,
    },
    {
      title: 'Agendar Sessão de Arquitetura',
      prompt: 'Gostaria de agendar uma sessão técnica de arquitetura com engenheiros via Cal.com.',
      icon: Calendar,
    },
  ];

  const suggestionChips = [
    'Qual a diferença de VRAM entre FP4 e FP8?',
    'Como implantar Llama 3.3 no Kubernetes com NIM?',
    'Como habilitar In-Flight Batching no TensorRT-LLM?',
    'Quais as especificações da GPU NVIDIA B200?',
    'Agendar consultoria técnica de 30min',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleResetChat = () => {
    setMessages([
      {
        ...initialWelcomeMessage,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Handle action click
  const handleActionClick = (action: ChatMessage['action']) => {
    if (!action) return;
    if (action.type === 'cal_booking') {
      onOpenCal();
    } else if (action.type === 'gpu_calculator') {
      onNavigateToSection('calculadora');
    } else if (action.type === 'navigate_section' && action.payload) {
      onNavigateToSection(action.payload);
    }
  };

  // Handle send
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    if (!textToSend) setInputMessage('');

    // Append user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Call server route /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: newHistory.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources || [],
          searchQueries: data.searchQueries || [],
          action: data.action,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // High-grade Gemini-styled fallback restricted to site scope
      const fallback = generateGeminiSiteFallback(query);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallback.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: fallback.action,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Local fallback that strictly honors the site scope
  const generateGeminiSiteFallback = (query: string): { content: string; action?: ChatMessage['action'] } => {
    const q = query.toLowerCase();

    // Check if query is unrelated to the site or NVIDIA
    const unrelatedKeywords = ['receita', 'bolo', 'futebol', 'jogo', 'filme', 'fofoca', 'novela', 'presidente', 'clima em paris', 'piada'];
    const isUnrelated = unrelatedKeywords.some(w => q.includes(w));

    if (isUnrelated) {
      return {
        content: `Como assistente inteligente do **NVIDIA AI Developer Hub**, meu escopo é focado exclusivamente nos recursos deste portal: catálogo de modelos NIM, dimensionamento de GPUs (Blackwell/Hopper), arquitetura de aceleração e agendamento de consultorias técnicas.

Como posso ajudar você a explorar as tecnologias de IA ou a infraestrutura do site hoje?`,
        action: {
          type: 'navigate_section',
          label: 'Explorar Recursos do Portal',
          payload: 'catalogo',
        }
      };
    }

    if (q.includes('agendar') || q.includes('sessão') || q.includes('reunião') || q.includes('cal.com')) {
      return {
        content: `Você pode agendar uma **sessão técnica individual de 30 minutos** diretamente com nossos arquitetos de sistemas NVIDIA.

Nosso calendário integrado do Cal.com permite selecionar o dia e horário ideais para alinhar arquitetura de clusters DGX, migração para Blackwell ou validação de contêineres NIM.`,
        action: {
          type: 'cal_booking',
          label: 'Agendar Sessão de 30min no Cal.com',
        }
      };
    }

    if (q.includes('fp4') || q.includes('fp8') || q.includes('vram') || q.includes('quantização')) {
      return {
        content: `### Comparativo de Precisão e Pegada de Memória

A arquitetura **NVIDIA Blackwell (B200 / GB200)** introduziu o **Transformer Engine de 2ª geração** com suporte nativo a micro-precisão FP4:

1. **FP8 (Hopper H100/H200):**
   - 1 byte por parâmetro.
   - Modelo 70B requer ~70 GB apenas para os pesos.
2. **FP4 (Blackwell B200):**
   - 0.5 byte por parâmetro com escalonamento em micro-blocos de 16 elementos.
   - Modelo 70B reduz para apenas ~35 GB de pesos!
3. **Ganhos Comprovados:**
   - **50% de redução de VRAM** em relação ao FP8.
   - **70% de redução no TCO** (Total Cost of Ownership).
   - Dobro da taxa de tokens/segundo sem perda mensurável de acurácia no benchmark MMLU.`,
        action: {
          type: 'gpu_calculator',
          label: 'Calcular na Calculadora de GPU',
        }
      };
    }

    if (q.includes('modelo') || q.includes('nim') || q.includes('catálogo') || q.includes('catalogo')) {
      return {
        content: `### Modelos em Destaque no Catálogo NIM

O **Catálogo de Modelos do portal** conta com microserviços prontos para produção compilados com TensorRT-LLM:

- **Meta Llama 3.3 70B Instruct:** TTFT de 6.8ms, 138 tok/s, suporte nativo a FP8 e FP4.
- **DeepSeek-R1 Distill Llama 70B:** Especialista em raciocínio analítico e geração de Cadeia de Pensamento (CoT).
- **NVIDIA Nemotron-4 340B Instruct:** Ideal para alinhamento sintético e geração de dados empresariais.
- **Microsoft Kosmos-2:** Visão computacional e ancoragem espacial multimodal.
- **NVIDIA Riva Conformer:** Transcrição de fala de alta precisão ASR.`,
        action: {
          type: 'navigate_section',
          label: 'Abrir Catálogo NIM',
          payload: 'catalogo',
        }
      };
    }

    return {
      content: `Entendido! No ecossistema **NVIDIA AI Developer Hub**, todas as ferramentas estão integradas:
- Você pode simular o throughput de inferência no **Playground**
- Dimensionar os nós de computação na **Calculadora de GPU**
- Analisar a interconexão NVLink de 1.8 TB/s na seção de **Arquitetura**
- Agendar uma reunião com nossos arquitetos para suporte corporativo.`,
      action: {
        type: 'cal_booking',
        label: 'Agendar Sessão Técnica de 30min',
      }
    };
  };

  return (
    <>
      {/* Floating Trigger Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 p-2.5 sm:p-3 bg-[#0D120D] hover:bg-[#121A12] text-white border border-[#24351F] hover:border-[#76B900] rounded-full shadow-2xl transition-all hover:scale-105 nvidia-glow cursor-pointer group"
          aria-label="Abrir assistente Gemini NVIDIA Hub"
        >
          {/* Gemini Sparkle Icon with animated glowing gradient */}
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#76B900] via-[#34D399] to-[#60A5FA] p-[1.5px] shadow-sm shadow-[#76B900]/40">
            <div className="w-full h-full rounded-full bg-[#0B0F0B] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#76B900] animate-pulse group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#76B900] ring-2 ring-black" />
          </div>

          <div className="hidden sm:flex flex-col text-left pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-[#76B900] transition-colors">
                Gemini • NVIDIA Hub
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#76B900]/20 text-[#76B900] font-mono font-semibold">
                IA
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
              Online • Responde sobre o site
            </span>
          </div>
        </button>
      )}

      {/* Expanded Chat Drawer / Widget */}
      {isOpen && (
        <div 
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[96vw] sm:w-[460px] h-[640px] max-h-[90vh] bg-[#0A0D0A] border border-[#22331C] rounded-2xl shadow-2xl flex flex-col overflow-hidden nvidia-glow"
        >
          {/* Header styled like Google Gemini + NVIDIA */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#080B08] border-b border-[#1A2617]">
            <div className="flex items-center gap-2.5">
              {/* Gemini Star Badge */}
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#76B900] via-[#2DD4BF] to-[#818CF8] p-[1.5px] shadow-sm shadow-[#76B900]/30">
                <div className="w-full h-full rounded-[10px] bg-[#0C110C] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#76B900]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide">Gemini</span>
                  <span className="text-xs text-neutral-400 font-medium">NVIDIA Hub</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#76B900]/15 text-[#76B900] font-mono font-bold border border-[#76B900]/30">
                    Flash 3.8
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#76B900]" />
                  <span>Especialista no Site & NIM • Google Search</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
                title="Nova conversa (Reiniciar)"
                aria-label="Reiniciar conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
                aria-label="Minimizar chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
                aria-label="Fechar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#090C09] scroll-smooth">
            {/* If conversation only has 1 message, show Gemini Starter Prompt Cards */}
            {messages.length === 1 && (
              <div className="my-2 space-y-3">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#10170F] to-[#0A0E0A] border border-[#1E2E19]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-[#76B900]" />
                    <span className="text-xs font-semibold text-white">
                      Guia Oficial do Portal
                    </span>
                  </div>
                  <p className="text-[11.5px] text-neutral-400 leading-relaxed">
                    Pergunte qualquer detalhe técnico sobre o catálogo de modelos, dimensionamento na calculadora ou arquitetura Blackwell.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {starterPromptCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(card.prompt)}
                        className="p-2.5 rounded-xl bg-[#0D120D] hover:bg-[#131C13] border border-[#1C2819] hover:border-[#76B900]/50 transition-all text-left flex items-start gap-2.5 group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#152014] text-[#76B900] flex items-center justify-center shrink-0 border border-[#23331F] group-hover:scale-105 transition-transform">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-white group-hover:text-[#76B900] transition-colors truncate">
                            {card.title}
                          </div>
                          <div className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5 leading-tight">
                            {card.prompt}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Render Chat Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Gemini Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#76B900]/30 to-[#38BDF8]/30 border border-[#76B900]/50 flex items-center justify-center shrink-0 mt-0.5 text-[#76B900] shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[88%] space-y-2`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#152213] text-white border border-[#283C22] rounded-tr-none'
                        : 'bg-[#101510] text-neutral-200 border border-[#1C2719] rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <GeminiMarkdown content={msg.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}

                    {/* Google Search Grounding Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#1C2919]">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 mb-1.5">
                          <Globe className="w-3 h-3 text-[#60A5FA]" />
                          <span>Fontes consultadas pelo Google:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((source, sIdx) => (
                            <a
                              key={sIdx}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#131B12] hover:bg-[#1A2619] border border-[#202E1D] text-[10px] text-neutral-300 hover:text-white transition-colors"
                            >
                              <span className="truncate max-w-[170px]">{source.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer info & Copy Action */}
                    <div className="flex items-center justify-between mt-2 pt-1 text-[9px] font-mono text-neutral-500">
                      <span>{msg.timestamp}</span>

                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="flex items-center gap-1 hover:text-neutral-300 transition-colors cursor-pointer"
                          title="Copiar resposta"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-[#76B900]" />
                              <span className="text-[#76B900]">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interactive Site Action Button */}
                  {msg.action && (
                    <div className="pl-1">
                      <button
                        onClick={() => handleActionClick(msg.action)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-black bg-gradient-to-r from-[#76B900] to-[#86D200] hover:brightness-110 rounded-xl transition-all shadow-md shadow-[#76B900]/20 cursor-pointer active:scale-95"
                      >
                        {msg.action.type === 'cal_booking' ? (
                          <Calendar className="w-3.5 h-3.5" />
                        ) : msg.action.type === 'gpu_calculator' ? (
                          <Calculator className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                        <span>{msg.action.label}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5 border border-neutral-700">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Gemini Thinking / Generating Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#76B900]/30 to-[#38BDF8]/30 border border-[#76B900]/50 flex items-center justify-center shrink-0 text-[#76B900] animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-3 bg-[#101510] border border-[#1C2719] rounded-2xl rounded-tl-none space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#76B900]">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#76B900] animate-ping" />
                    <span>Gemini está analisando o portal...</span>
                  </div>
                  <div className="w-44 h-1.5 rounded-full bg-neutral-800 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#76B900] to-transparent w-full animate-shimmer" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips Carousel */}
          <div className="px-3 py-2 bg-[#080B08] border-t border-[#162014] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 text-[10.5px] text-neutral-300 hover:text-white bg-[#0F140F] hover:bg-[#151E14] border border-[#1C2619] hover:border-[#76B900]/50 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box Styled like Google Gemini */}
          <div className="p-3 bg-[#080A08] border-t border-[#1A2617] space-y-1.5">
            <div className="relative flex items-center bg-[#0F140F] border border-[#202E1D] focus-within:border-[#76B900] focus-within:ring-1 focus-within:ring-[#76B900]/40 rounded-xl transition-all">
              <input
                ref={inputRef}
                type="text"
                placeholder="Pergunte ao Gemini sobre modelos NIM, GPUs, FP4 ou agendamento..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                className="w-full bg-transparent px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none"
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isLoading}
                className="m-1.5 p-2 bg-gradient-to-r from-[#76B900] to-[#86D200] hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100 text-black rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
                aria-label="Enviar mensagem"
                title="Enviar mensagem"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scope Guardrail Disclaimer */}
            <p className="text-[9.5px] text-center text-neutral-500 font-mono">
              Gemini para NVIDIA AI Hub • Respostas restritas às ferramentas e arquitetura do portal.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

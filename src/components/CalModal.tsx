import React, { useEffect, useState } from 'react';
import { X, Calendar, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';

interface CalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalModal: React.FC<CalModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-4xl h-[90vh] max-h-[780px] bg-[#101310] border border-[#232F1D] rounded-xl flex flex-col shadow-2xl overflow-hidden nvidia-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E261A] bg-[#0E100E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#76B900]/10 border border-[#76B900]/30 flex items-center justify-center text-[#76B900]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Agendar Sessão de Arquitetura de IA
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#76B900] bg-[#76B900]/10 px-2 py-0.5 rounded border border-[#76B900]/20">
                  <ShieldCheck className="w-3 h-3" /> Especialista NVIDIA
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Consulta técnica de 30 minutos via Cal.com sobre NIM, Blackwell e dimensionamento
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://cal.com/joao-milca-olleyx/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors border border-neutral-800 rounded-md hover:border-neutral-700"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Nova aba</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/80 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Iframe Container */}
        <div className="relative flex-1 w-full bg-[#0D0F0D]">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0F0D] z-10">
              <Loader2 className="w-8 h-8 text-[#76B900] animate-spin mb-3" />
              <p className="text-xs font-mono text-neutral-400">Carregando calendário interativo Cal.com...</p>
            </div>
          )}

          <iframe
            src="https://cal.com/joao-milca-olleyx/30min"
            title="Agendamento Cal.com"
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            allow="camera; microphone; autoplay; display-capture"
          />
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 py-2.5 bg-[#0B0D0B] border-t border-[#1E261A] flex items-center justify-between text-[11px] text-neutral-500">
          <span>Pressione <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-300 font-mono text-[10px]">ESC</kbd> para fechar</span>
          <span className="text-[#76B900] font-medium">cal.com/joao-milca-olleyx/30min</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Github, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenCal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCal }) => {
  return (
    <footer className="bg-[#080A08] border-t border-[#161D13] py-12 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-[#141A12]">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#76B900] to-[#4D7A00] flex items-center justify-center p-1 shadow-sm shadow-[#76B900]/20">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="w-full h-full text-black stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5c1.38 0 2.63.56 3.54 1.46l-1.41 1.41C13.56 9.3 12.83 9 12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.96 0 1.8-.45 2.34-1.15l1.43 1.43C14.86 16.27 13.51 17 12 17z" fill="currentColor"/>
                </svg>
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                NVIDIA AI Developer Hub
              </span>
            </div>
            
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Plataforma de engenharia de IA dedicada a arquitetos de soluções, desenvolvedores e 
              pesquisadores. Acelerando a computação moderna com NVIDIA NIM, TensorRT-LLM e micro-precisão FP4.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={onOpenCal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-[#76B900] hover:bg-[#86D200] rounded-lg transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar via Cal.com</span>
              </button>

              <a
                href="https://github.com/joaomilca/nvidia-ai-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-[#101410] border border-[#1C2518] hover:border-neutral-700 rounded-lg transition-colors"
                title="Repositório GitHub nvidia-ai-hub"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repositório</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#catalogo" className="hover:text-[#76B900] transition-colors">
                  Catálogo de Modelos NIM
                </a>
              </li>
              <li>
                <a href="#playground" className="hover:text-[#76B900] transition-colors">
                  Playground em Tempo Real
                </a>
              </li>
              <li>
                <a href="#calculadora" className="hover:text-[#76B900] transition-colors">
                  Calculadora de GPU
                </a>
              </li>
              <li>
                <a href="#arquitetura" className="hover:text-[#76B900] transition-colors">
                  Arquitetura de Engenharia
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-[#76B900] transition-colors">
                  FAQs Técnicas
                </a>
              </li>
            </ul>
          </div>

          {/* NVIDIA Ecosystem */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Ecossistema
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://developer.nvidia.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>NVIDIA Developer</span>
                  <ExternalLink className="w-3 h-3 text-neutral-600" />
                </a>
              </li>
              <li>
                <a 
                  href="https://ngc.nvidia.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>NVIDIA NGC Registry</span>
                  <ExternalLink className="w-3 h-3 text-neutral-600" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nvidia.com/pt-br/data-center/dgx-cloud/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>NVIDIA DGX Cloud</span>
                  <ExternalLink className="w-3 h-3 text-neutral-600" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nvidia.com/pt-br/data-center/tensorrt/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>TensorRT-LLM</span>
                  <ExternalLink className="w-3 h-3 text-neutral-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Cal.com Booking direct access */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Consultoria
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Agende uma sessão técnica individual com o Arquiteto de Soluções da NVIDIA para dimensionamento de clusters DGX e implantação corporativa de NIM.
            </p>
            <a
              href="https://cal.com/joao-milca-olleyx/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#76B900] hover:underline flex items-center gap-1 font-mono text-[11px] pt-1"
            >
              <span>cal.com/joao-milca-olleyx/30min</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#76B900]" />
            <span>© {new Date().getFullYear()} NVIDIA Corporation. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-300 transition-colors">Privacidade</span>
            <span>·</span>
            <span className="hover:text-neutral-300 transition-colors">Termos de Uso</span>
            <span>·</span>
            <span className="hover:text-neutral-300 transition-colors">NVIDIA AI Enterprise</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

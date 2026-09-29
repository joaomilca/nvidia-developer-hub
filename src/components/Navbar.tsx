import React, { useState } from 'react';
import { Calendar, Github, Menu, X, Cpu, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCal: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCal, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'catalogo', label: 'Catálogo NIM', href: '#catalogo' },
    { id: 'playground', label: 'Playground', href: '#playground' },
    { id: 'calculadora', label: 'Calculadora GPU', href: '#calculadora' },
    { id: 'arquitetura', label: 'Arquitetura', href: '#arquitetura' },
    { id: 'faqs', label: 'FAQs', href: '#faqs' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0B]/90 backdrop-blur-md border-b border-[#1A2117] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: NVIDIA Brand Lockup */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#76B900] rounded-lg"
          aria-label="NVIDIA AI Developer Hub - Início"
        >
          {/* Authentic NVIDIA Claw / Eye Glyph Symbol */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#76B900] to-[#4D7A00] flex items-center justify-center p-1.5 shadow-md shadow-[#76B900]/20 group-hover:brightness-110 transition-all">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-full h-full text-black stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5c1.38 0 2.63.56 3.54 1.46l-1.41 1.41C13.56 9.3 12.83 9 12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.96 0 1.8-.45 2.34-1.15l1.43 1.43C14.86 16.27 13.51 17 12 17z" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                NVIDIA
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#76B900]">
                AI Hub
              </span>
            </div>
          </div>
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`hover:text-[#76B900] transition-colors relative py-1 ${
                activeSection === link.id ? 'text-[#76B900] font-semibold' : ''
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#76B900] rounded-full" />
              )}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions (GitHub & Cal.com CTA) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/joaomilca/nvidia-ai-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-[#141814] border border-transparent hover:border-neutral-800"
            title="Repositório GitHub nvidia-ai-hub"
            aria-label="Repositório GitHub nvidia-ai-hub"
          >
            <Github className="w-5 h-5" />
          </a>

          <button
            onClick={onOpenCal}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-black bg-[#76B900] hover:bg-[#86D200] active:scale-[0.98] rounded-lg transition-all shadow-md shadow-[#76B900]/25 whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar via Cal.com</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenCal}
            className="px-2.5 py-1.5 text-xs font-semibold text-black bg-[#76B900] rounded-md"
          >
            Agendar
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1A2117] bg-[#0E100E] px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-neutral-200 hover:text-[#76B900] hover:bg-[#141814] rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <a
              href="https://github.com/joaomilca/nvidia-ai-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white py-2"
            >
              <Github className="w-4 h-4" />
              <span>github.com/joaomilca/nvidia-ai-hub</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-[#76B900] rounded-md"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Sessão</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

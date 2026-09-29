import React, { useState } from 'react';
import { FAQS_DATA } from '../data/modelsData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first item open by default

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 border-b border-[#1A2117] scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#76B900] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Perguntas Frequentes & Diretrizes de Engenharia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Perguntas Frequentes sobre NVIDIA NIM
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            Tudo o que você precisa saber sobre arquitetura, licenciamento, paridade de código e 
            deploy em ambientes corporativos de alto desempenho.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isOpen 
                    ? 'bg-[#121612] border-[#76B900]/50 shadow-md' 
                    : 'bg-[#0E110E] border-[#1D2619] hover:border-neutral-700'
                }`}
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded-md text-[#76B900] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-[#76B900]/10' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-[#1C2518]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

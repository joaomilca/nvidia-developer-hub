import React from 'react';
import { ArrowRight, Calendar, Sparkles, Terminal, Shield, Zap } from 'lucide-react';

interface HeroProps {
  onOpenCal: () => void;
  onExploreModels: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCal, onExploreModels }) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-[#1A2117]">
      {/* Background Glow Mesh */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#76B900]/10 via-[#76B900]/3 to-transparent blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Editorial Lead-in (Zero-pill discipline) */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#76B900]">
              <span className="w-2 h-2 rounded-full bg-[#76B900] animate-pulse" />
              <span>NVIDIA Inference Microservices (NIM)</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">Blackwell & Hopper Architecture</span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              Supercomputação de IA em Qualquer Nuvem com <span className="text-[#76B900]">Latência Sub-Milissegundo</span>
            </h1>

            {/* Contextual Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Implante modelos de fundação com contêineres pré-compilados acelerados por 
              <strong className="text-white font-medium"> TensorRT-LLM</strong>, 
              <strong className="text-white font-medium"> In-Flight Batching</strong> e 
              <strong className="text-white font-medium"> micro-precisão FP4</strong>. Máximo throughput 
              com compatibilidade total com a API da OpenAI.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreModels}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-black bg-[#76B900] hover:bg-[#86D200] active:scale-[0.98] rounded-lg transition-all shadow-lg shadow-[#76B900]/25 cursor-pointer"
              >
                <span>Explorar Catálogo NIM</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCal}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#141814] hover:bg-[#1A221A] border border-[#27351F] hover:border-[#76B900]/50 rounded-lg transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#76B900]" />
                <span>Agendar Sessão Técnica</span>
              </button>
            </div>

            {/* Tech Badges (Natural inline metadata without candy pills) */}
            <div className="pt-4 flex items-center flex-wrap gap-y-2 gap-x-6 text-xs text-neutral-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#76B900]" />
                <span>NVIDIA AI Enterprise Certified</span>
              </div>
              <span className="text-neutral-700">·</span>
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#76B900]" />
                <span>100% OpenAI API Compatible</span>
              </div>
              <span className="text-neutral-700">·</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#76B900]" />
                <span>FP4 / FP8 Micro-Precision</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Supercomputer Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#232F1D] bg-[#121412] p-1.5 shadow-2xl nvidia-glow-sm">
              <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-xl overflow-hidden bg-[#0A0C0A]">
                <img
                  src="/src/assets/images/nvidia_supercomputer_cluster_1790198837465.jpg"
                  alt="NVIDIA Blackwell AI Supercomputer Datacenter"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* Overlaid Live Spec Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-neutral-300 bg-black/75 backdrop-blur-md p-2.5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#76B900]" />
                    <span className="font-semibold text-white">NVIDIA DGX B200 SuperPOD</span>
                  </div>
                  <span className="text-[#76B900]">1.8 TB/s NVLink</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

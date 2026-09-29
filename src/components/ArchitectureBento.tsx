import React from 'react';
import { Cpu, Network, RefreshCw, Database, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const ArchitectureBento: React.FC = () => {
  return (
    <section id="arquitetura" className="py-16 md:py-24 border-b border-[#1A2117] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#1A2117] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#76B900] mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Full-Stack AI Acceleration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Arquitetura de Engenharia de Sistemas
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Como o silício da NVIDIA se une ao compilador TensorRT-LLM e microserviços NIM para 
              eliminar os gargalos fundamentais de largura de banda e computação.
            </p>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Transformer Engine 2nd Gen & FP4 (Wide / 7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between p-6 bg-[#101410] border border-[#1E271B] rounded-2xl relative overflow-hidden group hover:border-[#76B900]/50 transition-all nvidia-border-glow">
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-[#76B900]/10 text-[#76B900]">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[#76B900] font-semibold">
                  Blackwell Architecture
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Transformer Engine de 2ª Geração & Micro-Precisão FP4
              </h3>
              
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                Introduzido na arquitetura Blackwell, o novo Transformer Engine combina hardware de 
                Tensor Cores de 5ª geração com algoritmos preditivos de escalonamento numérico. Ao 
                processar pesos e ativações em FP4 com precisão dinâmica em micro-blocos, dobra o 
                throughput computacional para até 20 PFLOPS por nó sem degradação de perplexidade.
              </p>

              {/* Technical Comparison Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#0B0D0B] rounded-xl border border-[#192215] text-xs font-mono mb-4">
                <div>
                  <span className="text-neutral-500 block text-[10px]">FP16 (VOLTA/AMPERE)</span>
                  <span className="text-neutral-300 font-bold">2.0 Bytes</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">FP8 (HOPPER)</span>
                  <span className="text-neutral-300 font-bold">1.0 Byte (-50%)</span>
                </div>
                <div>
                  <span className="text-[#76B900] block text-[10px] font-bold">FP4 (BLACKWELL)</span>
                  <span className="text-[#76B900] font-extrabold">0.5 Byte (-75%)</span>
                </div>
              </div>
            </div>

            {/* Embedded Visual Asset */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-[#222E1C] mt-2">
              <img
                src="/src/assets/images/bento_transformer_engine_1790198848694.jpg"
                alt="Transformer Engine 2nd Gen Silicon Micro-architecture"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-neutral-300">
                <span>Micro-Precision Scaling Core · 4-bit Tensor Math</span>
              </div>
            </div>

          </div>

          {/* Bento Card 2: NVLink 1.8 TB/s (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between p-6 bg-[#101410] border border-[#1E271B] rounded-2xl relative overflow-hidden group hover:border-[#76B900]/50 transition-all nvidia-border-glow">
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-[#76B900]/10 text-[#76B900]">
                  <Network className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[#76B900] font-semibold">
                  5th Gen Interconnect
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                NVLink 1.8 TB/s Bidirecional
              </h3>
              
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                A 5ª geração do NVLink oferece 1.8 TB/s de largura de banda bidirecional por GPU, 
                garantindo que clusters massivos de 72 GPUs Blackwell (NVL72) operem como um único 
                acelerador unificado com até 130 TB/s de largura de banda agregada.
              </p>

              <ul className="space-y-1.5 text-xs text-neutral-300 font-mono mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900]" />
                  <span>2x largura de banda sobre NVLink 4</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900]" />
                  <span>Redução de latência All-Reduce em 3.4x</span>
                </li>
              </ul>
            </div>

            {/* Embedded Visual Asset */}
            <div className="relative h-40 rounded-xl overflow-hidden border border-[#222E1C]">
              <img
                src="/src/assets/images/bento_nvlink_interconnect_1790198859394.jpg"
                alt="NVIDIA NVLink High Bandwidth Interconnect Mesh"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-neutral-300">
                <span>NVLink Switch Network · 1.8 TB/s por GPU</span>
              </div>
            </div>

          </div>

          {/* Bento Card 3: In-Flight Batching (6 cols) */}
          <div className="md:col-span-6 p-6 bg-[#101410] border border-[#1E271B] rounded-2xl group hover:border-[#76B900]/50 transition-all nvidia-border-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-[#76B900]/10 text-[#76B900]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-[#76B900] font-semibold">
                TensorRT-LLM Runtime
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              In-Flight Batching (Continuous Scheduling)
            </h3>
            
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
              Em pipelines de inferência tradicionais, as requisições em batch eram sincronizadas por 
              ciclos estáticos: uma única requisição longa travava todas as outras. Com o In-Flight 
              Batching do TensorRT-LLM, o agendamento opera no nível da iteração de token. Novas 
              requisições entram imediatamente e requisições concluídas desocupam a VRAM no milissegundo 
              exato em que geram o token EOS.
            </p>

            <div className="p-3 bg-[#0B0D0B] rounded-xl border border-[#192215] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Batching Estático Convencional</span>
                <span className="text-red-400">Ocioso ~42% do tempo</span>
              </div>
              <div className="flex items-center justify-between text-[#76B900] font-bold">
                <span>In-Flight Batching NVIDIA NIM</span>
                <span>Ocupação contínua ~98%</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Paged KV Cache (6 cols) */}
          <div className="md:col-span-6 p-6 bg-[#101410] border border-[#1E271B] rounded-2xl group hover:border-[#76B900]/50 transition-all nvidia-border-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-[#76B900]/10 text-[#76B900]">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-[#76B900] font-semibold">
                Memory Management
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Paged KV Cache & Desfragmentação Virtual
            </h3>
            
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
              Inspirado na paginação de memória virtual dos sistemas operacionais modernos, o Paged 
              KV Cache divide a memória de chaves e valores dos transformers em blocos não-contíguos 
              de 64 tokens. Isso elimina 100% da fragmentação externa e permite que o NIM compartilhe 
              prefixos comuns de prompts e documentos RAG entre múltiplos usuários simultâneos.
            </p>

            <div className="p-3 bg-[#0B0D0B] rounded-xl border border-[#192215] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Fragmentação Padrão</span>
                <span className="text-neutral-400">Desperdiça até 65% da HBM</span>
              </div>
              <div className="flex items-center justify-between text-[#76B900] font-bold">
                <span>Paged KV Cache + Prefix Caching</span>
                <span>Utilização de VRAM {'>'} 96%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState, useMemo } from 'react';
import { NimModel, ModelCategory } from '../types';
import { NIM_MODELS } from '../data/modelsData';
import { Search, Play, Cpu, Zap, Layers, Sparkles, Filter } from 'lucide-react';

interface ModelCatalogProps {
  onSelectModelForPlayground: (model: NimModel) => void;
}

export const ModelCatalog: React.FC<ModelCatalogProps> = ({ onSelectModelForPlayground }) => {
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todos os Modelos' },
    { id: 'llms', label: 'LLMs & Raciocínio' },
    { id: 'rag', label: 'RAG & Embeddings' },
    { id: 'vision', label: 'Vision & Multimodal' },
    { id: 'voice', label: 'Áudio & Voice' },
    { id: 'biomedical', label: 'Biomédico & Ciências' },
  ];

  const filteredModels = useMemo(() => {
    return NIM_MODELS.filter((model) => {
      const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
      const matchesQuery = 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="catalogo" className="py-16 md:py-24 border-b border-[#1A2117] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#1A2117] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#76B900] mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>NVIDIA NGC Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Catálogo de Microserviços de IA (NIM)
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Modelos de ponta empacotados como contêineres padrão da indústria, otimizados com 
              TensorRT-LLM para execução de alta densidade em GPUs NVIDIA.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400">
            Mostrando <span className="text-[#76B900] font-bold tabular-nums">{filteredModels.length}</span> modelos certificados
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Segmented Category Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121612] border border-[#1E261A] rounded-xl overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as ModelCategory)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#76B900] text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, tag ou arquitetura..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121612] border border-[#1E261A] focus:border-[#76B900] focus:ring-1 focus:ring-[#76B900] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Models Grid */}
        {filteredModels.length === 0 ? (
          <div className="p-12 text-center bg-[#101310] border border-[#1E261A] rounded-2xl">
            <p className="text-neutral-400 text-sm mb-3">Nenhum modelo encontrado para os critérios selecionados.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 text-xs font-semibold text-black bg-[#76B900] rounded-lg cursor-pointer"
            >
              Resetar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="flex flex-col justify-between p-5 bg-[#101410] border border-[#1D2619] rounded-2xl hover:border-[#76B900]/50 transition-all group nvidia-border-glow"
              >
                <div>
                  {/* Card Header: Publisher & Category unboxed text */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-2">
                    <span className="truncate max-w-[190px]">{model.publisher}</span>
                    <span className="text-[#76B900] capitalize">{model.category}</span>
                  </div>

                  {/* Model Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-[#76B900] transition-colors leading-tight">
                    {model.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                    {model.description}
                  </p>

                  {/* Core Technical Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#1A2217] text-xs font-mono">
                    <div className="bg-[#0B0D0B] p-2 rounded-lg border border-[#192016]">
                      <span className="text-neutral-500 block text-[10px]">PARÂMETROS</span>
                      <span className="text-neutral-100 font-semibold tabular-nums">{model.parameters}</span>
                    </div>

                    <div className="bg-[#0B0D0B] p-2 rounded-lg border border-[#192016]">
                      <span className="text-neutral-500 block text-[10px]">CONTEXTO</span>
                      <span className="text-neutral-100 font-semibold tabular-nums">{model.contextWindow}</span>
                    </div>

                    <div className="bg-[#0B0D0B] p-2 rounded-lg border border-[#192016]">
                      <span className="text-neutral-500 block text-[10px]">LATÊNCIA (TTFT)</span>
                      <span className="text-[#76B900] font-semibold tabular-nums">~{model.ttftMs}ms</span>
                    </div>

                    <div className="bg-[#0B0D0B] p-2 rounded-lg border border-[#192016]">
                      <span className="text-neutral-500 block text-[10px]">VRAM FP8 MIN</span>
                      <span className="text-neutral-100 font-semibold tabular-nums">{model.vramFp8Gb} GB</span>
                    </div>
                  </div>

                  {/* Hardware Recommendation Note */}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 bg-[#0E110E] px-2.5 py-1.5 rounded-lg border border-[#1A2217]">
                    <Cpu className="w-3.5 h-3.5 text-[#76B900] shrink-0" />
                    <span className="truncate">Hardware: <strong className="text-neutral-200">{model.recommendedHardware}</strong></span>
                  </div>
                </div>

                {/* Card Footer: Action Button */}
                <div className="mt-5 pt-4 border-t border-[#1A2217] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <Zap className="w-3 h-3 text-[#76B900]" />
                    <span>NIM Ready</span>
                  </div>

                  <button
                    onClick={() => onSelectModelForPlayground(model)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-[#76B900] hover:bg-[#86D200] active:scale-[0.98] rounded-lg transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Testar no Playground</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

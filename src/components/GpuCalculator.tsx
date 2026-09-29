import React, { useState, useMemo } from 'react';
import { Precision, GpuRecommendation } from '../types';
import { Calculator, Cpu, Zap, DollarSign, ArrowRight, ShieldCheck, Info } from 'lucide-react';

interface GpuCalculatorProps {
  onOpenCal: () => void;
}

export const GpuCalculator: React.FC<GpuCalculatorProps> = ({ onOpenCal }) => {
  const [modelParamsBillions, setModelParamsBillions] = useState<number>(70);
  const [precision, setPrecision] = useState<Precision>('FP8');
  const [contextTokensK, setContextTokensK] = useState<number>(32); // 32k tokens
  const [batchConcurrency, setBatchConcurrency] = useState<number>(16);

  // Common model sizes presets
  const modelPresets = [
    { label: '8B', value: 8 },
    { label: '14B', value: 14 },
    { label: '32B', value: 32 },
    { label: '70B', value: 70 },
    { label: '140B', value: 140 },
    { label: '405B', value: 405 },
  ];

  const precisionOptions: Precision[] = ['FP4', 'FP8', 'INT8', 'FP16'];

  // Calculations
  const calculation = useMemo(() => {
    // Bytes per parameter
    const bytesPerParamMap: Record<Precision, number> = {
      FP4: 0.5,
      FP8: 1.0,
      INT8: 1.0,
      FP16: 2.0,
    };

    const bytesPerParam = bytesPerParamMap[precision];

    // Model Weights VRAM (GB)
    const weightsVram = modelParamsBillions * bytesPerParam;

    // KV Cache VRAM calculation (GB)
    // Formula accounting for GQA and batch concurrency
    const kvBytesPerToken = precision === 'FP4' ? 0.5 : precision === 'FP8' ? 1.0 : 2.0;
    const kvCacheFactor = 0.00018 * Math.pow(modelParamsBillions / 70, 0.5);
    const kvCacheVram = Math.max(1, batchConcurrency * (contextTokensK * 1024) * kvCacheFactor * (kvBytesPerToken / 1.0));

    // Runtime CUDA overhead (Paged attention tables, activation buffers ~15%)
    const runtimeOverhead = (weightsVram + kvCacheVram) * 0.15;

    // Total VRAM needed
    const totalVramRequired = Math.round(weightsVram + kvCacheVram + runtimeOverhead);

    // Baseline FP16 calculation for comparison
    const fp16Weights = modelParamsBillions * 2.0;
    const fp16KvCache = Math.max(1, batchConcurrency * (contextTokensK * 1024) * kvCacheFactor * 2.0);
    const fp16Total = Math.round(fp16Weights + fp16KvCache + (fp16Weights + fp16KvCache) * 0.15);

    // Hardware specifications
    const gpuSpecs = [
      {
        name: 'NVIDIA B200 (Blackwell)',
        architecture: 'Blackwell',
        memoryGb: 192,
        bandwidthTb: 8.0,
        tdpWatts: 1000,
        hourlyCost: 4.80,
      },
      {
        name: 'NVIDIA H200 (Hopper)',
        architecture: 'Hopper',
        memoryGb: 141,
        bandwidthTb: 4.8,
        tdpWatts: 700,
        hourlyCost: 3.50,
      },
      {
        name: 'NVIDIA H100 SXM5',
        architecture: 'Hopper',
        memoryGb: 80,
        bandwidthTb: 3.35,
        tdpWatts: 700,
        hourlyCost: 2.80,
      },
      {
        name: 'NVIDIA L40S',
        architecture: 'Ada Lovelace',
        memoryGb: 48,
        bandwidthTb: 0.86,
        tdpWatts: 350,
        hourlyCost: 1.40,
      },
    ];

    const recommendations: GpuRecommendation[] = gpuSpecs.map((spec) => {
      // Calculate units needed (powers of 2 or tensor parallelism multiples: 1, 2, 4, 8)
      const rawUnits = Math.ceil(totalVramRequired / spec.memoryGb);
      let units = 1;
      if (rawUnits <= 1) units = 1;
      else if (rawUnits <= 2) units = 2;
      else if (rawUnits <= 4) units = 4;
      else if (rawUnits <= 8) units = 8;
      else units = Math.ceil(rawUnits / 8) * 8;

      const totalProvided = units * spec.memoryGb;
      const utilization = Math.min(100, Math.round((totalVramRequired / totalProvided) * 100));

      let rating: GpuRecommendation['efficiencyRating'] = 'Suportado';
      let note = 'Recomendado para nós corporativos.';

      if (spec.architecture === 'Blackwell' && precision === 'FP4') {
        rating = 'Ideal';
        note = 'Máxima eficiência com Tensor Cores FP4 nativos.';
      } else if (units === 1 && utilization >= 60 && utilization <= 90) {
        rating = 'Ideal';
        note = 'Ótimo aproveitamento de VRAM em nó único.';
      } else if (units >= 8) {
        rating = 'Alta';
        note = 'Requer cluster NVLink multi-nó.';
      }

      return {
        name: spec.name,
        architecture: spec.architecture,
        memoryGb: spec.memoryGb,
        bandwidthTb: spec.bandwidthTb,
        tdpWatts: spec.tdpWatts * units,
        unitsNeeded: units,
        totalVramProvided: totalProvided,
        vramUtilizationPct: utilization,
        estimatedHourlyCost: Number((spec.hourlyCost * units).toFixed(2)),
        efficiencyRating: rating,
        note,
      };
    });

    const vramSavingsPct = Math.round(((fp16Total - totalVramRequired) / fp16Total) * 100);

    return {
      weightsVram: Math.round(weightsVram),
      kvCacheVram: Math.round(kvCacheVram),
      runtimeOverhead: Math.round(runtimeOverhead),
      totalVramRequired,
      fp16Total,
      vramSavingsPct: Math.max(0, vramSavingsPct),
      recommendations,
    };
  }, [modelParamsBillions, precision, contextTokensK, batchConcurrency]);

  return (
    <section id="calculadora" className="py-16 md:py-24 border-b border-[#1A2117] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#1A2117] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#76B900] mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>NVIDIA Sizing Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Calculadora de Dimensionamento de GPUs
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Modele a pegada de VRAM (Pesos + Paged KV Cache + Runtime) e receba a topologia exata 
              de GPUs (B200, H200, H100, L40S) com consumo energético e custo horário estimado.
            </p>
          </div>

          <button
            onClick={onOpenCal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-black bg-[#76B900] hover:bg-[#86D200] rounded-lg transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Validar com Arquiteto NVIDIA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6 bg-[#101410] border border-[#1D2619] p-6 rounded-2xl shadow-xl">
            
            {/* Model Size Parameter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-semibold text-neutral-200">
                  TAMANHO DO MODELO (PARÂMETROS)
                </label>
                <span className="text-sm font-bold font-mono text-[#76B900] tabular-nums">
                  {modelParamsBillions}B Parâmetros
                </span>
              </div>

              {/* Model Presets */}
              <div className="grid grid-cols-6 gap-1.5 mb-3">
                {modelPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setModelParamsBillions(preset.value)}
                    className={`py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                      modelParamsBillions === preset.value
                        ? 'bg-[#76B900] text-black font-bold'
                        : 'bg-[#0B0D0B] text-neutral-400 hover:text-white border border-[#1A2217]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="7"
                max="405"
                step="1"
                value={modelParamsBillions}
                onChange={(e) => setModelParamsBillions(parseInt(e.target.value))}
                className="w-full accent-[#76B900] h-2 bg-[#0B0D0B] rounded-lg cursor-pointer"
              />
            </div>

            {/* Precision Quantization */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-semibold text-neutral-200">
                  PRECISÃO / QUANTIZAÇÃO
                </label>
                <span className="text-xs font-mono text-neutral-400">
                  {precision === 'FP4' ? '0.5 B/param (Blackwell)' :
                   precision === 'FP8' ? '1.0 B/param (Hopper/Blackwell)' :
                   precision === 'INT8' ? '1.0 B/param' : '2.0 B/param (Vanilla)'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {precisionOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrecision(p)}
                    className={`py-2 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
                      precision === p
                        ? 'bg-[#76B900] text-black shadow-md'
                        : 'bg-[#0B0D0B] text-neutral-300 hover:text-white border border-[#1A2217]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Context Window Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-semibold text-neutral-200">
                  JANELA DE CONTEXTO POR SESSÃO
                </label>
                <span className="text-sm font-bold font-mono text-white tabular-nums">
                  {contextTokensK}K Tokens
                </span>
              </div>

              <input
                type="range"
                min="4"
                max="128"
                step="4"
                value={contextTokensK}
                onChange={(e) => setContextTokensK(parseInt(e.target.value))}
                className="w-full accent-[#76B900] h-2 bg-[#0B0D0B] rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>4K</span>
                <span>32K</span>
                <span>64K</span>
                <span>128K</span>
              </div>
            </div>

            {/* Concurrency Batch */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-semibold text-neutral-200">
                  REQUISIÇÕES SIMULTÂNEAS (BATCH)
                </label>
                <span className="text-sm font-bold font-mono text-white tabular-nums">
                  {batchConcurrency} streams
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="64"
                step="1"
                value={batchConcurrency}
                onChange={(e) => setBatchConcurrency(parseInt(e.target.value))}
                className="w-full accent-[#76B900] h-2 bg-[#0B0D0B] rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>1 req</span>
                <span>16 reqs</span>
                <span>32 reqs</span>
                <span>64 reqs</span>
              </div>
            </div>

            {/* Micro Precision Savings Callout */}
            <div className="p-3.5 bg-[#0B0D0B] border border-[#1B2317] rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between text-neutral-200 font-mono">
                <span>Economia vs FP16:</span>
                <span className="text-[#76B900] font-bold tabular-nums">
                  -{calculation.vramSavingsPct}% VRAM
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                A quantização em {precision} reduz o tamanho do modelo de {calculation.fp16Total} GB para {calculation.totalVramRequired} GB totais.
              </p>
            </div>

          </div>

          {/* Sizing Results & Hardware Recommendations */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* VRAM Breakdown Card */}
            <div className="p-5 bg-[#101410] border border-[#1D2619] rounded-2xl">
              <h3 className="text-xs font-mono font-semibold text-neutral-400 mb-3">
                DETALHAMENTO DA DEMANDA DE MEMÓRIA (VRAM)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#0B0D0B] rounded-xl border border-[#182115]">
                  <span className="text-neutral-500 block text-[10px]">PESOS DO MODELO</span>
                  <span className="text-base font-bold text-white tabular-nums">{calculation.weightsVram} GB</span>
                </div>

                <div className="p-3 bg-[#0B0D0B] rounded-xl border border-[#182115]">
                  <span className="text-neutral-500 block text-[10px]">PAGED KV CACHE</span>
                  <span className="text-base font-bold text-white tabular-nums">{calculation.kvCacheVram} GB</span>
                </div>

                <div className="p-3 bg-[#0B0D0B] rounded-xl border border-[#182115]">
                  <span className="text-neutral-500 block text-[10px]">SCRATCHPAD & CUDA</span>
                  <span className="text-base font-bold text-white tabular-nums">{calculation.runtimeOverhead} GB</span>
                </div>

                <div className="p-3 bg-[#151D14] rounded-xl border border-[#76B900]/40">
                  <span className="text-[#76B900] block text-[10px] font-bold">TOTAL NECESSÁRIO</span>
                  <span className="text-base font-extrabold text-[#76B900] tabular-nums">
                    {calculation.totalVramRequired} GB
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Hardware Topologies */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-semibold text-neutral-400">
                TOPOLOGIAS DE HARDWARE COMPATÍVEIS
              </h3>

              <div className="space-y-3">
                {calculation.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`p-4 bg-[#101410] border rounded-xl transition-all ${
                      rec.efficiencyRating === 'Ideal'
                        ? 'border-[#76B900]/60 bg-[#121812] nvidia-glow-sm'
                        : 'border-[#1D2619] hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0B0D0B] border border-[#1E261A] flex items-center justify-center text-[#76B900]">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">
                              {rec.unitsNeeded}x {rec.name}
                            </h4>
                            {rec.efficiencyRating === 'Ideal' && (
                              <span className="text-[10px] font-mono font-bold text-[#76B900] bg-[#76B900]/15 px-2 py-0.5 rounded border border-[#76B900]/30">
                                Topologia Ideal
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">{rec.note}</p>
                        </div>
                      </div>

                      {/* Financial & Power Specs */}
                      <div className="flex items-center gap-4 text-xs font-mono sm:text-right">
                        <div>
                          <span className="text-neutral-500 block text-[10px]">POTÊNCIA ESTIMADA</span>
                          <span className="text-neutral-200 tabular-nums font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            {rec.tdpWatts} W
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-500 block text-[10px]">CUSTO ESTIMADO</span>
                          <span className="text-[#76B900] tabular-nums font-bold flex items-center gap-0.5">
                            <DollarSign className="w-3 h-3" />
                            {rec.estimatedHourlyCost}/h
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* VRAM Allocation Bar */}
                    <div className="mt-3 pt-2.5 border-t border-[#182016]">
                      <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                        <span>Ocupação de VRAM: {calculation.totalVramRequired} GB de {rec.totalVramProvided} GB</span>
                        <span className="tabular-nums font-semibold text-neutral-200">{rec.vramUtilizationPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0B0D0B] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            rec.vramUtilizationPct > 90 ? 'bg-amber-400' : 'bg-[#76B900]'
                          }`}
                          style={{ width: `${rec.vramUtilizationPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

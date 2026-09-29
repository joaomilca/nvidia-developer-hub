import React from 'react';
import { Gauge, Clock, Layers, TrendingDown } from 'lucide-react';

export const MetricsBanner: React.FC = () => {
  const metrics = [
    {
      value: '4.5x',
      label: 'Throughput com TensorRT-LLM',
      sublabel: 'comparado à inferência estática vanilla',
      icon: Gauge,
    },
    {
      value: '< 8ms',
      label: 'Time-To-First-Token (TTFT)',
      sublabel: 'em modelos Llama 3.3 70B com FP8/FP4',
      icon: Clock,
    },
    {
      value: '500+',
      label: 'Microserviços NIM Otimizados',
      sublabel: 'no catálogo de modelos NGC certificados',
      icon: Layers,
    },
    {
      value: '70%',
      label: 'Redução de TCO em FP4',
      sublabel: 'menor consumo energético e pegada de rack',
      icon: TrendingDown,
    },
  ];

  return (
    <section className="bg-[#0E110E] border-b border-[#1A2117] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div 
                key={idx}
                className="relative flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[#121612] border border-[#1F271B] hover:border-[#76B900]/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums group-hover:text-[#76B900] transition-colors">
                    {metric.value}
                  </span>
                  <div className="p-1.5 rounded-lg bg-[#76B900]/10 text-[#76B900]">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-200 leading-snug">
                    {metric.label}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
                    {metric.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

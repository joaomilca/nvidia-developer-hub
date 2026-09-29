import React, { useState, useEffect, useRef } from 'react';
import { NimModel } from '../types';
import { NIM_MODELS, SYSTEM_PROMPT_PRESETS } from '../data/modelsData';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  Zap, 
  Activity, 
  Code2, 
  Sliders, 
  Square 
} from 'lucide-react';

interface PlaygroundProps {
  selectedModel: NimModel;
  onModelChange: (model: NimModel) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({ selectedModel, onModelChange }) => {
  const [systemPrompt, setSystemPrompt] = useState(selectedModel.defaultSystemPrompt);
  const [userPrompt, setUserPrompt] = useState(selectedModel.defaultPrompt);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [topP, setTopP] = useState(0.9);

  const [outputTokens, setOutputTokens] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'curl' | 'python' | 'node'>('output');
  const [hasCopied, setHasCopied] = useState(false);

  // Live Metrics
  const [liveTtft, setLiveTtft] = useState<number | null>(null);
  const [liveSpeed, setLiveSpeed] = useState<number | null>(null);
  const [totalTokensGenerated, setTotalTokensGenerated] = useState<number>(0);
  const [allocatedVram, setAllocatedVram] = useState<number>(selectedModel.vramFp8Gb);

  const abortControllerRef = useRef<boolean>(false);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  // Sync state when model prop changes
  useEffect(() => {
    setSystemPrompt(selectedModel.defaultSystemPrompt);
    setUserPrompt(selectedModel.defaultPrompt);
    setOutputTokens('');
    setLiveTtft(null);
    setLiveSpeed(null);
    setTotalTokensGenerated(0);
    setAllocatedVram(selectedModel.vramFp8Gb);
  }, [selectedModel]);

  // Handle Preset selection
  const handleApplyPreset = (presetId: string) => {
    const found = SYSTEM_PROMPT_PRESETS.find(p => p.id === presetId);
    if (found) {
      setSystemPrompt(found.prompt);
    }
  };

  // Run simulation or live generation
  const handleRunInference = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    setOutputTokens('');
    abortControllerRef.current = false;

    // Simulate realistic TTFT based on model characteristics
    const simulatedTtft = Number((selectedModel.ttftMs * (0.85 + Math.random() * 0.3)).toFixed(1));
    await new Promise((res) => setTimeout(res, simulatedTtft * 4)); // quick UI delay
    setLiveTtft(simulatedTtft);

    // Source text to stream: use sampleResponse if default prompt, or synthesize realistic technical response for custom prompts
    let fullText = selectedModel.sampleResponse;
    const isCustomPrompt = userPrompt.trim() !== selectedModel.defaultPrompt.trim();
    
    if (isCustomPrompt) {
      fullText = `[NVIDIA NIM Execution Report · ${selectedModel.name}]
Processando prompt com otimizações TensorRT-LLM (Kernel FP8/FP4 ativado, KV Cache paginado).

Análise Técnica para: "${userPrompt.slice(0, 120)}${userPrompt.length > 120 ? '...' : ''}"

1. **Topologia de Execução:**
   - Modelo compilado em ${selectedModel.parameters} parâmetros com motor de decodificação de alta densidade.
   - Paged KV Cache alocado com overhead mínimo em VRAM (~${selectedModel.vramFp8Gb} GB FP8).
   - In-Flight Batching ativo com agendamento contínuo de tokens na porta 8000 (OpenAI API compatível).

2. **Recomendações de Otimização:**
   - Para ambientes em escala comercial, utilize o NVIDIA GPU Operator no Kubernetes com nós interconectados por NVLink.
   - Aplique compilação estática de engines no TensorRT-LLM para eliminar compilação JIT no momento da submissão da carga de trabalho.

3. **Métricas de Benchmark Aferidas:**
   - TTFT médio: ~${simulatedTtft} ms
   - Taxa de decodificação sustentada: ~${selectedModel.tokensPerSec} tokens/s por GPU.`;
    }

    const words = fullText.split(' ');
    let currentOutput = '';
    let tokensCount = 0;

    const startTime = performance.now();

    for (let i = 0; i < words.length; i++) {
      if (abortControllerRef.current) break;

      currentOutput += (i === 0 ? '' : ' ') + words[i];
      tokensCount += Math.max(1, Math.round(words[i].length / 4));
      setOutputTokens(currentOutput);
      setTotalTokensGenerated(tokensCount);

      // Calculate instantaneous tok/s
      const elapsedSec = (performance.now() - startTime) / 1000;
      if (elapsedSec > 0.05) {
        const speed = Math.round(tokensCount / elapsedSec);
        setLiveSpeed(Math.min(speed, selectedModel.tokensPerSec + Math.round(Math.random() * 20)));
      }

      // Dynamic typewriter delay
      const delay = Math.max(8, Math.round(1000 / selectedModel.tokensPerSec));
      await new Promise((res) => setTimeout(res, delay));

      if (outputContainerRef.current) {
        outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
      }
    }

    setIsGenerating(false);
  };

  const handleStop = () => {
    abortControllerRef.current = true;
    setIsGenerating(false);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Snippets
  const curlCode = `curl -X POST "https://integrate.api.nvidia.com/v1/chat/completions" \\
  -H "Authorization: Bearer $NVIDIA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedModel.id}",
    "messages": [
      {"role": "system", "content": ${JSON.stringify(systemPrompt)}},
      {"role": "user", "content": ${JSON.stringify(userPrompt)}}
    ],
    "temperature": ${temperature},
    "top_p": ${topP},
    "max_tokens": ${maxTokens},
    "stream": true
  }'`;

  const pythonCode = `from openai import OpenAI

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="nvapi-YOUR_NVIDIA_API_KEY"
)

completion = client.chat.completions.create(
    model="${selectedModel.id}",
    messages=[
        {"role": "system", "content": ${JSON.stringify(systemPrompt)}},
        {"role": "user", "content": ${JSON.stringify(userPrompt)}}
    ],
    temperature=${temperature},
    top_p=${topP},
    max_tokens=${maxTokens},
    stream=True
)

for chunk in completion:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
`;

  const nodeCode = `import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

async function main() {
  const stream = await openai.chat.completions.create({
    model: "${selectedModel.id}",
    messages: [
      { role: "system", content: ${JSON.stringify(systemPrompt)} },
      { role: "user", content: ${JSON.stringify(userPrompt)} }
    ],
    temperature: ${temperature},
    top_p: ${topP},
    max_tokens: ${maxTokens},
    stream: true,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

main();`;

  return (
    <section id="playground" className="py-16 md:py-24 border-b border-[#1A2117] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#1A2117] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#76B900] mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>NVIDIA NIM Interactive Runtime</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Playground de Inferência em Tempo Real
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Teste prompts de sistema e parâmetros de inferência sob runtime simulado com benchmarks 
              precisos de latência TTFT, throughput (tokens/segundo) e consumo de VRAM.
            </p>
          </div>

          {/* Model Selector in Playground */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">Modelo Ativo:</span>
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const found = NIM_MODELS.find(m => m.id === e.target.value);
                if (found) onModelChange(found);
              }}
              className="bg-[#121612] border border-[#24301E] text-xs font-medium text-white rounded-lg px-3 py-2 outline-none focus:border-[#76B900] transition-colors"
            >
              {NIM_MODELS.map(m => (
                <option key={m.id} value={m.id} className="bg-[#0B0D0B] text-white">
                  {m.name} ({m.parameters})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Hardware Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#0D100D] border border-[#1C2518] rounded-xl mb-6 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#76B900]/10 text-[#76B900]">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">TTFT EM TEMPO REAL</span>
              <span className="font-bold text-white tabular-nums">
                {liveTtft !== null ? `${liveTtft} ms` : `~${selectedModel.ttftMs} ms`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#76B900]/10 text-[#76B900]">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">THROUGHPUT</span>
              <span className="font-bold text-[#76B900] tabular-nums">
                {liveSpeed !== null ? `${liveSpeed} tok/s` : `~${selectedModel.tokensPerSec} tok/s`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#76B900]/10 text-[#76B900]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">VRAM ALOCADA</span>
              <span className="font-bold text-white tabular-nums">{allocatedVram} GB (FP8)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#76B900]/10 text-[#76B900]">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">TOKENS GERADOS</span>
              <span className="font-bold text-neutral-200 tabular-nums">{totalTokensGenerated} tokens</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Playground Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Prompts & Parameters */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* System Prompt Editor with Presets */}
            <div className="p-4 bg-[#101410] border border-[#1D2619] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold text-neutral-300">
                  SYSTEM PROMPT
                </label>
                
                {/* Presets dropdown */}
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <span>Presets:</span>
                  <select
                    onChange={(e) => handleApplyPreset(e.target.value)}
                    className="bg-[#0B0D0B] border border-[#1C2518] text-[11px] text-neutral-200 rounded px-1.5 py-0.5 outline-none focus:border-[#76B900]"
                  >
                    {SYSTEM_PROMPT_PRESETS.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                className="w-full bg-[#0B0D0B] border border-[#1C2518] focus:border-[#76B900] rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none font-sans leading-relaxed resize-none"
                placeholder="Insira as diretrizes de sistema para guiar a persona do modelo..."
              />
            </div>

            {/* User Prompt Input */}
            <div className="p-4 bg-[#101410] border border-[#1D2619] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold text-neutral-300">
                  USER PROMPT
                </label>
                <button
                  onClick={() => setUserPrompt(selectedModel.defaultPrompt)}
                  className="text-[11px] font-mono text-[#76B900] hover:underline"
                >
                  Restaurar padrão
                </button>
              </div>

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={4}
                className="w-full bg-[#0B0D0B] border border-[#1C2518] focus:border-[#76B900] rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none font-sans leading-relaxed resize-none"
                placeholder="Escreva sua consulta para o microserviço NIM..."
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                {isGenerating ? (
                  <button
                    onClick={handleStop}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Interromper</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRunInference}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-black bg-[#76B900] hover:bg-[#86D200] active:scale-[0.98] rounded-lg transition-all shadow-md shadow-[#76B900]/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Executar Inferência NIM</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setOutputTokens('');
                    setLiveTtft(null);
                    setLiveSpeed(null);
                    setTotalTokensGenerated(0);
                  }}
                  className="p-2.5 text-neutral-400 hover:text-white bg-[#0B0D0B] border border-[#1C2518] hover:border-neutral-700 rounded-lg transition-colors cursor-pointer"
                  title="Limpar Saída"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inference Sliders Controls */}
            <div className="p-4 bg-[#101410] border border-[#1D2619] rounded-xl space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 font-semibold">
                <Sliders className="w-3.5 h-3.5 text-[#76B900]" />
                <span>HIPERPARÂMETROS DE RUNTIME</span>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">Temperature</span>
                  <span className="text-neutral-200 tabular-nums">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#76B900] h-1.5 bg-[#0B0D0B] rounded-lg cursor-pointer"
                />
              </div>

              {/* Max Tokens Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">Max Tokens</span>
                  <span className="text-neutral-200 tabular-nums">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="128"
                  max="4096"
                  step="128"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-[#76B900] h-1.5 bg-[#0B0D0B] rounded-lg cursor-pointer"
                />
              </div>

              {/* Top-P Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">Top-P</span>
                  <span className="text-neutral-200 tabular-nums">{topP.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-[#76B900] h-1.5 bg-[#0B0D0B] rounded-lg cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Output & Code Snippets Tabs */}
          <div className="lg:col-span-7 flex flex-col h-[560px] bg-[#101410] border border-[#1D2619] rounded-xl overflow-hidden shadow-xl">
            
            {/* Tab Navigation Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0E110E] border-b border-[#1A2217]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('output')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'output'
                      ? 'bg-[#182016] text-[#76B900] font-semibold border border-[#232F1D]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Resposta (Stream)
                </button>
                <button
                  onClick={() => setActiveTab('curl')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'curl'
                      ? 'bg-[#182016] text-[#76B900] font-semibold border border-[#232F1D]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveTab('python')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'python'
                      ? 'bg-[#182016] text-[#76B900] font-semibold border border-[#232F1D]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Python (OpenAI)
                </button>
                <button
                  onClick={() => setActiveTab('node')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'node'
                      ? 'bg-[#182016] text-[#76B900] font-semibold border border-[#232F1D]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Node.js
                </button>
              </div>

              {/* Copy snippet button */}
              {activeTab !== 'output' && (
                <button
                  onClick={() => {
                    const text = 
                      activeTab === 'curl' ? curlCode :
                      activeTab === 'python' ? pythonCode : nodeCode;
                    handleCopyCode(text);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-neutral-300 hover:text-white bg-[#141A14] hover:bg-[#1A221A] border border-[#212C1B] rounded-md transition-colors cursor-pointer"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#76B900]" />
                      <span className="text-[#76B900]">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-4 bg-[#0A0C0A] overflow-y-auto font-mono text-xs text-neutral-200">
              {activeTab === 'output' && (
                <div 
                  ref={outputContainerRef}
                  className="h-full flex flex-col justify-between"
                >
                  {outputTokens ? (
                    <div className="whitespace-pre-wrap leading-relaxed space-y-2 text-neutral-200">
                      {outputTokens}
                      {isGenerating && (
                        <span className="inline-block w-2 h-4 bg-[#76B900] ml-1 animate-pulse align-middle" />
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-500">
                      <Terminal className="w-10 h-10 mb-3 text-neutral-700" />
                      <p className="font-sans text-sm text-neutral-400 mb-1">
                        Pronto para executar inferência
                      </p>
                      <p className="text-xs text-neutral-600 max-w-sm">
                        Clique no botão &quot;Executar Inferência NIM&quot; para iniciar o fluxo com métricas de tempo real.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'curl' && (
                <pre className="text-neutral-300 leading-relaxed overflow-x-auto p-1 font-mono">
                  {curlCode}
                </pre>
              )}

              {activeTab === 'python' && (
                <pre className="text-neutral-300 leading-relaxed overflow-x-auto p-1 font-mono">
                  {pythonCode}
                </pre>
              )}

              {activeTab === 'node' && (
                <pre className="text-neutral-300 leading-relaxed overflow-x-auto p-1 font-mono">
                  {nodeCode}
                </pre>
              )}
            </div>

            {/* Bottom Status Ticker */}
            <div className="px-4 py-2 bg-[#0E110E] border-t border-[#1A2217] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-amber-400 animate-ping' : 'bg-[#76B900]'}`} />
                <span>{isGenerating ? 'Decodificando tokens...' : 'Pronto para novas requisições'}</span>
              </div>
              <span className="text-neutral-500">TensorRT-LLM v0.14</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

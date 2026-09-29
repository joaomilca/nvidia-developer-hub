import { NimModel } from '../types';

export const NIM_MODELS: NimModel[] = [
  {
    id: 'llama-3.3-70b-instruct',
    name: 'Meta Llama 3.3 70B Instruct',
    publisher: 'Meta / NVIDIA TensorRT-LLM',
    category: 'llms',
    description: 'Modelo de linguagem de ponta otimizado com TensorRT-LLM com suporte a FP8 e FP4, entregando raciocínio analítico e codificação veloz.',
    parameters: '70B',
    contextWindow: '128K',
    ttftMs: 6.8,
    tokensPerSec: 138,
    vramFp8Gb: 42,
    recommendedHardware: '1x H100 80GB ou 1x H200',
    tags: ['Raciocínio', 'Agentes', 'Código', 'FP8 Otimizado'],
    defaultSystemPrompt: 'Você é um arquiteto especialista em soluções de IA da NVIDIA, fornecendo orientações técnicas de alta precisão com benchmarks de engenharia.',
    defaultPrompt: 'Como estruturar uma pipeline de inferência de ultra-baixa latência com Llama 3.3 utilizando TensorRT-LLM e In-Flight Batching?',
    sampleResponse: `Para atingir o pico de throughput e latência sub-10ms TTFT com o Llama 3.3 70B em contêineres NVIDIA NIM:

1. **Quantização FP8 com TensorRT-LLM:**
   Execute compilação estática com FP8 KV Cache para reduzir a pressão de memória em 50%, permitindo atender lotes simultâneos maiores sem estourar o limite HBM.

2. **In-Flight Batching (Continuous Batching):**
   Substitua o batching estático pelo agendamento em nível de iteração. As requisições que finalizam liberam KV cache imediatamente para novos tokens da fila.

3. **Paged KV Cache:**
   Alocação de blocos virtuais de 64 tokens, eliminando fragmentação interna e elevando a utilização de VRAM para ~96%.

Com 1x NVIDIA H200 (141GB HBM3e) e FP8, o throughput atinge mais de 2.400 tokens/segundo em lote agregado com TTFT médio de 6.8ms.`
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'DeepSeek-R1 Distill Llama 70B',
    publisher: 'DeepSeek / NVIDIA NIM',
    category: 'llms',
    description: 'Modelo destilado com capacidades ultra-avançadas de raciocínio lógico, resolução matemática e geração de Cadeia de Pensamento (Chain-of-Thought).',
    parameters: '70B',
    contextWindow: '128K',
    ttftMs: 7.2,
    tokensPerSec: 124,
    vramFp8Gb: 44,
    recommendedHardware: '1x H100 80GB ou 1x B200',
    tags: ['Raciocínio Lógico', 'Matemática', 'Cadeia de Pensamento', 'STEM'],
    defaultSystemPrompt: 'Você é uma engine de raciocínio de alta precisão técnica. Divida problemas complexos passo a passo com rigor lógico.',
    defaultPrompt: 'Explique a dedução matemática da redução de complexidade de memória com Paged Attention em clusters multi-GPU interconectados por NVLink.',
    sampleResponse: `<think>
Analisando a estrutura do KV Cache padrão vs Paged Attention:
- Em alocações contíguas: O buffer máximo reservado por requisição é R = 2 * L * H * D * max_seq_len.
- Se o comprimento real médio for L_med << max_seq_len, o desperdício por fragmentação atinge (1 - L_med/max_seq_len) ~ 60-80%.
- Com Paged Attention, a memória é dividida em blocos de tamanho B (tipicamente 16 ou 32 tokens). O desperdício é estritamente limitado ao último bloco parcial (< B/2).
</think>

A dedução formal demonstra que o Paged Attention reduz a sobrecarga de fragmentação de O(N * max_context) para O(N * block_size / 2). 

Em clusters NVIDIA com NVLink de 1.8 TB/s, as transferências entre nós de Tensor Parallelism não sofrem gargalo de barramento, viabilizando lotes de concorrência 4x maiores sob a mesma pegada de HBM.`
  },
  {
    id: 'nemotron-4-340b-instruct',
    name: 'NVIDIA Nemotron-4 340B Instruct',
    publisher: 'NVIDIA Research',
    category: 'llms',
    description: 'Supermodelo fundacional da NVIDIA desenvolvido para geração massiva de dados sintéticos de alta qualidade e alinhamento de LLMs corporativos.',
    parameters: '340B',
    contextWindow: '4K / 32K',
    ttftMs: 14.8,
    tokensPerSec: 88,
    vramFp8Gb: 195,
    recommendedHardware: '2x B200 192GB ou 4x H100 80GB',
    tags: ['NVIDIA Flagship', 'Dados Sintéticos', 'Enterprise Align', 'FP4 Ready'],
    defaultSystemPrompt: 'Você é o Nemotron-4 340B, o modelo fundacional de referência da NVIDIA para governança e geração de conhecimento empresarial.',
    defaultPrompt: 'Quais as melhores práticas para orquestrar pipelines de dados sintéticos para fine-tuning de modelos médicos com NeMo Megatron?',
    sampleResponse: `Diretrizes de Arquitetura de Dados Sintéticos com NVIDIA NeMo:

1. **Filtragem Heurística e Perplexidade:**
   Gere variações ontológicas controladas com Nemotron-4 e aplique o classificador Nemotron-4-340B-Reward para descarte de alucinações e verificação factual.

2. **Deduplicação Semântica com GPU:**
   Utilize o cuVS (RAPIDS) para computar embeddings vetoriais com k-NN acelerado por CUDA em bilhões de pares de instruções.

3. **Orquestração de Treinamento:**
   Exporte os batches verificados diretamente para o NVIDIA NeMo Framework com paralelismo 3D (Tensor, Pipeline e Sequence Parallelism) com suporte a checkpoints otimizados para NVLink.`
  },
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2 (2407)',
    publisher: 'Mistral AI / NVIDIA NIM',
    category: 'llms',
    description: 'Capacidade de raciocínio de nível internacional, fluência multilíngue nativa em dezenas de idiomas e suporte aprofundado a chamadas de funções.',
    parameters: '123B',
    contextWindow: '128K',
    ttftMs: 9.4,
    tokensPerSec: 110,
    vramFp8Gb: 74,
    recommendedHardware: '1x H200 141GB ou 2x H100',
    tags: ['Multilíngue', 'Function Calling', 'Código', '128K Context'],
    defaultSystemPrompt: 'Você é um assistente técnico multilíngue de elite especializado em integração corporativa e engenharia de software.',
    defaultPrompt: 'Gere uma especificação de chamada de função (Function Calling) no formato OpenAI Tools para consultar métricas de GPU do NVIDIA DCGM.',
    sampleResponse: `{
  "type": "function",
  "function": {
    "name": "query_nvml_dcgm_metrics",
    "description": "Obtém telemetria em tempo real de hardware NVIDIA (temperatura, utilização de VRAM, SM occupancy, potência W)",
    "parameters": {
      "type": "object",
      "properties": {
        "gpu_indices": {
          "type": "array",
          "items": { "type": "integer" },
          "description": "Lista de índices das GPUs a consultar (ex: [0, 1, 2, 3])"
        },
        "metrics": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["gpu_util", "mem_used_bytes", "pcie_rx_bandwidth", "nvlink_tx_bytes", "temperature_c", "power_draw_w"]
          }
        },
        "sampling_interval_ms": { "type": "integer", "default": 100 }
      },
      "required": ["gpu_indices", "metrics"]
    }
  }
}`
  },
  {
    id: 'kosmos-2-vision',
    name: 'Microsoft Kosmos-2 Vision-Language',
    publisher: 'Microsoft / NVIDIA NIM Multimodal',
    category: 'vision',
    description: 'Modelo de visão-linguagem com capacidade única de Grounding e detecção de coordenadas espaciais em imagens de alta resolução.',
    parameters: '1.6B',
    contextWindow: '4K',
    ttftMs: 4.1,
    tokensPerSec: 215,
    vramFp8Gb: 6,
    recommendedHardware: '1x L40S 48GB ou 1x RTX 6000 Ada',
    tags: ['Visão Computacional', 'Spatial Grounding', 'Detecção', 'Edge Ready'],
    defaultSystemPrompt: 'Você é um modelo de análise visual com grounded captioning. Forneça identificação precisa de objetos com caixas delimitadoras espaciais.',
    defaultPrompt: 'Analise uma imagem de placa-mãe de servidor NVIDIA DGX e localize os soquetes de conectores de energia e os dissipadores térmicos de GPU.',
    sampleResponse: `Resultado de Grounding Visual (Kosmos-2 NIM):

- <grounding><phrase>Dissipadores térmicos de GPU H100</phrase><box>[120, 45, 620, 890]</box></grounding>: 8 unidades em disposição paralela de alto fluxo de ar.
- <grounding><phrase>Barramento NVLink Switch NVSwitch</phrase><box>[640, 210, 810, 750]</box></grounding>: 4 ASICs centrais de interconexão direta.
- <grounding><phrase>Conectores de alimentação de barramento DC 54V</phrase><box>[890, 10, 980, 990]</box></grounding>: Barramento redundante para suporte a picos de até 10.2 kW por chassi.`
  },
  {
    id: 'nv-embed-v2',
    name: 'NVIDIA NV-Embed-v2',
    publisher: 'NVIDIA Research',
    category: 'rag',
    description: 'Líder absoluto no benchmark MTEB de recuperação e representação vetorial semântica para arquiteturas de RAG corporativo de grande escala.',
    parameters: '7.1B',
    contextWindow: '32K',
    ttftMs: 3.2,
    tokensPerSec: 320,
    vramFp8Gb: 8,
    recommendedHardware: '1x L40S ou 1x A100',
    tags: ['RAG', 'MTEB Leader', 'Embeddings', '32K Context'],
    defaultSystemPrompt: 'Você é o motor de embedding semântico NV-Embed-v2. Retorne análise dimensional e densidade de representação vetorial.',
    defaultPrompt: 'Como o NV-Embed-v2 gerencia consultas heterogêneas em RAG utilizando instrução contextual bidirecional?',
    sampleResponse: `Arquitetura do NVIDIA NV-Embed-v2:

- **Dimensão Vetorial:** 4096 floats normalizados (suporte a quantização Matryoshka para 1024/512 dims com < 1% de degradação).
- **Atenção Bidirecional com Rotary Position Embeddings (RoPE):** Permite apreensão global de documentos de até 32.768 tokens sem truncamento destrutivo.
- **Instruções Prefixadas:** Separação entre consulta de usuário (ex: 'Instruct: Dado um incidente técnico...') e corpus indexado, elevando o nDCG@10 em mais de 4.8 pontos percentuais frente ao dense retrieval convencional.`
  },
  {
    id: 'whisper-v3-large',
    name: 'OpenAI Whisper-v3 Large',
    publisher: 'OpenAI / NVIDIA TensorRT-LLM Audio',
    category: 'voice',
    description: 'Transcrição e tradução de áudio multimodal em dezenas de línguas, acelerada em até 8x no NIM através de pipelines CUDA de decode paralelo.',
    parameters: '1.5B',
    contextWindow: 'Audio 30s Chunks',
    ttftMs: 2.8,
    tokensPerSec: 410,
    vramFp8Gb: 5,
    recommendedHardware: '1x L4 ou 1x L40S',
    tags: ['Áudio & Voz', 'Transcrição', 'Tradução', 'Ultra Rápido'],
    defaultSystemPrompt: 'Você é a pipeline acelerada de áudio Whisper-v3 no NVIDIA NIM. Retorne transcrições com timestamps precisos.',
    defaultPrompt: 'Demonstre a saída estruturada com diarização e timestamps em milissegundos para áudio técnico de teleconferência de engenharia.',
    sampleResponse: `{
  "task": "transcribe",
  "language": "portuguese",
  "duration": 14.85,
  "segments": [
    {
      "id": 0,
      "start": 0.00,
      "end": 4.12,
      "text": "Iniciando a migração dos microserviços NIM para o cluster Blackwell B200 em produção.",
      "avg_logprob": -0.12,
      "compression_ratio": 1.2
    },
    {
      "id": 1,
      "start": 4.30,
      "end": 9.45,
      "text": "Validamos que a latência TTFT caiu de 22 milissegundos para 5.8 milissegundos com precisão FP4 nativa.",
      "avg_logprob": -0.08
    }
  ]
}`
  },
  {
    id: 'bionemo-esm-2',
    name: 'BioNeMo ESM-2 3B',
    publisher: 'Meta / NVIDIA BioNeMo',
    category: 'biomedical',
    description: 'Modelo fundacional biológico para predição de estrutura secundária e terciária de proteínas, mutagênese in silico e descoberta farmacológica acelerada.',
    parameters: '3B',
    contextWindow: 'Sequence 2048',
    ttftMs: 5.4,
    tokensPerSec: 180,
    vramFp8Gb: 12,
    recommendedHardware: '1x H100 ou 1x L40S',
    tags: ['Biomedicina', 'Proteínas', 'BioNeMo', 'Genômica'],
    defaultSystemPrompt: 'Você é o modelo biológico BioNeMo ESM-2 da NVIDIA. Analise sequências de aminoácidos e propriedades estruturais.',
    defaultPrompt: 'Forneça a análise de propensão de contato residual para o fragmento polipeptídico sintético MKTIIALSYIFCLVFA.',
    sampleResponse: `Análise Estrutural BioNeMo ESM-2:

- **Sequência:** MKTIIALSYIFCLVFA (16 resíduos de cadeia alifática/aromática hidrofóbica).
- **Predição de Estrutura Secundária:**
  - Resíduos 3-12 (TIIALSYIFC): Predominância de conformação em alfa-hélice transmembranar (pLDDT: 92.4).
  - Resíduos 13-16 (LVFA): Região hidrofóbica terminal com forte propensão a ancoragem lipídica.
- **Aceleração BioNeMo:** Processamento em 4.2ms por sequência em 1x GPU NVIDIA H100 via TensorRT, permitindo triagem de bibliotecas com 100 milhões de compostos em menos de 24 horas.`
  }
];

export const SYSTEM_PROMPT_PRESETS = [
  {
    id: 'cuda_architect',
    label: 'Arquiteto de Soluções NVIDIA',
    prompt: 'Você é um arquiteto sênior de soluções de IA da NVIDIA. Forneça respostas técnicas, com foco em infraestrutura de alto desempenho, GPUs Blackwell/Hopper, microserviços NIM e otimização CUDA/TensorRT-LLM.'
  },
  {
    id: 'fp4_engineer',
    label: 'Engenheiro de Quantização & FP4',
    prompt: 'Você é um engenheiro de compiladores da NVIDIA especializado no Transformer Engine de 2ª geração, micro-precisão FP4/FP8 e escalonamento numérico sem perda de acurácia.'
  },
  {
    id: 'rag_specialist',
    label: 'Especialista em RAG Corporativo',
    prompt: 'Você é um arquiteto corporativo focado em recuperação aumentada por geração (RAG) em larga escala com NeMo Retriever, bancos vetoriais Milvus/Pinecone e NV-Embed-v2.'
  }
];

export const FAQS_DATA = [
  {
    question: 'O que é exatamente o NVIDIA NIM e como ele se diferencia de contêineres Docker comuns?',
    answer: 'NVIDIA NIM (NVIDIA Inference Microservice) é um conjunto de microserviços conteinerizados pré-construídos que aceleram a implantação de modelos de fundação de IA. Diferente de um contêiner Docker genérico com vLLM ou HuggingFace, o NIM inclui uma pilha completa otimizada pela NVIDIA: drivers CUDA certificados, runtime TensorRT-LLM compilado para a arquitetura exata da GPU detectada (Blackwell, Hopper, Ada), In-Flight Batching, Paged KV Cache e suporte a endpoints padronizados com compatibilidade total à API da OpenAI.'
  },
  {
    question: 'Como executar contêineres NIM localmente vs. em nuvem (DGX Cloud, AWS, Azure, OCI, GCP)?',
    answer: 'Os microserviços NIM oferecem paridade absoluta de código. Em ambiente local ou on-premises, basta executar via Docker/Podman ou Helm chart no Kubernetes usando o NVIDIA Container Toolkit (ex: `docker run -d --gpus all -p 8000:8000 nvcr.io/nim/meta/llama-3.3-70b-instruct`). Nas principais nuvens públicas e no NVIDIA DGX Cloud, o mesmo contêiner é provisionado como um serviço gerenciado ou integrado em clusters EKS, AKS e GKE com auto-scaling por demanda.'
  },
  {
    question: 'Quais são os ganhos reais de precisão e throughput com quantização FP4 na arquitetura Blackwell?',
    answer: 'A arquitetura NVIDIA Blackwell introduziu o Transformer Engine de 2ª geração com micro-precisão FP4. Enquanto o FP16 requer 2 bytes e o FP8 requer 1 byte por peso, o FP4 consome apenas 0,5 byte (4 bits). Isso dobra o throughput computacional dos Tensor Cores para até 20 PFLOPS por GPU B200 e reduz a ocupação de VRAM em 75% em relação ao FP16. Graças aos algoritmos dinâmicos de escala em blocos de 16 números, a degradação de perplexidade e acurácia é imperceptível (< 0,2% em benchmarks MMLU/HumanEval).'
  },
  {
    question: 'Como funciona o licenciamento do NVIDIA AI Enterprise para produção?',
    answer: 'Para prototipagem e desenvolvimento local, desenvolvedores registrados no NVIDIA Developer Program podem testar microserviços NIM gratuitamente por meio de créditos na API NVIDIA API Catalog e contêineres para avaliação. Para implantações corporativas em produção e suporte 24/7 com SLAs garantidos, o NIM faz parte da suíte de software NVIDIA AI Enterprise, licenciada por GPU ativa (anual ou por hora de computação em nuvem compartilhada).'
  },
  {
    question: 'Os microserviços NIM são compatíveis com a especificação de API da OpenAI?',
    answer: 'Sim, 100% compatíveis. Todos os microserviços NIM de LLM expõem as rotas padrão `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings` e `/v1/models`. Você pode utilizar as bibliotecas oficiais do OpenAI em Python ou Node.js trocando apenas a `base_url` para o seu endpoint NIM (ex: `http://localhost:8000/v1` ou `https://integrate.api.nvidia.com/v1`) e autenticando com sua chave de API.'
  }
];

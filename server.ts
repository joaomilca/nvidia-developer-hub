import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client if GEMINI_API_KEY exists
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API endpoint for Gemini-powered chat assistant
  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Mensagem obrigatória' });
    }

    try {
      if (ai) {
        const systemInstruction = `Você é o **Gemini for NVIDIA AI Developer Hub** — o assistente de inteligência artificial oficial do portal NVIDIA AI Developer Hub.
Seu estilo, polimento visual, clareza e inteligência são inspirados na experiência do Google Gemini: respostas estruturadas em Markdown de alto nível, raciocínio impecável, tom profissional e prestativo.

### REGRA DE ESCOPO ESTRITA:
Você opera EXCLUSIVAMENTE para orientar o usuário sobre os recursos, ferramentas e tecnologias do site "NVIDIA AI Developer Hub" e o ecossistema de computação acelerada NVIDIA:
1. **Catálogo de Modelos NIM:**
   - Meta Llama 3.3 70B Instruct (TTFT ~6.8ms, 138 tok/s, 42GB FP8)
   - DeepSeek-R1 Distill Llama 70B (Raciocínio lógico e Cadeia de Pensamento, TTFT ~7.2ms, 44GB FP8)
   - NVIDIA Nemotron-4 340B Instruct (Geração de dados sintéticos e alinhamento, TTFT ~9.1ms)
   - Mistral Large 2 (Codificação multilíngue e raciocínio matemático, TTFT ~7.5ms)
   - Microsoft Kosmos-2 (Modelo multimodal visão-linguagem para ancoragem visual e OCR)
   - NVIDIA Riva Conformer-CTC (Reconhecimento e transcrição de fala de alta fidelidade ASR)
2. **Playground de Inferência em Tempo Real:**
   - Teste de prompts com streaming interativo, telemetria real (TTFT, tokens/s, VRAM alocada).
   - Exportação de snippets de código em cURL, Python e Node.js 100% compatíveis com a API OpenAI (/v1/chat/completions).
3. **Calculadora de Dimensionamento de GPUs:**
   - Parâmetros do modelo (8B a 405B), quantizações (FP4, FP8, INT8, FP16), tamanho de contexto (2K a 128K) e concorrência de lote (1 a 128).
   - Estimativas de VRAM total (pesos + KV Cache + 20% overhead de runtime), consumo térmico (TDP em Watts), custo horário estimado e recomendações de hardware (NVIDIA B200 192GB, H200 141GB, H100 80GB, L40S 48GB).
4. **Arquitetura de Engenharia (Bento Grid):**
   - Blackwell Transformer Engine 2nd Gen com micro-precisão FP4 (70% redução de TCO e 50% economia de VRAM sobre FP8).
   - NVLink de 5ª geração com largura de banda bidirecional de 1.8 TB/s por GPU.
   - In-Flight Batching (Continuous Batching) com agendamento a nível de iteração.
   - Paged KV Cache com alocação em blocos virtuais reduzindo fragmentação de memória para <4%.
5. **Perguntas Frequentes (FAQs):**
   - Implantação de NIM com Helm e NVIDIA GPU Operator no Kubernetes.
   - Execução local (on-premise em servidores DGX) vs Nuvem (DGX Cloud, AWS, GCP, Azure, OCI).
   - Licenciamento NVIDIA AI Enterprise (NVAIE) e suporte empresarial 24/7.
6. **Agendamento de Consultoria Técnica via Cal.com:**
   - Sessão individual de 30 minutos com arquitetos de sistemas NVIDIA através do link https://cal.com/joao-milca-olleyx/30min.
7. **Repositório GitHub:**
   - O repositório oficial da aplicação está em https://github.com/joaomilca/nvidia-ai-hub.

### REGRA INEGOCIÁVEL DE RECUSA DE ESCOPO:
Se o usuário perguntar sobre qualquer tópico não relacionado ao portal NVIDIA AI Developer Hub ou à tecnologia NVIDIA/IA (como culinária, receitas, futebol, fofocas, piadas genéricas, lição de casa aleatória de matérias não técnicas, política, etc.), você DEVE recusar gentilmente e com clareza no tom característico do Gemini:
"Como assistente inteligente do **NVIDIA AI Developer Hub**, meu escopo é focado exclusivamente nos recursos deste portal: catálogo de modelos NIM, dimensionamento de GPUs (Blackwell/Hopper), arquitetura de aceleração e agendamento de consultorias técnicas.

Como posso ajudar você a explorar as tecnologias de IA ou a infraestrutura do site hoje?"

### FORMATAÇÃO:
- Use Markdown limpo: títulos concisos (###), listas com marcadores, destaques em negrito e blocos de código com linguagem indicada quando aplicável.
- Seja objetivo e assertivo, fornecendo números técnicos reais quando solicitados.
- Se a dúvida envolver clusterização enterprise, migração para Blackwell ou consultoria de infraestrutura, sugira agendar uma sessão técnica via Cal.com.`;

        // Format previous turns if any
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-8)) {
            if (item.content && (item.role === 'user' || item.role === 'assistant')) {
              contents.push({
                role: item.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: item.content }],
              });
            }
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        // Use Google Search grounding with gemini-3.8-flash
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            tools: [{ googleSearch: {} }],
            temperature: 0.6,
          },
        });

        const reply = response.text || '';

        // Extract grounding chunks and web search queries from response
        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;
        const rawChunks = groundingMetadata?.groundingChunks || [];
        const webSearchQueries = groundingMetadata?.webSearchQueries || [];

        // Format web sources nicely
        const sources: { title: string; uri: string }[] = [];
        const seenUris = new Set<string>();

        for (const chunk of rawChunks) {
          if (chunk.web?.uri && !seenUris.has(chunk.web.uri)) {
            seenUris.add(chunk.web.uri);
            sources.push({
              title: chunk.web.title || new URL(chunk.web.uri).hostname.replace('www.', ''),
              uri: chunk.web.uri,
            });
          }
        }

        // Determine contextual site action
        const lowerReply = reply.toLowerCase();
        const lowerMsg = message.toLowerCase();

        let action: { type: 'cal_booking' | 'gpu_calculator' | 'navigate_section'; label: string; payload?: string } | undefined = undefined;

        if (
          lowerMsg.includes('agendar') || 
          lowerMsg.includes('reunião') || 
          lowerMsg.includes('consultoria') ||
          lowerReply.includes('cal.com') ||
          lowerReply.includes('agendar uma sessão')
        ) {
          action = {
            type: 'cal_booking',
            label: 'Agendar Sessão Técnica de 30min no Cal.com',
          };
        } else if (
          lowerMsg.includes('calculadora') || 
          lowerMsg.includes('dimensionar') || 
          lowerMsg.includes('dimensionamento') ||
          lowerMsg.includes('quanto de vram') ||
          lowerMsg.includes('quantas gpus')
        ) {
          action = {
            type: 'gpu_calculator',
            label: 'Abrir Calculadora de GPU',
          };
        } else if (
          lowerMsg.includes('playground') || 
          lowerMsg.includes('testar prompt') || 
          lowerMsg.includes('experimentar modelo')
        ) {
          action = {
            type: 'navigate_section',
            label: 'Experimentar no Playground',
            payload: 'playground',
          };
        } else if (
          lowerMsg.includes('catálogo') || 
          lowerMsg.includes('catalogo') || 
          lowerMsg.includes('modelos') || 
          lowerMsg.includes('quais modelos')
        ) {
          action = {
            type: 'navigate_section',
            label: 'Ver Catálogo de Modelos NIM',
            payload: 'catalogo',
          };
        } else if (
          lowerMsg.includes('arquitetura') || 
          lowerMsg.includes('bento') || 
          lowerMsg.includes('nvlink') || 
          lowerMsg.includes('in-flight')
        ) {
          action = {
            type: 'navigate_section',
            label: 'Explorar Arquitetura NVIDIA',
            payload: 'arquitetura',
          };
        }

        return res.json({ 
          reply,
          sources: sources.slice(0, 5),
          searchQueries: webSearchQueries.slice(0, 3),
          action,
          suggestBooking: !!(action?.type === 'cal_booking'),
        });
      } else {
        // Fallback when GEMINI_API_KEY is not set
        const lowerMsg = message.toLowerCase();
        let fallbackReply = `Como **Gemini for NVIDIA AI Developer Hub**: Posso te orientar em todas as funcionalidades do portal. `;
        let action: any = undefined;

        if (lowerMsg.includes('agendar') || lowerMsg.includes('reunião') || lowerMsg.includes('cal.com')) {
          fallbackReply += `Você pode agendar uma sessão individual de arquitetura de IA de 30 minutos diretamente com os nossos engenheiros através da integração do Cal.com.`;
          action = { type: 'cal_booking', label: 'Agendar Sessão de 30min no Cal.com' };
        } else if (lowerMsg.includes('calculadora') || lowerMsg.includes('vram') || lowerMsg.includes('gpu')) {
          fallbackReply += `Para calcular o dimensionamento exato de VRAM, KV Cache e TDP para modelos de 8B a 405B em FP4/FP8, acesse a nossa Calculadora de Dimensionamento de GPU interativa na página.`;
          action = { type: 'gpu_calculator', label: 'Abrir Calculadora de GPU' };
        } else if (lowerMsg.includes('modelo') || lowerMsg.includes('nim') || lowerMsg.includes('llama')) {
          fallbackReply += `Nosso Catálogo NIM oferece microserviços otimizados com TensorRT-LLM incluindo Meta Llama 3.3 70B, DeepSeek-R1 Distill, Nemotron-4 340B e Mistral Large 2 com latência sub-8ms TTFT.`;
          action = { type: 'navigate_section', label: 'Ver Catálogo NIM', payload: 'catalogo' };
        } else {
          fallbackReply += `Estou configurado especificamente para o conteúdo do site: catálogo de contêineres NIM, testes no playground, dimensionamento na calculadora de GPUs e arquitetura Blackwell com FP4.`;
        }

        return res.json({
          reply: fallbackReply,
          sources: [],
          action,
          suggestBooking: action?.type === 'cal_booking',
        });
      }
    } catch (err: any) {
      console.error('Erro na API de chat Gemini:', err);
      return res.status(500).json({ 
        error: 'Erro no processamento da consulta', 
        details: err?.message || String(err) 
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NVIDIA AI Developer Hub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

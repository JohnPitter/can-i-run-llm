import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Cpu, Zap, Scale, Sparkles, Gauge, BookOpen, Terminal, ExternalLink, Bot, Code2, FileSearch, MessageSquare, Image, Globe, ShieldCheck, PenTool, Workflow, Database } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon: typeof Cpu;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Accordion({ title, icon: Icon, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-2 border-nv-gray-700 rounded-[2px] overflow-hidden bg-nv-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-nv-gray-800/50 transition-colors"
      >
        <Icon className="w-4 h-4 text-nv-green flex-shrink-0" />
        <span className="text-[14px] font-bold text-white flex-1 uppercase tracking-wide">{title}</span>
        <ChevronDown className={`w-4 h-4 text-nv-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-5 pb-5 text-[13px] text-nv-gray-300 leading-[1.67] space-y-3"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export function InfoSection() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-nv-green" />
        <h2 className="text-[20px] font-bold tracking-tight uppercase">Como funciona</h2>
      </div>

      {/* Accordions — 2-col grid on large, 1-col on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Accordion title="O que e Quantizacao?" icon={Scale} defaultOpen>
          <p>
            <strong className="text-white">Quantizacao</strong> e o processo de reduzir a precisao dos pesos de um modelo de IA.
            Um modelo em FP16 (16 bits por peso) pode ser comprimido para 4 bits, reduzindo o tamanho pela metade
            com perda minima de qualidade.
          </p>
          <p>
            O formato mais popular e o <strong className="text-nv-green">GGUF</strong> (usado pelo llama.cpp e Ollama), que permite
            rodar modelos tanto na CPU quanto na GPU. A quantizacao <strong className="text-nv-green">Q4_K_M</strong> (4.5 bits por peso)
            e o padrao recomendado.
          </p>
          <div className="bg-nv-black border-2 border-nv-gray-700 rounded-[2px] p-3 sm:p-4 font-mono text-[11px] sm:text-[12px] text-nv-green overflow-x-auto">
            Memoria = Parametros(B) x Bits_por_peso / 8<br />
            Ex: 7B x 4.5 / 8 = <strong className="text-white">3.9 GB</strong> + KV cache + overhead
          </div>
        </Accordion>

        <Accordion title="Niveis de Quantizacao" icon={Cpu}>
          <div className="space-y-2">
            <p>Do menor para o maior:</p>
            <ul className="space-y-1.5 list-none text-[12px] sm:text-[13px]">
              <li><strong className="text-nv-red">IQ1/IQ2 (1.5-2.5 bpw):</strong> Compressao extrema. Qualidade ruim.</li>
              <li><strong className="text-nv-yellow">Q3_K (3.0-3.5 bpw):</strong> Abaixo da media. Para hardware limitado.</li>
              <li><strong className="text-nv-green">Q4_K_M (4.5 bpw):</strong> Padrao ouro. Minima perda perceptivel.</li>
              <li><strong className="text-nv-green-light">Q5_K_M (5.5 bpw):</strong> Excelente qualidade.</li>
              <li><strong className="text-nv-blue">Q6_K/Q8_0 (6.5-8 bpw):</strong> Quase sem perda.</li>
              <li><strong className="text-[#a855f7]">FP16 (16 bpw):</strong> Precisao total.</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="GPU vs CPU vs Apple Silicon" icon={Zap}>
          <p><strong className="text-white">GPU (VRAM):</strong> Mais rapida. NVIDIA, AMD e Intel Arc.</p>
          <p><strong className="text-white">CPU (RAM):</strong> Mais lento. DDR5 e ~70% mais rapida que DDR4.</p>
          <p><strong className="text-white">Offload Parcial:</strong> Parte na GPU, parte na CPU.</p>
          <p><strong className="text-white">Apple Silicon:</strong> Memoria unificada — excelente para LLMs.</p>
        </Accordion>

        <Accordion title="Tecnicas Avancadas (2024-2025)" icon={Sparkles}>
          <p><strong className="text-nv-green">IQ:</strong> Importance matrix para alocar bits a pesos criticos.</p>
          <p><strong className="text-nv-green">EXL2:</strong> Quantizacao adaptativa por camada (GPU-only).</p>
          <p><strong className="text-nv-green">AWQ:</strong> Preserva pesos que mais afetam ativacoes.</p>
          <p><strong className="text-nv-green">Speculative Decoding:</strong> Modelo menor sugere, grande verifica. 2-3x speedup.</p>
          <p><strong className="text-nv-green">FP8:</strong> Nativo em RTX 4000+. Metade da memoria do FP16.</p>
        </Accordion>

        {/* Velocidade spans full width on lg */}
        <div className="lg:col-span-2">
          <Accordion title="Velocidade e Usabilidade" icon={Gauge}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="mb-2">Referencia de <strong className="text-white">tokens por segundo (t/s)</strong>:</p>
                <ul className="space-y-1 list-none">
                  <li><strong className="text-nv-green">&gt;15 t/s:</strong> Excelente — fluido</li>
                  <li><strong className="text-nv-green-dark">6-15 t/s:</strong> Bom — confortavel</li>
                  <li><strong className="text-nv-yellow">2-6 t/s:</strong> Lento — com espera</li>
                  <li><strong className="text-nv-red">&lt;2 t/s:</strong> Muito lento</li>
                </ul>
              </div>
              <div>
                <p>
                  A velocidade depende da <strong className="text-white">largura de banda de memoria</strong> (GB/s).
                  DDR5 &gt; DDR4. RTX 4090 (1008 GB/s) &gt; RTX 4060 (272 GB/s).
                </p>
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      {/* What you can do with local LLMs */}
      <div className="border-2 border-nv-gray-700 rounded-[2px] bg-nv-card p-4 sm:p-6 space-y-5 mt-6 sm:mt-8">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-nv-green flex-shrink-0" />
          <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight uppercase">O que fazer com LLMs locais</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {/* Agentic Tasks */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-nv-green" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Tarefas Agenticas</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Agentes autonomos que planejam, executam ferramentas, navegam na web e resolvem tarefas complexas em multiplos passos.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-nv-green/10 text-nv-green px-2 py-0.5 rounded-[1px]">32B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Qwen 32B</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Llama 70B</span>
            </div>
          </div>

          {/* Code Generation */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#a855f7]" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Geracao de Codigo</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Autocompletar, gerar funcoes, refatorar, explicar codigo e criar testes. Substituto local do Copilot.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-[#a855f7]/10 text-[#a855f7] px-2 py-0.5 rounded-[1px]">14B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Qwen Coder 32B</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">DeepSeek Coder</span>
            </div>
          </div>

          {/* RAG */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-nv-blue" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">RAG (Busca + Geracao)</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Pergunte sobre seus proprios documentos, PDFs, bases de conhecimento. O modelo busca contexto relevante e responde.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-nv-blue/10 text-nv-blue px-2 py-0.5 rounded-[1px]">7B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Llama 8B</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Command R</span>
            </div>
          </div>

          {/* Chat / Assistant */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-nv-teal" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Chat e Assistente Pessoal</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Chatbot privado para tirar duvidas, brainstorming, resumir textos e escrever emails. 100% offline e sem custos.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-nv-teal/10 text-nv-teal px-2 py-0.5 rounded-[1px]">3B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Gemma 4B</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Phi-4 Mini</span>
            </div>
          </div>

          {/* Reasoning / Math */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-nv-orange" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Raciocinio e Matematica</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Resolucao de problemas complexos, provas matematicas, logica e chain-of-thought. Modelos "thinking" especializados.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-nv-orange/10 text-nv-orange px-2 py-0.5 rounded-[1px]">14B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">QwQ 32B</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">DeepSeek R1</span>
            </div>
          </div>

          {/* Vision / Multimodal */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-nv-yellow" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Visao e Multimodal</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Analisar imagens, descrever fotos, extrair dados de screenshots, OCR e entender diagramas.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-nv-yellow/10 text-nv-yellow px-2 py-0.5 rounded-[1px]">4B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Gemma 4</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Llama 3.2 VL</span>
            </div>
          </div>

          {/* Translation / Multilingual */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-nv-green-light" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Traducao e Multilingue</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Traduzir textos entre idiomas, localizar conteudo, resumir artigos em outro idioma. Privacidade total.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-nv-green-light/10 text-nv-green-light px-2 py-0.5 rounded-[1px]">7B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Qwen 7B</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Aya 23</span>
            </div>
          </div>

          {/* Privacy / Sensitive Data */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-nv-green-dark" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Dados Sensiveis e Privacidade</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Processar documentos confidenciais, contratos, dados medicos ou financeiros sem enviar nada para a nuvem.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-nv-green-dark/10 text-nv-green-dark px-2 py-0.5 rounded-[1px]">7B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Qualquer modelo</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">100% offline</span>
            </div>
          </div>

          {/* Creative Writing */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-[#c084fc]" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Escrita Criativa e Conteudo</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Escrever artigos, posts, roteiros, historias. Gerar ideias, criar outlines e revisar textos com estilo personalizado.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-[#c084fc]/10 text-[#c084fc] px-2 py-0.5 rounded-[1px]">8B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Llama 8B</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Mistral 7B</span>
            </div>
          </div>

          {/* Local API / Dev Tools */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-nv-gray-300" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">API Local e Ferramentas Dev</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Servir modelos como API REST compativel com OpenAI. Integrar em apps, pipelines de dados e automacoes.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-white/5 text-nv-gray-300 px-2 py-0.5 rounded-[1px]">3B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Ollama API</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">vLLM</span>
            </div>
          </div>

          {/* Function Calling */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-nv-teal" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Function Calling e Tool Use</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Modelos que chamam funcoes, acessam APIs, executam comandos e interagem com sistemas externos de forma estruturada.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-nv-teal/10 text-nv-teal px-2 py-0.5 rounded-[1px]">8B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Qwen 2.5</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Llama 3.1</span>
            </div>
          </div>

          {/* Summarization */}
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-2.5 hover:border-nv-green/40 transition-colors">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-nv-gray-300" />
              <h3 className="text-[13px] sm:text-[14px] font-bold text-white">Resumo e Extracao</h3>
            </div>
            <p className="text-[11px] sm:text-[12px] text-nv-gray-400 leading-relaxed">
              Resumir documentos longos, extrair entidades, classificar textos e gerar estruturas a partir de texto livre.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-bold bg-white/5 text-nv-gray-300 px-2 py-0.5 rounded-[1px]">3B+</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Gemma 3 4B</span>
              <span className="text-[9px] font-bold bg-nv-near-black text-nv-gray-400 px-2 py-0.5 rounded-[1px]">Phi-4 Mini</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] sm:text-[11px] text-nv-gray-500 font-medium mt-2">
          Os tamanhos minimos indicam modelos que produzem resultados uteis para a tarefa. Modelos maiores = melhor qualidade.
        </p>
      </div>

      {/* How to use section */}
      <div className="border-2 border-nv-green/30 rounded-[2px] bg-nv-card p-4 sm:p-6 space-y-4 mt-6 sm:mt-8">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-nv-green flex-shrink-0" />
          <h2 className="text-[16px] sm:text-[18px] font-bold tracking-tight uppercase">Como rodar modelos localmente</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-3">
            <h3 className="text-[14px] font-bold text-white">Ollama (Mais Facil)</h3>
            <p className="text-[12px] text-nv-gray-400">Instale o Ollama e rode com um unico comando:</p>
            <div className="bg-nv-near-black rounded-[2px] p-3 font-mono text-[11px] sm:text-[12px] text-nv-green overflow-x-auto">
              $ ollama run llama3.1:8b
            </div>
            <a href="https://ollama.com" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 text-[11px] font-bold text-nv-gray-400 hover:text-nv-teal transition-colors underline decoration-nv-green decoration-2 underline-offset-2">
              ollama.com <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-3">
            <h3 className="text-[14px] font-bold text-white">LM Studio (Interface Grafica)</h3>
            <p className="text-[12px] text-nv-gray-400">Baixe, escolha o modelo, e converse pela GUI:</p>
            <div className="bg-nv-near-black rounded-[2px] p-3 font-mono text-[12px] text-nv-gray-400">
              1. Baixe em lmstudio.ai<br />
              2. Busque o modelo<br />
              3. Selecione a quantizacao
            </div>
            <a href="https://lmstudio.ai" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 text-[11px] font-bold text-nv-gray-400 hover:text-nv-teal transition-colors underline decoration-nv-green decoration-2 underline-offset-2">
              lmstudio.ai <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-3">
            <h3 className="text-[14px] font-bold text-white">llama.cpp (Avancado)</h3>
            <p className="text-[12px] text-nv-gray-400">Maximo controle, GPU offloading manual:</p>
            <div className="bg-nv-near-black rounded-[2px] p-3 font-mono text-[11px] sm:text-[12px] text-nv-green overflow-x-auto">
              $ ./llama-cli -m model.gguf -ngl 35
            </div>
            <a href="https://github.com/ggerganov/llama.cpp" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 text-[11px] font-bold text-nv-gray-400 hover:text-nv-teal transition-colors underline decoration-nv-green decoration-2 underline-offset-2">
              github.com/ggerganov/llama.cpp <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="bg-nv-black border border-nv-gray-700 rounded-[2px] p-4 space-y-3">
            <h3 className="text-[14px] font-bold text-white">vLLM / ExLlamaV2 (GPU)</h3>
            <p className="text-[12px] text-nv-gray-400">Inferencia otimizada para GPUs NVIDIA:</p>
            <div className="bg-nv-near-black rounded-[2px] p-3 font-mono text-[11px] sm:text-[12px] text-nv-green overflow-x-auto">
              $ vllm serve meta-llama/Llama-3.1-8B
            </div>
            <a href="https://github.com/vllm-project/vllm" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 text-[11px] font-bold text-nv-gray-400 hover:text-nv-teal transition-colors underline decoration-nv-green decoration-2 underline-offset-2">
              github.com/vllm-project/vllm <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

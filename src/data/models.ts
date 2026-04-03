export interface LLMModel {
  id: string;
  name: string;
  family: string;
  parametersBillions: number;
  isMoE: boolean;
  activeParamsBillions?: number;
  contextLength: number;
  numLayers: number;
  numKVHeads: number;
  headDim: number;
  releaseYear: number;
  category: 'general' | 'code' | 'reasoning' | 'multilingual' | 'vision';
  description: string;
}

export const MODELS: LLMModel[] = [
  // Llama 3.2
  { id: 'llama-3.2-1b', name: 'Llama 3.2 1B', family: 'Meta Llama', parametersBillions: 1.24, isMoE: false, contextLength: 131072, numLayers: 16, numKVHeads: 8, headDim: 64, releaseYear: 2024, category: 'general', description: 'Modelo compacto ideal para dispositivos com recursos limitados' },
  { id: 'llama-3.2-3b', name: 'Llama 3.2 3B', family: 'Meta Llama', parametersBillions: 3.21, isMoE: false, contextLength: 131072, numLayers: 28, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Bom equilíbrio entre tamanho e capacidade para tarefas simples' },

  // Llama 3.1 / 3.3
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', family: 'Meta Llama', parametersBillions: 8.03, isMoE: false, contextLength: 131072, numLayers: 32, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'O modelo mais popular para uso local — excelente custo-benefício' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', family: 'Meta Llama', parametersBillions: 70.6, isMoE: false, contextLength: 131072, numLayers: 80, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Desempenho de ponta, rival de modelos proprietários' },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', family: 'Meta Llama', parametersBillions: 405, isMoE: false, contextLength: 131072, numLayers: 126, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'O maior Llama — requer hardware de servidor' },

  // Mistral
  { id: 'mistral-7b', name: 'Mistral 7B v0.3', family: 'Mistral', parametersBillions: 7.25, isMoE: false, contextLength: 32768, numLayers: 32, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Eficiente e rápido, ótimo para chat e instruções' },
  { id: 'mistral-nemo-12b', name: 'Mistral Nemo 12B', family: 'Mistral', parametersBillions: 12.2, isMoE: false, contextLength: 131072, numLayers: 40, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Upgrade do 7B com contexto longo e melhor raciocínio' },
  { id: 'mistral-small-24b', name: 'Mistral Small 24B', family: 'Mistral', parametersBillions: 24, isMoE: false, contextLength: 32768, numLayers: 40, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Modelo intermediário forte para tarefas complexas' },
  { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', family: 'Mistral', parametersBillions: 46.7, isMoE: true, activeParamsBillions: 12.9, contextLength: 32768, numLayers: 32, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'MoE — precisa de toda a memória mas ativa apenas 12.9B por token' },

  // Qwen 2.5
  { id: 'qwen-2.5-0.5b', name: 'Qwen 2.5 0.5B', family: 'Qwen', parametersBillions: 0.49, isMoE: false, contextLength: 32768, numLayers: 24, numKVHeads: 2, headDim: 64, releaseYear: 2024, category: 'general', description: 'Ultra leve — roda até em Raspberry Pi' },
  { id: 'qwen-2.5-1.5b', name: 'Qwen 2.5 1.5B', family: 'Qwen', parametersBillions: 1.54, isMoE: false, contextLength: 32768, numLayers: 28, numKVHeads: 2, headDim: 128, releaseYear: 2024, category: 'general', description: 'Compacto mas surpreendentemente capaz' },
  { id: 'qwen-2.5-3b', name: 'Qwen 2.5 3B', family: 'Qwen', parametersBillions: 3.09, isMoE: false, contextLength: 32768, numLayers: 36, numKVHeads: 2, headDim: 128, releaseYear: 2024, category: 'general', description: 'Boa opção para hardware limitado com qualidade decente' },
  { id: 'qwen-2.5-7b', name: 'Qwen 2.5 7B', family: 'Qwen', parametersBillions: 7.62, isMoE: false, contextLength: 131072, numLayers: 28, numKVHeads: 4, headDim: 128, releaseYear: 2024, category: 'general', description: 'Um dos melhores 7B disponíveis — multilíngue e versátil' },
  { id: 'qwen-2.5-14b', name: 'Qwen 2.5 14B', family: 'Qwen', parametersBillions: 14.8, isMoE: false, contextLength: 131072, numLayers: 48, numKVHeads: 4, headDim: 128, releaseYear: 2024, category: 'general', description: 'Excelente para tarefas que exigem mais raciocínio' },
  { id: 'qwen-2.5-32b', name: 'Qwen 2.5 32B', family: 'Qwen', parametersBillions: 32.8, isMoE: false, contextLength: 131072, numLayers: 64, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Alto desempenho para quem tem GPU de 24GB+' },
  { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', family: 'Qwen', parametersBillions: 72.7, isMoE: false, contextLength: 131072, numLayers: 80, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Rival dos melhores modelos proprietários' },
  { id: 'qwen-2.5-coder-32b', name: 'Qwen 2.5 Coder 32B', family: 'Qwen', parametersBillions: 32.8, isMoE: false, contextLength: 131072, numLayers: 64, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'code', description: 'Especialista em código — um dos melhores code models open-source' },
  { id: 'qwq-32b', name: 'QwQ 32B', family: 'Qwen', parametersBillions: 32.8, isMoE: false, contextLength: 131072, numLayers: 64, numKVHeads: 8, headDim: 128, releaseYear: 2025, category: 'reasoning', description: 'Modelo de raciocínio estilo "chain of thought"' },

  // DeepSeek
  { id: 'deepseek-r1-distill-1.5b', name: 'DeepSeek R1 Distill 1.5B', family: 'DeepSeek', parametersBillions: 1.5, isMoE: false, contextLength: 131072, numLayers: 28, numKVHeads: 2, headDim: 128, releaseYear: 2025, category: 'reasoning', description: 'Raciocínio avançado em formato ultra compacto' },
  { id: 'deepseek-r1-distill-7b', name: 'DeepSeek R1 Distill 7B', family: 'DeepSeek', parametersBillions: 7.6, isMoE: false, contextLength: 131072, numLayers: 28, numKVHeads: 4, headDim: 128, releaseYear: 2025, category: 'reasoning', description: 'Melhor modelo de raciocínio na classe 7B' },
  { id: 'deepseek-r1-distill-14b', name: 'DeepSeek R1 Distill 14B', family: 'DeepSeek', parametersBillions: 14.8, isMoE: false, contextLength: 131072, numLayers: 48, numKVHeads: 4, headDim: 128, releaseYear: 2025, category: 'reasoning', description: 'Raciocínio forte com boa relação tamanho/qualidade' },
  { id: 'deepseek-r1-distill-32b', name: 'DeepSeek R1 Distill 32B', family: 'DeepSeek', parametersBillions: 32.8, isMoE: false, contextLength: 131072, numLayers: 64, numKVHeads: 8, headDim: 128, releaseYear: 2025, category: 'reasoning', description: 'Um dos melhores para raciocínio complexo e matemática' },
  { id: 'deepseek-r1-distill-70b', name: 'DeepSeek R1 Distill 70B', family: 'DeepSeek', parametersBillions: 70.6, isMoE: false, contextLength: 131072, numLayers: 80, numKVHeads: 8, headDim: 128, releaseYear: 2025, category: 'reasoning', description: 'Qualidade de raciocínio de ponta — requer hardware robusto' },
  { id: 'deepseek-r1-671b', name: 'DeepSeek R1 671B', family: 'DeepSeek', parametersBillions: 671, isMoE: true, activeParamsBillions: 37, contextLength: 131072, numLayers: 61, numKVHeads: 8, headDim: 128, releaseYear: 2025, category: 'reasoning', description: 'MoE gigante — requer setup distribuído ou RAM massiva' },
  { id: 'deepseek-v3-671b', name: 'DeepSeek V3 671B', family: 'DeepSeek', parametersBillions: 685, isMoE: true, activeParamsBillions: 37, contextLength: 131072, numLayers: 61, numKVHeads: 8, headDim: 128, releaseYear: 2025, category: 'general', description: 'MoE de uso geral — rival do GPT-4' },

  // Phi
  { id: 'phi-4-mini', name: 'Phi-4 Mini 3.8B', family: 'Microsoft Phi', parametersBillions: 3.8, isMoE: false, contextLength: 16384, numLayers: 32, numKVHeads: 8, headDim: 96, releaseYear: 2025, category: 'general', description: 'Compacto da Microsoft — forte em raciocínio para o tamanho' },
  { id: 'phi-4-14b', name: 'Phi-4 14B', family: 'Microsoft Phi', parametersBillions: 14.7, isMoE: false, contextLength: 16384, numLayers: 40, numKVHeads: 10, headDim: 128, releaseYear: 2025, category: 'general', description: 'Excelente em STEM, matemática e raciocínio' },

  // Gemma
  { id: 'gemma-3-1b', name: 'Gemma 3 1B', family: 'Google Gemma', parametersBillions: 1.0, isMoE: false, contextLength: 32768, numLayers: 26, numKVHeads: 4, headDim: 64, releaseYear: 2025, category: 'general', description: 'Ultra leve do Google para dispositivos edge' },
  { id: 'gemma-3-4b', name: 'Gemma 3 4B', family: 'Google Gemma', parametersBillions: 4.3, isMoE: false, contextLength: 131072, numLayers: 34, numKVHeads: 4, headDim: 128, releaseYear: 2025, category: 'general', description: 'Eficiente e versátil para tarefas do dia a dia' },
  { id: 'gemma-3-12b', name: 'Gemma 3 12B', family: 'Google Gemma', parametersBillions: 12.2, isMoE: false, contextLength: 131072, numLayers: 48, numKVHeads: 4, headDim: 128, releaseYear: 2025, category: 'general', description: 'Bom desempenho geral com suporte a visão' },
  { id: 'gemma-3-27b', name: 'Gemma 3 27B', family: 'Google Gemma', parametersBillions: 27.4, isMoE: false, contextLength: 131072, numLayers: 46, numKVHeads: 8, headDim: 128, releaseYear: 2025, category: 'vision', description: 'Multimodal (texto + imagem) com qualidade alta' },

  // Gemma 4
  { id: 'gemma-4-e2b', name: 'Gemma 4 E2B', family: 'Google Gemma', parametersBillions: 2.0, isMoE: false, contextLength: 131072, numLayers: 35, numKVHeads: 1, headDim: 256, releaseYear: 2026, category: 'vision', description: 'Ultra compacto multimodal (texto + imagem + video + audio) — 128K ctx' },
  { id: 'gemma-4-e4b', name: 'Gemma 4 E4B', family: 'Google Gemma', parametersBillions: 4.0, isMoE: false, contextLength: 131072, numLayers: 42, numKVHeads: 2, headDim: 256, releaseYear: 2026, category: 'vision', description: 'Compacto multimodal (texto + imagem + video + audio) — 128K ctx' },
  { id: 'gemma-4-26b-a4b', name: 'Gemma 4 26B-A4B (MoE)', family: 'Google Gemma', parametersBillions: 25.8, isMoE: true, activeParamsBillions: 4, contextLength: 262144, numLayers: 30, numKVHeads: 8, headDim: 256, releaseYear: 2026, category: 'vision', description: 'MoE multimodal — 128 experts, 8 ativos — 256K ctx' },
  { id: 'gemma-4-31b', name: 'Gemma 4 31B', family: 'Google Gemma', parametersBillions: 31.3, isMoE: false, contextLength: 262144, numLayers: 60, numKVHeads: 16, headDim: 256, releaseYear: 2026, category: 'vision', description: 'Dense multimodal — o mais capaz da familia Gemma 4 — 256K ctx' },

  // Cohere
  { id: 'command-r-35b', name: 'Command R 35B', family: 'Cohere', parametersBillions: 35, isMoE: false, contextLength: 131072, numLayers: 40, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'multilingual', description: 'Otimizado para RAG e tarefas multilíngues' },

  // Yi
  { id: 'yi-1.5-9b', name: 'Yi 1.5 9B', family: '01.AI Yi', parametersBillions: 8.83, isMoE: false, contextLength: 4096, numLayers: 32, numKVHeads: 4, headDim: 128, releaseYear: 2024, category: 'multilingual', description: 'Forte em chinês e inglês' },
  { id: 'yi-1.5-34b', name: 'Yi 1.5 34B', family: '01.AI Yi', parametersBillions: 34.4, isMoE: false, contextLength: 4096, numLayers: 60, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'multilingual', description: 'Alta qualidade multilíngue — bom para tradução' },

  // StarCoder
  { id: 'starcoder2-3b', name: 'StarCoder2 3B', family: 'BigCode', parametersBillions: 3.03, isMoE: false, contextLength: 16384, numLayers: 30, numKVHeads: 2, headDim: 128, releaseYear: 2024, category: 'code', description: 'Modelo de código compacto para autocompletar' },
  { id: 'starcoder2-7b', name: 'StarCoder2 7B', family: 'BigCode', parametersBillions: 6.74, isMoE: false, contextLength: 16384, numLayers: 32, numKVHeads: 4, headDim: 128, releaseYear: 2024, category: 'code', description: 'Bom para code completion e geração' },
  { id: 'starcoder2-15b', name: 'StarCoder2 15B', family: 'BigCode', parametersBillions: 15.7, isMoE: false, contextLength: 16384, numLayers: 40, numKVHeads: 4, headDim: 128, releaseYear: 2024, category: 'code', description: 'Forte em geração de código em múltiplas linguagens' },

  // Falcon 3
  { id: 'falcon-3-7b', name: 'Falcon 3 7B', family: 'TII Falcon', parametersBillions: 7.5, isMoE: false, contextLength: 32768, numLayers: 32, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Modelo geral eficiente do Technology Innovation Institute' },
  { id: 'falcon-3-10b', name: 'Falcon 3 10B', family: 'TII Falcon', parametersBillions: 10.3, isMoE: false, contextLength: 32768, numLayers: 40, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Versão ampliada com melhor raciocínio' },

  // InternLM
  { id: 'internlm-2.5-7b', name: 'InternLM 2.5 7B', family: 'Shanghai AI Lab', parametersBillions: 7.74, isMoE: false, contextLength: 32768, numLayers: 32, numKVHeads: 8, headDim: 128, releaseYear: 2024, category: 'general', description: 'Modelo chinês de alta qualidade para uso geral' },
];

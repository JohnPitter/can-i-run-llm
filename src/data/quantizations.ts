export interface Quantization {
  id: string;
  name: string;
  bitsPerWeight: number;
  format: 'GGUF' | 'GGUF-IQ' | 'GPTQ' | 'AWQ' | 'EXL2' | 'BitNet' | 'FP';
  quality: 'terrible' | 'poor' | 'below_average' | 'decent' | 'good' | 'very_good' | 'excellent' | 'near_lossless' | 'lossless';
  qualityScore: number; // 1-10
  requiresGPU: boolean;
  description: string;
  recommended?: boolean;
}

export const QUANTIZATIONS: Quantization[] = [
  // GGUF IQ (Importance Matrix) — cutting edge
  { id: 'iq1_s', name: 'IQ1_S', bitsPerWeight: 1.5, format: 'GGUF-IQ', quality: 'terrible', qualityScore: 1, requiresGPU: false, description: 'Compressão extrema — perda severa de qualidade. Apenas para testes.' },
  { id: 'iq1_m', name: 'IQ1_M', bitsPerWeight: 1.75, format: 'GGUF-IQ', quality: 'terrible', qualityScore: 1.5, requiresGPU: false, description: 'Quase inutilizável — compressão experimental.' },
  { id: 'iq2_xxs', name: 'IQ2_XXS', bitsPerWeight: 2.0, format: 'GGUF-IQ', quality: 'poor', qualityScore: 2, requiresGPU: false, description: 'Qualidade baixa, mas melhor que Q2_K no mesmo tamanho.' },
  { id: 'iq2_xs', name: 'IQ2_XS', bitsPerWeight: 2.2, format: 'GGUF-IQ', quality: 'poor', qualityScore: 2.5, requiresGPU: false, description: 'Compressão agressiva com importance matrix.' },
  { id: 'iq2_s', name: 'IQ2_S', bitsPerWeight: 2.3, format: 'GGUF-IQ', quality: 'poor', qualityScore: 2.7, requiresGPU: false, description: 'Uso em cenários de memória muito limitada.' },
  { id: 'iq2_m', name: 'IQ2_M', bitsPerWeight: 2.5, format: 'GGUF-IQ', quality: 'below_average', qualityScore: 3, requiresGPU: false, description: 'Melhor 2-bit disponível via importance matrix.' },

  // GGUF legacy
  { id: 'q2_k', name: 'Q2_K', bitsPerWeight: 2.5, format: 'GGUF', quality: 'poor', qualityScore: 2.5, requiresGPU: false, description: 'Qualidade ruim. Use IQ2_M se possível.' },
  { id: 'iq3_xxs', name: 'IQ3_XXS', bitsPerWeight: 3.0, format: 'GGUF-IQ', quality: 'below_average', qualityScore: 3.5, requiresGPU: false, description: 'Início da faixa "utilizável" com importance matrix.' },
  { id: 'q3_k_s', name: 'Q3_K_S', bitsPerWeight: 3.0, format: 'GGUF', quality: 'below_average', qualityScore: 3.3, requiresGPU: false, description: 'Qualidade abaixo da média — para hardware limitado.' },
  { id: 'iq3_xs', name: 'IQ3_XS', bitsPerWeight: 3.1, format: 'GGUF-IQ', quality: 'below_average', qualityScore: 3.7, requiresGPU: false, description: 'Melhor que Q3_K_S no mesmo tamanho.' },
  { id: 'iq3_s', name: 'IQ3_S', bitsPerWeight: 3.3, format: 'GGUF-IQ', quality: 'decent', qualityScore: 4, requiresGPU: false, description: 'Decente para o nível de compressão.' },
  { id: 'q3_k_m', name: 'Q3_K_M', bitsPerWeight: 3.3, format: 'GGUF', quality: 'below_average', qualityScore: 3.8, requiresGPU: false, description: 'Abaixo da média mas utilizável para chat.' },
  { id: 'q3_k_l', name: 'Q3_K_L', bitsPerWeight: 3.5, format: 'GGUF', quality: 'decent', qualityScore: 4.2, requiresGPU: false, description: 'Melhor Q3 — quase aceitável para uso geral.' },

  { id: 'iq4_xs', name: 'IQ4_XS', bitsPerWeight: 4.0, format: 'GGUF-IQ', quality: 'good', qualityScore: 5.5, requiresGPU: false, description: 'Boa qualidade com importance matrix. Menor que Q4_K_M.' },
  { id: 'q4_0', name: 'Q4_0', bitsPerWeight: 4.0, format: 'GGUF', quality: 'decent', qualityScore: 4.5, requiresGPU: false, description: 'Formato legado. Prefira Q4_K_S ou Q4_K_M.' },
  { id: 'q4_k_s', name: 'Q4_K_S', bitsPerWeight: 4.2, format: 'GGUF', quality: 'good', qualityScore: 5.5, requiresGPU: false, description: 'Boa qualidade com tamanho compacto.' },
  { id: 'iq4_nl', name: 'IQ4_NL', bitsPerWeight: 4.5, format: 'GGUF-IQ', quality: 'good', qualityScore: 6, requiresGPU: false, description: 'Non-linear 4-bit — qualidade acima do Q4_K_S.' },
  { id: 'q4_k_m', name: 'Q4_K_M', bitsPerWeight: 4.5, format: 'GGUF', quality: 'very_good', qualityScore: 6.5, requiresGPU: false, recommended: true, description: 'O padrão recomendado — melhor custo-benefício qualidade/tamanho.' },

  { id: 'q5_0', name: 'Q5_0', bitsPerWeight: 5.0, format: 'GGUF', quality: 'good', qualityScore: 6, requiresGPU: false, description: 'Formato legado. Prefira Q5_K_S ou Q5_K_M.' },
  { id: 'q5_k_s', name: 'Q5_K_S', bitsPerWeight: 5.2, format: 'GGUF', quality: 'very_good', qualityScore: 7, requiresGPU: false, description: 'Muito boa qualidade com economia moderada.' },
  { id: 'q5_k_m', name: 'Q5_K_M', bitsPerWeight: 5.5, format: 'GGUF', quality: 'excellent', qualityScore: 7.5, requiresGPU: false, description: 'Excelente qualidade — quase sem perda perceptível.' },
  { id: 'q6_k', name: 'Q6_K', bitsPerWeight: 6.5, format: 'GGUF', quality: 'near_lossless', qualityScore: 8.5, requiresGPU: false, description: 'Quase sem perda — para quem prioriza qualidade.' },
  { id: 'q8_0', name: 'Q8_0', bitsPerWeight: 8.0, format: 'GGUF', quality: 'lossless', qualityScore: 9.5, requiresGPU: false, description: 'Praticamente idêntico ao FP16.' },

  // Full precision
  { id: 'fp16', name: 'FP16', bitsPerWeight: 16.0, format: 'FP', quality: 'lossless', qualityScore: 10, requiresGPU: false, description: 'Precisão total — referência de qualidade.' },

  // GPU-specific formats
  { id: 'gptq_4bit', name: 'GPTQ 4-bit', bitsPerWeight: 4.2, format: 'GPTQ', quality: 'good', qualityScore: 5.5, requiresGPU: true, description: 'Quantização GPU-only. Kernel otimizado para NVIDIA.' },
  { id: 'awq_4bit', name: 'AWQ 4-bit', bitsPerWeight: 4.0, format: 'AWQ', quality: 'good', qualityScore: 6, requiresGPU: true, description: 'Melhor qualidade que GPTQ no mesmo tamanho. GPU-only.' },
  { id: 'exl2_3bpw', name: 'EXL2 3.0 bpw', bitsPerWeight: 3.0, format: 'EXL2', quality: 'decent', qualityScore: 4.5, requiresGPU: true, description: 'Quantização adaptativa por camada. GPU-only.' },
  { id: 'exl2_4bpw', name: 'EXL2 4.0 bpw', bitsPerWeight: 4.0, format: 'EXL2', quality: 'very_good', qualityScore: 6.5, requiresGPU: true, description: 'Melhor qualidade por bit em GPU. Recomendado para ExLlamaV2.' },
  { id: 'exl2_5bpw', name: 'EXL2 5.0 bpw', bitsPerWeight: 5.0, format: 'EXL2', quality: 'excellent', qualityScore: 7.5, requiresGPU: true, description: 'Alta qualidade com boa compressão. GPU-only.' },
  { id: 'exl2_6bpw', name: 'EXL2 6.0 bpw', bitsPerWeight: 6.0, format: 'EXL2', quality: 'near_lossless', qualityScore: 8.5, requiresGPU: true, description: 'Quase sem perda com compressão eficiente.' },
  { id: 'fp8', name: 'FP8', bitsPerWeight: 8.0, format: 'FP', quality: 'lossless', qualityScore: 9.5, requiresGPU: true, description: 'Nativo em RTX 4000+/H100. Qualidade de referência com metade da memória do FP16.' },
];

export function getRecommendedQuantizations(hasGPU: boolean): Quantization[] {
  return QUANTIZATIONS.filter(q => hasGPU || !q.requiresGPU);
}

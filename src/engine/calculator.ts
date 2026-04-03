import { type LLMModel } from '../data/models';
import { type Quantization } from '../data/quantizations';

export type Verdict = 'runs_great' | 'runs_ok' | 'runs_slow' | 'barely_runs' | 'wont_run';

export interface ModelResult {
  model: LLMModel;
  quantization: Quantization;
  verdict: Verdict;
  modelSizeGB: number;
  kvCacheGB: number;
  totalMemoryGB: number;
  estimatedTPS: number;
  notes: string[];
  inferenceMode: 'full_gpu' | 'partial_gpu' | 'cpu_only' | 'apple_unified';
  gpuLayersOffloaded?: number;
  totalLayers?: number;
}

export interface HardwareSpecs {
  ramGB: number;
  hasGPU: boolean;
  gpuVramGB: number;
  gpuBandwidthGBs: number;
  gpuBrand: 'NVIDIA' | 'AMD' | 'Intel' | 'Apple' | 'none';
  isAppleSilicon: boolean;
  ramType: 'DDR4' | 'DDR5' | 'LPDDR5' | 'unknown';
  gpuCount: number;
}

function calculateModelSizeGB(params: number, bpw: number): number {
  return (params * bpw) / 8;
}

function calculateKVCacheGB(model: LLMModel, contextTokens: number): number {
  const bytesPerValue = 2; // FP16 KV cache
  return (2 * model.numLayers * model.numKVHeads * model.headDim * contextTokens * bytesPerValue) / 1e9;
}

function getRamBandwidth(ramType: string): number {
  switch (ramType) {
    case 'DDR5': return 60;
    case 'LPDDR5': return 55;
    case 'DDR4': return 35;
    default: return 35;
  }
}

function estimateTPSGpu(modelSizeGB: number, bandwidthGBs: number): number {
  // Token generation is memory-bandwidth bound
  // TPS ≈ bandwidth / model_size_in_GB (simplified)
  const tps = bandwidthGBs / modelSizeGB;
  return Math.min(tps, 150); // cap at realistic maximum
}

function estimateTPSCpu(modelSizeGB: number, ramBandwidthGBs: number): number {
  // CPU is much slower, also memory-bandwidth bound but with more overhead
  const tps = (ramBandwidthGBs / modelSizeGB) * 0.6; // 60% efficiency factor
  return Math.min(tps, 30);
}

function getVerdict(tps: number, totalMemoryGB: number, availableMemoryGB: number, qualityScore: number): Verdict {
  if (totalMemoryGB > availableMemoryGB) return 'wont_run';
  if (totalMemoryGB > availableMemoryGB * 0.95) return 'barely_runs';

  // Quality penalty: aggressive quantization degrades the verdict
  // qualityScore < 3 = terrible/poor, 3-5 = below average/decent, 5+ = good+
  let speedVerdict: Verdict;
  if (tps >= 15) speedVerdict = 'runs_great';
  else if (tps >= 6) speedVerdict = 'runs_ok';
  else if (tps >= 2) speedVerdict = 'runs_slow';
  else speedVerdict = 'barely_runs';

  if (qualityScore < 3) {
    // Terrible quantization: cap at barely_runs
    return 'barely_runs';
  }
  if (qualityScore < 4.5) {
    // Below average quantization: cap at runs_slow
    const capped: Verdict = speedVerdict === 'runs_great' || speedVerdict === 'runs_ok' ? 'runs_slow' : speedVerdict;
    return capped;
  }

  return speedVerdict;
}

export function analyzeModel(
  model: LLMModel,
  quant: Quantization,
  specs: HardwareSpecs,
  contextLength: number = 8192,
): ModelResult | null {
  const modelSizeGB = calculateModelSizeGB(model.parametersBillions, quant.bitsPerWeight);
  const kvCacheGB = calculateKVCacheGB(model, contextLength);
  const overheadGB = 0.75;
  const totalMemoryGB = modelSizeGB + kvCacheGB + overheadGB;

  const notes: string[] = [];
  const totalGpuVram = specs.gpuVramGB * specs.gpuCount;

  // Apple Silicon unified memory
  if (specs.isAppleSilicon) {
    const available = specs.ramGB - 4; // reserve for macOS
    if (totalMemoryGB > available) return null;

    const tps = estimateTPSGpu(modelSizeGB, specs.gpuBandwidthGBs);
    const verdict = getVerdict(tps, totalMemoryGB, available, quant.qualityScore);

    if (model.isMoE) {
      notes.push('MoE: precisa carregar todos os parâmetros na memória');
    }
    notes.push(`Memória unificada Apple — modelo usa ${totalMemoryGB.toFixed(1)} GB de ${specs.ramGB} GB`);

    return {
      model, quantization: quant, verdict, modelSizeGB, kvCacheGB, totalMemoryGB,
      estimatedTPS: Math.round(tps * 10) / 10, notes,
      inferenceMode: 'apple_unified',
    };
  }

  // GPU-only formats require GPU
  if (quant.requiresGPU && !specs.hasGPU) return null;

  // Full GPU inference
  if (specs.hasGPU && totalMemoryGB <= (totalGpuVram - 1)) {
    const tps = estimateTPSGpu(modelSizeGB, specs.gpuBandwidthGBs * specs.gpuCount);
    const verdict = getVerdict(tps, totalMemoryGB, totalGpuVram, quant.qualityScore);

    if (specs.gpuCount > 1) {
      notes.push(`Distribuído em ${specs.gpuCount}x GPUs`);
    }
    if (model.isMoE) {
      notes.push('MoE: todos os parâmetros na VRAM, mas apenas uma fração ativa por token');
    }

    return {
      model, quantization: quant, verdict, modelSizeGB, kvCacheGB, totalMemoryGB,
      estimatedTPS: Math.round(tps * 10) / 10, notes,
      inferenceMode: 'full_gpu',
      gpuLayersOffloaded: model.numLayers,
      totalLayers: model.numLayers,
    };
  }

  // Partial GPU offload (GGUF only)
  if (specs.hasGPU && !quant.requiresGPU && totalMemoryGB <= (specs.ramGB - 3)) {
    const gpuUsable = totalGpuVram - 1;
    const memPerLayer = modelSizeGB / model.numLayers;
    const gpuLayers = Math.min(model.numLayers, Math.floor(gpuUsable / memPerLayer));
    if (gpuLayers < 2) {
      // Not worth offloading — fall through to CPU only
    } else {
      const gpuFraction = gpuLayers / model.numLayers;
      const cpuFraction = 1 - gpuFraction;

      const gpuTps = estimateTPSGpu(modelSizeGB * gpuFraction, specs.gpuBandwidthGBs);
      const ramBw = getRamBandwidth(specs.ramType);
      const cpuTps = estimateTPSCpu(modelSizeGB * cpuFraction, ramBw);

      // Blended TPS — bottleneck is the slower portion
      const tps = 1 / ((gpuFraction / gpuTps) + (cpuFraction / cpuTps));
      const verdict = getVerdict(tps, totalMemoryGB, specs.ramGB - 3, quant.qualityScore);

      notes.push(`Offload parcial: ${gpuLayers}/${model.numLayers} camadas na GPU`);
      notes.push(`${(gpuFraction * 100).toFixed(0)}% GPU + ${(cpuFraction * 100).toFixed(0)}% CPU`);
      if (model.isMoE) notes.push('MoE: todos os parâmetros na memória');

      return {
        model, quantization: quant, verdict, modelSizeGB, kvCacheGB, totalMemoryGB,
        estimatedTPS: Math.round(tps * 10) / 10, notes,
        inferenceMode: 'partial_gpu',
        gpuLayersOffloaded: gpuLayers,
        totalLayers: model.numLayers,
      };
    }
  }

  // CPU-only (GGUF formats only)
  if (!quant.requiresGPU) {
    const available = specs.ramGB - 3;
    if (totalMemoryGB > available) return null;

    const ramBw = getRamBandwidth(specs.ramType);
    const tps = estimateTPSCpu(modelSizeGB, ramBw);
    const verdict = getVerdict(tps, totalMemoryGB, available, quant.qualityScore);

    notes.push('Inferência 100% na CPU via llama.cpp');
    if (specs.ramType === 'DDR5') {
      notes.push('DDR5 melhora a velocidade de inferência na CPU');
    }
    if (model.isMoE) notes.push('MoE: todos os parâmetros na RAM');

    return {
      model, quantization: quant, verdict, modelSizeGB, kvCacheGB, totalMemoryGB,
      estimatedTPS: Math.round(tps * 10) / 10, notes,
      inferenceMode: 'cpu_only',
    };
  }

  return null;
}

export function getTopResults(
  specs: HardwareSpecs,
  models: LLMModel[],
  quantizations: Quantization[],
  contextLength: number = 8192,
): ModelResult[] {
  const results: ModelResult[] = [];

  // Preferred quantization order: Q4_K_M first (recommended default), then by quality descending
  const q4km = quantizations.find(q => q.id === 'q4_k_m');
  const othersByQuality = [...quantizations]
    .filter(q => q.id !== 'q4_k_m')
    .sort((a, b) => b.qualityScore - a.qualityScore);
  const preferredOrder = q4km ? [q4km, ...othersByQuality] : othersByQuality;

  for (const model of models) {
    let bestResult: ModelResult | null = null;

    for (const quant of preferredOrder) {
      const result = analyzeModel(model, quant, specs, contextLength);
      if (result !== null && result.verdict !== 'wont_run') {
        bestResult = result;
        break;
      }
    }

    if (bestResult) {
      results.push(bestResult);
    }
  }

  // Sort: best verdict first, then by model size descending (bigger = more capable)
  const verdictOrder: Record<Verdict, number> = {
    runs_great: 0, runs_ok: 1, runs_slow: 2, barely_runs: 3, wont_run: 4,
  };

  results.sort((a, b) => {
    const vDiff = verdictOrder[a.verdict] - verdictOrder[b.verdict];
    if (vDiff !== 0) return vDiff;
    return b.model.parametersBillions - a.model.parametersBillions;
  });

  return results;
}

export function getAllResultsForModel(
  model: LLMModel,
  specs: HardwareSpecs,
  quantizations: Quantization[],
  contextLength: number = 8192,
): ModelResult[] {
  const results: ModelResult[] = [];

  for (const quant of quantizations) {
    const result = analyzeModel(model, quant, specs, contextLength);
    if (result) results.push(result);
  }

  return results.sort((a, b) => b.quantization.qualityScore - a.quantization.qualityScore);
}

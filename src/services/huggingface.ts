const HF_API = 'https://huggingface.co/api/models';

interface HFModel {
  id: string;
  modelId: string;
  author: string;
  downloads: number;
  likes: number;
  pipeline_tag: string;
  tags: string[];
  createdAt: string;
  config?: {
    model_type?: string;
    tokenizer_config?: Record<string, unknown>;
  };
}

export interface ParsedModel {
  id: string;
  name: string;
  author: string;
  family: string;
  parametersBillions: number;
  contextLength: number;
  numLayers: number;
  numKVHeads: number;
  headDim: number;
  downloads: number;
  likes: number;
  isMoE: boolean;
  category: 'general' | 'code' | 'reasoning' | 'multilingual' | 'vision';
  description: string;
  hfUrl: string;
  ollamaName?: string;
  hasGGUF: boolean;
  lastModified: string;
}

// Extract parameter count from model name (e.g. "Llama-3.1-8B-Instruct" -> 8)
function extractParamsFromName(id: string): number | null {
  const name = id.split('/').pop() ?? id;
  // Match patterns like: 7B, 0.5B, 70B, 8x7B (take the total), 3B, 1.5B
  const moeMatch = name.match(/(\d+)x(\d+)[bB]/i);
  if (moeMatch) return parseInt(moeMatch[1]) * parseInt(moeMatch[2]);

  const match = name.match(/[\-_.](\d+\.?\d*)[bB](?:[\-_.]|$)/i);
  if (match) return parseFloat(match[1]);

  // Try at the beginning
  const startMatch = name.match(/^(\d+\.?\d*)[bB]/i);
  if (startMatch) return parseFloat(startMatch[1]);

  return null;
}

// Estimate architecture params from model size
function estimateArchitecture(paramsBillions: number): { numLayers: number; numKVHeads: number; headDim: number; contextLength: number } {
  if (paramsBillions <= 1) return { numLayers: 16, numKVHeads: 4, headDim: 64, contextLength: 32768 };
  if (paramsBillions <= 3) return { numLayers: 28, numKVHeads: 4, headDim: 128, contextLength: 32768 };
  if (paramsBillions <= 9) return { numLayers: 32, numKVHeads: 8, headDim: 128, contextLength: 131072 };
  if (paramsBillions <= 16) return { numLayers: 40, numKVHeads: 8, headDim: 128, contextLength: 131072 };
  if (paramsBillions <= 35) return { numLayers: 48, numKVHeads: 8, headDim: 128, contextLength: 131072 };
  if (paramsBillions <= 75) return { numLayers: 80, numKVHeads: 8, headDim: 128, contextLength: 131072 };
  return { numLayers: 100, numKVHeads: 8, headDim: 128, contextLength: 131072 };
}

const FAMILY_MAP: Record<string, string> = {
  llama: 'Meta Llama', mistral: 'Mistral', mixtral: 'Mistral',
  qwen2: 'Qwen', qwen3: 'Qwen', gemma: 'Google Gemma', gemma2: 'Google Gemma', gemma3: 'Google Gemma', gemma4: 'Google Gemma',
  phi3: 'Microsoft Phi', phi4: 'Microsoft Phi', deepseek: 'DeepSeek',
  starcoder2: 'BigCode', falcon: 'TII Falcon', internlm2: 'Shanghai AI Lab',
  command: 'Cohere', yi: '01.AI Yi', codellama: 'Meta Llama', gpt2: 'OpenAI',
};

const MOE_KEYWORDS = ['moe', 'mixtral', '8x7b', '8x22b', 'dbrx'];
const SKIP_KEYWORDS = ['gguf', 'gptq', 'awq', 'exl2', 'lora', 'adapter', 'merge', 'bnb'];

function detectCategory(id: string, tags: string[]): 'general' | 'code' | 'reasoning' | 'multilingual' | 'vision' {
  const lower = id.toLowerCase();
  if (lower.includes('coder') || lower.includes('starcoder') || lower.includes('codellama') || lower.includes('deepseek-coder')) return 'code';
  if (lower.includes('r1') || lower.includes('qwq') || lower.includes('reasoning')) return 'reasoning';
  if (lower.includes('vision') || lower.includes('-vl') || lower.includes('multimodal')) return 'vision';
  if (tags.includes('multilingual') || lower.includes('aya')) return 'multilingual';
  return 'general';
}

function getOllamaName(id: string): string | undefined {
  const lower = id.toLowerCase();
  if (lower.includes('llama-3')) {
    const m = lower.match(/(\d+)b/i);
    if (m) return `llama3.1:${m[1]}b`;
  }
  if (lower.includes('qwen')) {
    const m = lower.match(/(\d+\.?\d*)b/i);
    if (m) return `qwen2.5:${m[1]}b`;
  }
  if (lower.includes('mistral') && !lower.includes('mixtral')) return 'mistral';
  if (lower.includes('phi-4') || lower.includes('phi4')) return 'phi4';
  if (lower.includes('deepseek-r1')) return 'deepseek-r1';
  if (lower.includes('gemma-3') || lower.includes('gemma3')) return 'gemma3';
  return undefined;
}

function formatParamSize(billions: number): string {
  if (billions >= 1) return `${billions.toFixed(1)}B`;
  return `${(billions * 1000).toFixed(0)}M`;
}

function cleanModelName(id: string): string {
  const name = id.split('/').pop() ?? id;
  return name.replace(/-/g, ' ');
}

function parseModel(hf: HFModel): ParsedModel | null {
  const lower = hf.id.toLowerCase();

  // Skip quantized/adapter repos — we want base models
  if (SKIP_KEYWORDS.some(k => lower.includes(k))) return null;

  const paramsBillions = extractParamsFromName(hf.id);
  if (!paramsBillions || paramsBillions < 0.3) return null;

  const modelType = hf.config?.model_type?.toLowerCase() ?? '';
  const family = FAMILY_MAP[modelType] ?? hf.author;
  const arch = estimateArchitecture(paramsBillions);
  const isMoE = MOE_KEYWORDS.some(k => lower.includes(k));
  const hasGGUF = hf.tags?.includes('gguf') ?? false;

  return {
    id: hf.id,
    name: `${cleanModelName(hf.id)} (${formatParamSize(paramsBillions)})`,
    author: hf.author,
    family,
    parametersBillions: paramsBillions,
    contextLength: arch.contextLength,
    numLayers: arch.numLayers,
    numKVHeads: arch.numKVHeads,
    headDim: arch.headDim,
    downloads: hf.downloads,
    likes: hf.likes,
    isMoE,
    category: detectCategory(hf.id, hf.tags ?? []),
    description: `${family} | ${formatParamSize(paramsBillions)} params | ${(hf.downloads / 1000000).toFixed(1)}M downloads`,
    hfUrl: `https://huggingface.co/${hf.id}`,
    ollamaName: getOllamaName(hf.id),
    hasGGUF,
    lastModified: hf.createdAt ?? new Date().toISOString(),
  };
}

async function fetchModels(sort: string, limit: number): Promise<HFModel[]> {
  const params = new URLSearchParams({
    filter: 'text-generation',
    sort,
    direction: '-1',
    limit: String(limit),
  });

  const res = await fetch(`${HF_API}?${params}`);
  if (!res.ok) throw new Error(`HuggingFace API error: ${res.status}`);
  return res.json();
}

export async function fetchAllModels(): Promise<ParsedModel[]> {
  // Fetch by downloads (popular) AND by trending (new models like Gemma 4)
  const [byDownloads, byTrending] = await Promise.all([
    fetchModels('downloads', 100),
    fetchModels('trending', 50),
  ]);

  const parsed: ParsedModel[] = [];
  const seen = new Set<string>();

  for (const hf of [...byDownloads, ...byTrending]) {
    const model = parseModel(hf);
    if (model && !seen.has(model.id)) {
      seen.add(model.id);
      parsed.push(model);
    }
  }

  // Sort by downloads
  parsed.sort((a, b) => b.downloads - a.downloads);
  return parsed;
}

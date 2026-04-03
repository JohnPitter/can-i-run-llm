import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, XCircle, Gauge, MemoryStick,
  ChevronDown, Info, Cpu, Monitor, Layers, ExternalLink, Terminal, Download,
} from 'lucide-react';
import { type ModelResult, type Verdict, getAllResultsForModel } from '../engine/calculator';
import { type HardwareSpecs } from '../engine/calculator';
import { QUANTIZATIONS } from '../data/quantizations';
import { type ParsedModel } from '../services/huggingface';

interface ResultCardProps {
  result: ModelResult;
  specs: HardwareSpecs;
  contextLength: number;
  index: number;
  parsedModel?: ParsedModel;
}

const VERDICT_CONFIG: Record<Verdict, { label: string; color: string; borderColor: string; icon: typeof CheckCircle2 }> = {
  runs_great: { label: 'RODA OTIMO', color: 'text-nv-green', borderColor: 'border-nv-green/40', icon: CheckCircle2 },
  runs_ok: { label: 'RODA BEM', color: 'text-nv-green-dark', borderColor: 'border-nv-green-dark/30', icon: CheckCircle2 },
  runs_slow: { label: 'RODA LENTO', color: 'text-nv-yellow', borderColor: 'border-nv-yellow/30', icon: AlertTriangle },
  barely_runs: { label: 'MAL RODA', color: 'text-nv-red', borderColor: 'border-nv-red/30', icon: AlertTriangle },
  wont_run: { label: 'NAO RODA', color: 'text-nv-red', borderColor: 'border-nv-red/30', icon: XCircle },
};

const CATEGORY_BADGES: Record<string, { label: string; color: string }> = {
  general: { label: 'GERAL', color: 'border-nv-blue/50 text-nv-blue' },
  code: { label: 'CODIGO', color: 'border-nv-purple/50 text-[#a855f7]' },
  reasoning: { label: 'RACIOCINIO', color: 'border-nv-green/50 text-nv-green' },
  multilingual: { label: 'MULTILINGUE', color: 'border-nv-teal/50 text-nv-teal' },
  vision: { label: 'VISAO', color: 'border-nv-orange/50 text-nv-orange' },
};

const INFERENCE_ICONS: Record<string, { label: string; icon: typeof Cpu }> = {
  full_gpu: { label: 'GPU', icon: Monitor },
  partial_gpu: { label: 'GPU+CPU', icon: Layers },
  cpu_only: { label: 'CPU', icon: Cpu },
  apple_unified: { label: 'UNIFIED', icon: Monitor },
};

function TPSBar({ tps }: { tps: number }) {
  const maxTps = 80;
  const pct = Math.min((tps / maxTps) * 100, 100);
  const color = tps >= 15 ? 'bg-nv-green' : tps >= 6 ? 'bg-nv-yellow' : 'bg-nv-red';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-[3px] bg-nv-gray-800 rounded-[1px] overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-[1px]`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[13px] font-mono font-bold text-white w-16 text-right">{tps} t/s</span>
    </div>
  );
}

export function ResultCard({ result, specs, contextLength, index, parsedModel }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const verdict = VERDICT_CONFIG[result.verdict];
  const VerdictIcon = verdict.icon;
  const category = CATEGORY_BADGES[result.model.category];
  const inference = INFERENCE_ICONS[result.inferenceMode];
  const InferenceIcon = inference.icon;

  const allQuants = expanded ? getAllResultsForModel(result.model, specs, QUANTIZATIONS, contextLength) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: 'easeOut' }}
      className={`border-2 rounded-[2px] overflow-hidden transition-all duration-200 hover:shadow-[rgba(0,0,0,0.3)_0px_0px_5px_0px] ${verdict.borderColor} bg-nv-card`}
    >
      {/* Main row */}
      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`mt-0.5 flex-shrink-0 ${verdict.color}`}>
            <VerdictIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Title line */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="text-[13px] sm:text-[15px] font-bold text-white truncate max-w-full">{result.model.name}</h3>
              <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-[1px] border ${category.color}`}>
                {category.label}
              </span>
              {result.model.isMoE && (
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-[1px] border border-nv-fuchsia/50 text-[#c084fc]">
                  MOE
                </span>
              )}
            </div>

            <p className="text-[12px] text-nv-gray-400 mt-1 font-medium">{result.model.description}</p>

            {/* Stats line */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold uppercase tracking-wider">
              <span className={verdict.color}>{verdict.label}</span>
              <span className="flex items-center gap-1 text-nv-gray-400">
                <InferenceIcon className="w-3 h-3" />{inference.label}
              </span>
              <span className="font-mono text-nv-gray-400">{result.model.parametersBillions}B</span>
              <span className="font-mono text-nv-green">{result.quantization.name}</span>
            </div>

            {/* Metrics */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-nv-gray-500">
                  <Gauge className="w-3 h-3" /> Velocidade
                </div>
                <TPSBar tps={result.estimatedTPS} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-nv-gray-500">
                  <MemoryStick className="w-3 h-3" /> Memoria
                </div>
                <div className="text-[13px] font-mono font-bold text-white">
                  {result.totalMemoryGB.toFixed(1)} GB
                  <span className="text-nv-gray-500 text-[10px] ml-1.5 font-normal">
                    ({result.modelSizeGB.toFixed(1)} + KV {result.kvCacheGB.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>

            {/* GPU layers */}
            {result.inferenceMode === 'partial_gpu' && result.gpuLayersOffloaded !== undefined && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-nv-gray-500">
                <Layers className="w-3 h-3" />
                {result.gpuLayersOffloaded}/{result.totalLayers} CAMADAS NA GPU
              </div>
            )}

            {/* Notes */}
            {result.notes.length > 0 && (
              <div className="mt-2 space-y-1">
                {result.notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[10px] text-nv-gray-500 font-medium">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Links */}
            {parsedModel && (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-bold">
                <a
                  href={parsedModel.hfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-nv-gray-400 hover:text-nv-teal transition-colors underline decoration-nv-green decoration-2 underline-offset-2"
                >
                  <Download className="w-3 h-3" /> Hugging Face
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                {parsedModel.ollamaName && (
                  <span className="flex items-center gap-1.5 text-nv-gray-500 font-mono text-[10px]">
                    <Terminal className="w-3 h-3 text-nv-green" />
                    ollama run {parsedModel.ollamaName}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold uppercase tracking-wider text-nv-gray-500 hover:text-nv-gray-300 border-t border-nv-gray-800 transition-colors hover:bg-nv-gray-800/50"
      >
        <span>{expanded ? 'ESCONDER' : 'VER QUANTIZACOES'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded quantizations */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-nv-gray-800 bg-nv-black/50 px-3 sm:px-4 py-3"
        >
          <div className="overflow-x-auto -mx-1">
          <div className="grid gap-1 min-w-[420px]">
            <div className="grid grid-cols-[1fr,65px,65px,65px,50px] sm:grid-cols-[1fr,70px,70px,70px,60px] gap-2 text-[9px] font-bold uppercase tracking-wider text-nv-gray-500 pb-1.5 border-b border-nv-gray-800">
              <span>QUANT</span>
              <span className="text-right">MODELO</span>
              <span className="text-right">TOTAL</span>
              <span className="text-right">VEL.</span>
              <span className="text-center">STATUS</span>
            </div>
            {allQuants.map(r => {
              const v = VERDICT_CONFIG[r.verdict];
              return (
                <div
                  key={r.quantization.id}
                  className={`grid grid-cols-[1fr,65px,65px,65px,50px] sm:grid-cols-[1fr,70px,70px,70px,60px] gap-2 items-center py-1.5 text-[11px] sm:text-[12px] ${
                    r.quantization.id === result.quantization.id ? 'bg-nv-green/5 -mx-2 px-2 rounded-[1px]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{r.quantization.name}</span>
                    {r.quantization.recommended && (
                      <span className="text-[8px] bg-nv-green/20 text-nv-green px-1.5 py-0.5 rounded-[1px] font-bold">REC</span>
                    )}
                    <span className="text-[9px] text-nv-gray-600 font-bold">{r.quantization.format}</span>
                  </div>
                  <span className="text-right font-mono text-nv-gray-400 text-[11px]">{r.modelSizeGB.toFixed(1)}</span>
                  <span className="text-right font-mono text-nv-gray-400 text-[11px]">{r.totalMemoryGB.toFixed(1)}</span>
                  <span className="text-right font-mono text-nv-gray-400 text-[11px]">{r.estimatedTPS}</span>
                  <span className={`text-center text-[9px] font-bold ${v.color}`}>
                    {r.verdict === 'runs_great' ? 'OK' : r.verdict === 'runs_ok' ? 'OK' :
                     r.verdict === 'runs_slow' ? 'LENTO' : r.verdict === 'barely_runs' ? 'RUIM' : '---'}
                  </span>
                </div>
              );
            })}
          </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

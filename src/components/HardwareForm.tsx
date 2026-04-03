import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, MonitorCog, Zap, ChevronDown, Search, Layers, BrainCircuit, X } from 'lucide-react';
import { KNOWN_GPUS, type GPU } from '../data/gpus';
import { type HardwareSpecs } from '../engine/calculator';

interface HardwareFormProps {
  onAnalyze: (specs: HardwareSpecs, contextLength: number, modelQuery: string) => void;
  isLoading: boolean;
  availableModels: string[];
}

const RAM_OPTIONS = [4, 8, 16, 24, 32, 48, 64, 96, 128, 192, 256];
const CONTEXT_OPTIONS = [
  { value: 2048, label: '2K' },
  { value: 4096, label: '4K' },
  { value: 8192, label: '8K' },
  { value: 16384, label: '16K' },
  { value: 32768, label: '32K' },
  { value: 65536, label: '64K' },
  { value: 131072, label: '128K' },
  { value: 262144, label: '256K' },
  { value: 1048576, label: '1M' },
];

function SectionLabel({ icon: Icon, children }: { icon: typeof Cpu; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-nv-gray-400">
      <Icon className="w-3.5 h-3.5 text-nv-green flex-shrink-0" />
      {children}
    </label>
  );
}

function Chip({ active, onClick, children, mono, className = '' }: { active: boolean; onClick: () => void; children: React.ReactNode; mono?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-2 rounded-[2px] text-[12px] sm:text-[13px] font-bold border-2 transition-all duration-150 min-w-0 ${
        mono ? 'font-mono' : ''
      } ${
        active
          ? 'border-nv-green bg-nv-green/5 text-white'
          : 'border-transparent bg-nv-near-black text-nv-gray-400 hover:text-nv-gray-300 hover:bg-nv-gray-800'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function HardwareForm({ onAnalyze, isLoading, availableModels }: HardwareFormProps) {
  const [ramGB, setRamGB] = useState(16);
  const [gpuMode, setGpuMode] = useState<'none' | 'select' | 'manual'>('select');
  const [selectedGpuId, setSelectedGpuId] = useState('');
  const [manualVram, setManualVram] = useState(8);
  const [gpuBrand, setGpuBrand] = useState<'NVIDIA' | 'AMD' | 'Intel'>('NVIDIA');
  const [gpuCount, setGpuCount] = useState(1);
  const [ramType, setRamType] = useState<'DDR4' | 'DDR5' | 'LPDDR5' | 'unknown'>('DDR4');
  const [contextLength, setContextLength] = useState(8192);
  const [gpuSearch, setGpuSearch] = useState('');
  const [showGpuDropdown, setShowGpuDropdown] = useState(false);
  const [modelQuery, setModelQuery] = useState('');
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);

  const selectedGpu = KNOWN_GPUS.find(g => g.id === selectedGpuId);
  const isApple = selectedGpu?.brand === 'Apple';

  const modelSuggestions = useMemo(() => {
    if (!modelQuery.trim() || modelQuery.length < 2) return [];
    const terms = modelQuery.toLowerCase().split(/\s+/);
    return availableModels
      .filter(name => terms.every(t => name.toLowerCase().includes(t)))
      .slice(0, 8);
  }, [modelQuery, availableModels]);

  const filteredGpus = useMemo(() => {
    if (!gpuSearch.trim()) return KNOWN_GPUS;
    const terms = gpuSearch.toLowerCase().split(/\s+/);
    return KNOWN_GPUS.filter(gpu =>
      terms.every(term => gpu.name.toLowerCase().includes(term))
    );
  }, [gpuSearch]);

  const groupedGpus = useMemo(() => {
    const groups: Record<string, GPU[]> = {};
    for (const gpu of filteredGpus) {
      const key = gpu.brand === 'Apple' ? 'APPLE SILICON' : gpu.brand.toUpperCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(gpu);
    }
    return groups;
  }, [filteredGpus]);

  function handleSubmit() {
    let specs: HardwareSpecs;

    if (gpuMode === 'none') {
      specs = { ramGB, hasGPU: false, gpuVramGB: 0, gpuBandwidthGBs: 0, gpuBrand: 'none', isAppleSilicon: false, ramType, gpuCount: 0 };
    } else if (gpuMode === 'select' && selectedGpu) {
      specs = {
        ramGB: isApple ? selectedGpu.vramGB : ramGB,
        hasGPU: true, gpuVramGB: selectedGpu.vramGB, gpuBandwidthGBs: selectedGpu.bandwidthGBs,
        gpuBrand: selectedGpu.brand, isAppleSilicon: selectedGpu.brand === 'Apple',
        ramType: isApple ? 'LPDDR5' : ramType, gpuCount: isApple ? 1 : gpuCount,
      };
    } else {
      specs = { ramGB, hasGPU: true, gpuVramGB: manualVram, gpuBandwidthGBs: 400, gpuBrand: gpuBrand, isAppleSilicon: false, ramType, gpuCount };
    }

    onAnalyze(specs, contextLength, modelQuery.trim());
  }

  const canSubmit = !isLoading && (gpuMode === 'none' || gpuMode === 'manual' || (gpuMode === 'select' && !!selectedGpu));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <div className="relative bg-nv-black border-2 border-nv-gray-700 rounded-[2px] p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b-2 border-nv-green">
          <MonitorCog className="w-5 h-5 text-nv-green flex-shrink-0" />
          <h2 className="text-[15px] sm:text-[18px] font-bold tracking-tight uppercase">Especificacoes do Hardware</h2>
        </div>

        {/* Model Search */}
        <div className="space-y-2 relative">
          <SectionLabel icon={BrainCircuit}>Modelo (Opcional)</SectionLabel>
          <div className="flex items-center gap-2 bg-nv-near-black border-2 border-nv-gray-700 rounded-[2px] px-3 sm:px-4 py-3 hover:border-nv-gray-500 transition-colors">
            <Search className="w-4 h-4 text-nv-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar modelo... (ex: llama 8b, qwen 32b)"
              value={modelQuery}
              onChange={e => { setModelQuery(e.target.value); setShowModelSuggestions(true); }}
              onFocus={() => setShowModelSuggestions(true)}
              onBlur={() => setTimeout(() => setShowModelSuggestions(false), 200)}
              className="flex-1 bg-transparent outline-none text-[13px] sm:text-[14px] font-medium text-white placeholder:text-nv-gray-500 min-w-0"
            />
            {modelQuery && (
              <button onClick={() => { setModelQuery(''); setShowModelSuggestions(false); }} className="text-nv-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {!modelQuery && (
            <p className="text-[10px] sm:text-[11px] text-nv-gray-500 font-medium">
              Deixe vazio para analisar todos os modelos.
            </p>
          )}

          {/* Suggestions dropdown */}
          {showModelSuggestions && modelSuggestions.length > 0 && (
            <div
              className="absolute z-40 top-full left-0 right-0 mt-1 bg-nv-near-black border-2 border-nv-gray-600 rounded-[2px] max-h-48 overflow-y-auto dropdown-scroll"
              style={{ boxShadow: 'rgba(0,0,0,0.5) 0px 4px 20px 0px' }}
              onMouseDown={e => e.preventDefault()}
            >
              {modelSuggestions.map(name => (
                <button
                  key={name}
                  onClick={() => { setModelQuery(name); setShowModelSuggestions(false); }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] font-medium hover:bg-nv-gray-800 transition-colors truncate ${
                    modelQuery === name ? 'text-nv-green bg-nv-green/5' : 'text-white'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPU Mode — stack on small screens */}
        <div className="space-y-3">
          <SectionLabel icon={Zap}>Placa de Video (GPU)</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {([
              { value: 'select' as const, label: 'SELECIONAR GPU' },
              { value: 'manual' as const, label: 'VRAM MANUAL' },
              { value: 'none' as const, label: 'SEM GPU' },
            ] as const).map(opt => (
              <Chip key={opt.value} active={gpuMode === opt.value} onClick={() => { setGpuMode(opt.value); setShowGpuDropdown(false); }} className="text-center">
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* GPU Select */}
        {gpuMode === 'select' && (
          <div className="space-y-2 relative">
            <div
              className="flex items-center gap-2 bg-nv-near-black border-2 border-nv-gray-700 rounded-[2px] px-3 sm:px-4 py-3 cursor-pointer hover:border-nv-gray-500 transition-colors"
              onClick={() => setShowGpuDropdown(!showGpuDropdown)}
            >
              <Search className="w-4 h-4 text-nv-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder={selectedGpu ? selectedGpu.name : "Buscar GPU..."}
                value={gpuSearch}
                onChange={e => { setGpuSearch(e.target.value); setShowGpuDropdown(true); }}
                onClick={e => { e.stopPropagation(); setShowGpuDropdown(true); }}
                className="flex-1 bg-transparent outline-none text-[13px] sm:text-[14px] font-medium text-white placeholder:text-nv-gray-500 min-w-0"
              />
              <ChevronDown className={`w-4 h-4 text-nv-gray-500 flex-shrink-0 transition-transform duration-200 ${showGpuDropdown ? 'rotate-180' : ''}`} />
            </div>

            {selectedGpu && (
              <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] font-mono text-nv-gray-400 pl-1 flex-wrap">
                <Layers className="w-3.5 h-3.5 text-nv-green flex-shrink-0" />
                <span className="text-nv-green font-bold">{selectedGpu.vramGB} GB</span>
                <span>{isApple ? 'Unified' : 'VRAM'}</span>
                <span className="text-nv-gray-600">|</span>
                <span>{selectedGpu.bandwidthGBs} GB/s</span>
              </div>
            )}

            {showGpuDropdown && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-nv-near-black border-2 border-nv-gray-600 rounded-[2px] max-h-60 sm:max-h-64 overflow-y-auto dropdown-scroll" style={{ boxShadow: 'rgba(0,0,0,0.5) 0px 4px 20px 0px' }}>
                {Object.entries(groupedGpus).map(([brand, gpus]) => (
                  <div key={brand}>
                    <div className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-nv-green bg-nv-black/90 sticky top-0 border-b border-nv-gray-700 backdrop-blur-sm">
                      {brand}
                    </div>
                    {gpus.map(gpu => (
                      <button
                        key={gpu.id}
                        onClick={() => { setSelectedGpuId(gpu.id); setGpuSearch(''); setShowGpuDropdown(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2.5 text-[13px] font-medium flex items-center justify-between gap-2 hover:bg-nv-gray-800 transition-colors ${
                          selectedGpuId === gpu.id ? 'text-nv-green bg-nv-green/5' : 'text-white'
                        }`}
                      >
                        <span className="truncate">{gpu.name}</span>
                        <span className="text-[11px] text-nv-gray-500 font-mono font-bold flex-shrink-0">{gpu.vramGB} GB</span>
                      </button>
                    ))}
                  </div>
                ))}
                {filteredGpus.length === 0 && (
                  <div className="px-4 py-6 text-center text-[13px] text-nv-gray-500">
                    Nenhuma GPU encontrada. Tente "VRAM MANUAL".
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual VRAM */}
        {gpuMode === 'manual' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-nv-gray-500">Marca</label>
              <select
                value={gpuBrand}
                onChange={e => setGpuBrand(e.target.value as 'NVIDIA' | 'AMD' | 'Intel')}
                className="w-full bg-nv-near-black border-2 border-nv-gray-700 rounded-[2px] px-3 py-2.5 text-[13px] sm:text-[14px] font-bold text-white outline-none focus:border-nv-green transition-colors"
              >
                <option value="NVIDIA">NVIDIA</option>
                <option value="AMD">AMD</option>
                <option value="Intel">Intel</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-nv-gray-500">VRAM (GB)</label>
              <input
                type="number" min={1} max={192} value={manualVram}
                onChange={e => setManualVram(Number(e.target.value))}
                className="w-full bg-nv-near-black border-2 border-nv-gray-700 rounded-[2px] px-3 py-2.5 text-[13px] sm:text-[14px] font-mono font-bold text-nv-green outline-none focus:border-nv-green transition-colors"
              />
            </div>
          </div>
        )}

        {/* GPU Count */}
        {gpuMode !== 'none' && !isApple && (
          <div className="space-y-2">
            <SectionLabel icon={Layers}>GPUs</SectionLabel>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(n => (
                <Chip key={n} active={gpuCount === n} onClick={() => setGpuCount(n)} mono>{n}x</Chip>
              ))}
            </div>
          </div>
        )}

        {/* RAM — wraps naturally */}
        {!isApple && (
          <div className="space-y-3">
            <SectionLabel icon={HardDrive}>Memoria RAM</SectionLabel>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
              {RAM_OPTIONS.map(gb => (
                <Chip key={gb} active={ramGB === gb} onClick={() => setRamGB(gb)} mono className="text-center text-[11px] sm:text-[12px] px-1.5">{gb}</Chip>
              ))}
            </div>
          </div>
        )}

        {/* RAM Type — 2x2 on mobile, 4 on wider */}
        {!isApple && (
          <div className="space-y-2">
            <SectionLabel icon={Cpu}>Tipo de Memoria</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['DDR4', 'DDR5', 'LPDDR5', 'unknown'] as const).map(type => (
                <Chip key={type} active={ramType === type} onClick={() => setRamType(type)} className="text-center">
                  {type === 'unknown' ? 'NAO SEI' : type}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Context Length */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-nv-gray-400">Tamanho do Contexto</label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CONTEXT_OPTIONS.map(opt => (
              <Chip key={opt.value} active={contextLength === opt.value} onClick={() => setContextLength(opt.value)} mono>
                {opt.label}
              </Chip>
            ))}
          </div>
          <p className="text-[10px] sm:text-[11px] text-nv-gray-500 font-medium">
            Mais contexto = mais memoria. 8K e o padrao recomendado.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3.5 sm:py-4 rounded-[2px] text-[14px] sm:text-[16px] font-bold uppercase tracking-[0.05em] border-2 transition-all duration-200 active:scale-[0.99] ${
            canSubmit
              ? 'border-nv-green bg-transparent text-white hover:bg-nv-teal hover:border-nv-teal cursor-pointer'
              : 'border-nv-gray-700 bg-transparent text-nv-gray-600 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-nv-green border-t-transparent rounded-full animate-spin" />
              Carregando...
            </span>
          ) : (
            'Analisar Compatibilidade'
          )}
        </button>
      </div>
    </motion.div>
  );
}

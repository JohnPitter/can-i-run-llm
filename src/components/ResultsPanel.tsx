import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, BarChart3, ArrowUpDown } from 'lucide-react';
import { type ModelResult, type HardwareSpecs } from '../engine/calculator';
import { type ParsedModel } from '../services/huggingface';
import { ResultCard } from './ResultCard';

interface ResultsPanelProps {
  results: ModelResult[];
  specs: HardwareSpecs;
  contextLength: number;
  parsedModels: Map<string, ParsedModel>;
}

type SortBy = 'verdict' | 'size' | 'speed' | 'memory';
type FilterCategory = 'all' | 'general' | 'code' | 'reasoning' | 'multilingual' | 'vision';
type FilterVerdict = 'all' | 'runnable' | 'great' | 'slow';

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-[1px] text-[10px] font-bold uppercase tracking-wider transition-all border ${
        active
          ? 'border-nv-green text-nv-green'
          : 'border-transparent text-nv-gray-500 hover:text-nv-gray-300'
      }`}
    >
      {children}
    </button>
  );
}

export function ResultsPanel({ results, specs, contextLength, parsedModels }: ResultsPanelProps) {
  const [sortBy, setSortBy] = useState<SortBy>('verdict');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterVerdict, setFilterVerdict] = useState<FilterVerdict>('all');

  const processed = useMemo(() => {
    let filtered = [...results];

    if (filterCategory !== 'all') {
      filtered = filtered.filter(r => r.model.category === filterCategory);
    }

    if (filterVerdict === 'runnable') {
      filtered = filtered.filter(r => r.verdict !== 'wont_run' && r.verdict !== 'barely_runs');
    } else if (filterVerdict === 'great') {
      filtered = filtered.filter(r => r.verdict === 'runs_great' || r.verdict === 'runs_ok');
    } else if (filterVerdict === 'slow') {
      filtered = filtered.filter(r => r.verdict === 'runs_slow' || r.verdict === 'barely_runs');
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'size': return b.model.parametersBillions - a.model.parametersBillions;
        case 'speed': return b.estimatedTPS - a.estimatedTPS;
        case 'memory': return a.totalMemoryGB - b.totalMemoryGB;
        default: {
          const vo: Record<string, number> = { runs_great: 0, runs_ok: 1, runs_slow: 2, barely_runs: 3, wont_run: 4 };
          const d = vo[a.verdict] - vo[b.verdict];
          return d !== 0 ? d : b.model.parametersBillions - a.model.parametersBillions;
        }
      }
    });

    return filtered;
  }, [results, sortBy, filterCategory, filterVerdict]);

  const stats = useMemo(() => {
    const great = results.filter(r => r.verdict === 'runs_great' || r.verdict === 'runs_ok').length;
    const slow = results.filter(r => r.verdict === 'runs_slow').length;
    const barely = results.filter(r => r.verdict === 'barely_runs').length;
    return { great, slow, barely, total: results.length };
  }, [results]);

  return (
    <div className="w-full space-y-6">
      {/* Summary with stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-nv-card border-2 border-nv-green/30 rounded-[2px] p-4 sm:p-5 space-y-4"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <BarChart3 className="w-5 h-5 text-nv-green flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] sm:text-[14px] font-medium text-white leading-relaxed">
              Sua maquina roda{' '}
              <span className="font-bold text-nv-green">{stats.great} modelos</span> com boa performance
              {stats.slow > 0 && <>, <span className="font-bold text-nv-yellow">{stats.slow}</span> de forma lenta</>}
              {stats.barely > 0 && <> e <span className="font-bold text-nv-red">{stats.barely}</span> com dificuldade</>}
              .
            </p>
            <p className="text-[10px] sm:text-[11px] text-nv-gray-500 font-mono mt-1">
              {stats.total} combinacoes analisadas | Dados atualizados do Hugging Face
            </p>
          </div>
        </div>

        {/* Quick stat counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-nv-black/50 border border-nv-gray-800 rounded-[2px] px-3 py-2 text-center">
            <div className="text-[18px] sm:text-[22px] font-black font-mono text-nv-green">{stats.great}</div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-nv-gray-500 mt-0.5">Bom+</div>
          </div>
          <div className="bg-nv-black/50 border border-nv-gray-800 rounded-[2px] px-3 py-2 text-center">
            <div className="text-[18px] sm:text-[22px] font-black font-mono text-nv-yellow">{stats.slow}</div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-nv-gray-500 mt-0.5">Lento</div>
          </div>
          <div className="bg-nv-black/50 border border-nv-gray-800 rounded-[2px] px-3 py-2 text-center">
            <div className="text-[18px] sm:text-[22px] font-black font-mono text-nv-red">{stats.barely}</div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-nv-gray-500 mt-0.5">Ruim</div>
          </div>
          <div className="bg-nv-black/50 border border-nv-gray-800 rounded-[2px] px-3 py-2 text-center">
            <div className="text-[18px] sm:text-[22px] font-black font-mono text-white">{stats.total}</div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-nv-gray-500 mt-0.5">Total</div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-nv-gray-500 uppercase tracking-wider">
          <Filter className="w-3 h-3" /> Tipo:
        </div>
        {(['all', 'general', 'code', 'reasoning', 'multilingual', 'vision'] as const).map(cat => (
          <FilterChip key={cat} active={filterCategory === cat} onClick={() => setFilterCategory(cat)}>
            {cat === 'all' ? 'Todos' : cat === 'general' ? 'Geral' : cat === 'code' ? 'Codigo' :
             cat === 'reasoning' ? 'Raciocinio' : cat === 'multilingual' ? 'Multi' : 'Visao'}
          </FilterChip>
        ))}

        <div className="w-px h-4 bg-nv-gray-700 mx-1" />

        <div className="flex items-center gap-1.5 text-[10px] font-bold text-nv-gray-500 uppercase tracking-wider">
          <ArrowUpDown className="w-3 h-3" /> Status:
        </div>
        {(['all', 'runnable', 'great', 'slow'] as const).map(v => (
          <FilterChip key={v} active={filterVerdict === v} onClick={() => setFilterVerdict(v)}>
            {v === 'all' ? 'Todos' : v === 'runnable' ? 'Rodaveis' : v === 'great' ? 'Otimos' : 'Lentos'}
          </FilterChip>
        ))}

        <div className="w-px h-4 bg-nv-gray-700 mx-1" />

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="bg-nv-near-black border border-nv-gray-700 rounded-[2px] px-2 py-1 text-[10px] font-bold uppercase text-nv-gray-400 outline-none focus:border-nv-green"
        >
          <option value="verdict">Performance</option>
          <option value="size">Tamanho</option>
          <option value="speed">Velocidade</option>
          <option value="memory">Memoria</option>
        </select>
      </div>

      {/* Results — responsive grid */}
      {processed.length === 0 ? (
        <div className="text-center py-12 text-nv-gray-500 text-[14px] font-medium">
          Nenhum modelo encontrado com os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
          {processed.map((result, i) => (
            <ResultCard
              key={`${result.model.id}-${result.quantization.id}`}
              result={result}
              specs={specs}
              contextLength={contextLength}
              index={i}
              parsedModel={parsedModels.get(result.model.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HardwareForm } from './components/HardwareForm';
import { ResultsPanel } from './components/ResultsPanel';
import { InfoSection } from './components/InfoSection';
import { BrandMark, Logo } from './components/Logo';
import { MODELS } from './data/models';
import { QUANTIZATIONS } from './data/quantizations';
import { getTopResults, type ModelResult, type HardwareSpecs } from './engine/calculator';
import { fetchAllModels, type ParsedModel } from './services/huggingface';
import { type LLMModel } from './data/models';

function convertParsedToLLM(parsed: ParsedModel): LLMModel {
  return {
    id: parsed.id,
    name: parsed.name,
    family: parsed.family,
    parametersBillions: parsed.parametersBillions,
    isMoE: parsed.isMoE,
    contextLength: parsed.contextLength,
    numLayers: parsed.numLayers,
    numKVHeads: parsed.numKVHeads,
    headDim: parsed.headDim,
    releaseYear: new Date(parsed.lastModified).getFullYear(),
    category: parsed.category,
    description: parsed.description,
  };
}

function App() {
  const [results, setResults] = useState<ModelResult[] | null>(null);
  const [specs, setSpecs] = useState<HardwareSpecs | null>(null);
  const [contextLength, setContextLength] = useState(8192);
  const [hfModels, setHfModels] = useState<ParsedModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelSource, setModelSource] = useState<'loading' | 'huggingface' | 'local'>('loading');
  const [parsedModelsMap, setParsedModelsMap] = useState<Map<string, ParsedModel>>(new Map());
  const resultsRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.97]);

  useEffect(() => {
    fetchAllModels()
      .then(models => {
        setHfModels(models);
        const map = new Map<string, ParsedModel>();
        for (const m of models) map.set(m.id, m);
        setParsedModelsMap(map);
        setModelSource('huggingface');
      })
      .catch(() => {
        setModelSource('local');
      })
      .finally(() => setIsLoadingModels(false));
  }, []);

  const getAllModels = useCallback((): LLMModel[] => {
    if (modelSource === 'huggingface' && hfModels.length > 0) {
      return hfModels.map(convertParsedToLLM);
    }
    return MODELS;
  }, [modelSource, hfModels]);

  const availableModelNames = useMemo(() => {
    return getAllModels().map(m => m.name);
  }, [getAllModels]);

  function handleAnalyze(newSpecs: HardwareSpecs, ctx: number, modelQuery: string) {
    let models = getAllModels();

    if (modelQuery) {
      const terms = modelQuery.toLowerCase().split(/\s+/);
      models = models.filter(m =>
        terms.every(t =>
          m.name.toLowerCase().includes(t) ||
          m.family.toLowerCase().includes(t) ||
          m.id.toLowerCase().includes(t)
        )
      );
    }

    const topResults = getTopResults(newSpecs, models, QUANTIZATIONS, ctx);
    setResults(topResults);
    setSpecs(newSpecs);
    setContextLength(ctx);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  const modelCount = modelSource === 'huggingface' ? hfModels.length : modelSource === 'loading' ? 0 : MODELS.length;
  const hasResults = results && specs;

  return (
    <div className="min-h-screen bg-nv-black grid-bg relative overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-nv-black/95 backdrop-blur-sm border-b-2 border-nv-gray-800">
        <div className="px-4 sm:px-6 lg:px-10 h-12 sm:h-14 flex items-center justify-between gap-4">
          {/* Mobile: just logo icon. Desktop: full brand */}
          <div className="hidden sm:block"><BrandMark /></div>
          <div className="sm:hidden"><Logo size="sm" /></div>

          <div className="flex items-center gap-2 sm:gap-4">
            {modelSource === 'loading' ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-nv-gray-500 flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-nv-green border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">CARREGANDO</span>
              </span>
            ) : (
              <>
                <span className="text-[10px] font-bold uppercase tracking-wider text-nv-green">{modelCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-nv-gray-500 hidden xs:inline">MODELOS</span>
                <span className="text-[10px] text-nv-gray-700">|</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-nv-gray-500">{QUANTIZATIONS.length} <span className="hidden sm:inline">QUANTS</span></span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.header style={{ opacity: heroOpacity, scale: heroScale }} className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-nv-green/20 via-nv-green/5 to-transparent" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-nv-green/10 to-transparent" />
        </div>

        <div className="relative px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border-2 border-nv-green rounded-[2px] px-3 sm:px-4 py-1 sm:py-1.5 mb-5 sm:mb-6"
          >
            <span className="w-1.5 h-1.5 bg-nv-green rounded-full animate-pulse-green" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-nv-green">
              Analise de hardware para IA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[72px] font-black tracking-tight leading-[1.05]"
          >
            <span className="text-white">CAN I RUN </span>
            <span className="text-gradient-green text-glow-green">LLM</span>
            <span className="text-nv-gray-500">?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-5 text-[14px] sm:text-[15px] md:text-[17px] text-nv-gray-300 max-w-2xl mx-auto leading-[1.6] font-medium px-2"
          >
            Descubra quais modelos de IA open-source rodam na sua maquina
            com estimativas de <span className="text-nv-green font-bold">velocidade</span> e <span className="text-nv-green font-bold">memoria</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 sm:mt-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 sm:h-10 mx-auto bg-gradient-to-b from-nv-green to-transparent"
            />
          </motion.div>
        </div>
      </motion.header>

      {/* Main content — form always in same tree position to preserve state */}
      <section ref={resultsRef} className="px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        <div className={`flex flex-col items-start ${hasResults ? 'xl:flex-row gap-6 lg:gap-8' : 'max-w-4xl mx-auto xl:max-w-none'}`}>
          {/* Form — sticky sidebar when results exist */}
          <div className={hasResults ? 'w-full xl:w-[400px] 2xl:w-[440px] xl:flex-shrink-0 xl:sticky xl:top-[64px] xl:max-h-[calc(100vh-80px)] xl:overflow-y-auto xl:dropdown-scroll' : 'w-full'}>
            <HardwareForm onAnalyze={handleAnalyze} isLoading={isLoadingModels} availableModels={availableModelNames} />
          </div>
          {/* Results */}
          {hasResults && (
            <div className="flex-1 min-w-0 w-full">
              <ResultsPanel results={results} specs={specs} contextLength={contextLength} parsedModels={parsedModelsMap} />
            </div>
          )}
        </div>
      </section>

      {/* Info */}
      <section className="px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
        <InfoSection />
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-nv-gray-800 py-6 sm:py-8 px-4 sm:px-6 lg:px-10 bg-nv-black">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandMark />
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-nv-gray-500 text-center">
            <span>Estimativas baseadas em benchmarks publicos</span>
            <span className="hidden sm:block text-nv-gray-700">|</span>
            <span>{modelSource === 'huggingface' ? 'Dados do Hugging Face API' : 'Dados locais'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

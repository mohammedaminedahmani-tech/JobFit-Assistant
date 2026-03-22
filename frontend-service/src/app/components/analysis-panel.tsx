import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, AlertCircle, TrendingUp, ChevronDown, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Structure de données synchronisée avec ton Backend Java
interface AnalysisData {
  score: number;
  status: string;
  recommendations: { type: 'strength' | 'improvement'; text: string }[];
}

interface AnalysisPanelProps {
  data: AnalysisData | null; // Les données réelles venant d'App.tsx
}

export function AnalysisPanel({ data }: AnalysisPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // État par défaut si aucun CV n'est encore uploadé
  const defaultData: AnalysisData = {
    score: 0,
    status: "En attente",
    recommendations: [
      { type: 'strength', text: 'Uploadez votre CV pour commencer l\'analyse.' }
    ]
  };

  const currentData = data || defaultData;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      <div className="p-6">
        {/* Header */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-6 flex w-full items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] shadow-lg shadow-[#8b5cf6]/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-white/90 group-hover:text-white transition-colors">
                Analyse IA Gemini
              </h2>
              <p className="text-sm text-white/50">Intelligence Artificielle</p>
            </div>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="p-2 rounded-lg bg-white/5">
            <ChevronDown className="h-5 w-5 text-white/60" />
          </motion.div>
        </button>

        {/* Score de compatibilité dynamique */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 p-5 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-white/40 mb-1">Compatibilité Profil</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-white">
                  {data ? data.score : '--'}
                </span>
                <span className="text-lg text-white/40">/100</span>
              </div>
            </div>
            
            {data && (
              <div className="flex items-center gap-2 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2">
                <TrendingUp className="h-5 w-5 text-[#10b981]" />
                <span className="text-sm font-bold text-[#10b981]">{data.status}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recommandations */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Points Clés</h3>
              
              {currentData.recommendations.map((rec, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 hover:bg-white/[0.07] transition-colors"
                >
                  <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                    rec.type === 'strength' ? 'bg-[#10b981]/20' : 'bg-[#f59e0b]/20'
                  }`}>
                    {rec.type === 'strength' ? 
                      <CheckCircle2 className="h-4 w-4 text-[#10b981]" /> : 
                      <AlertCircle className="h-4 w-4 text-[#f59e0b]" />
                    }
                  </div>
                  <p className="text-sm leading-relaxed text-white/70">{rec.text}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
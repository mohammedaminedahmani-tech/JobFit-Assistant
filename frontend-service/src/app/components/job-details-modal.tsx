import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, MapPin, ExternalLink, TrendingUp, Briefcase, Zap, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    title: string;
    company: string;
    location: string;
    matchScore: number;
    tags: string[];
    description: string;
    link: string;
  } | null;
  cvText?: string; // ✅ NOUVEAU : texte du CV pour le boost
}

interface BoostTip {
  type: 'add' | 'modify' | 'remove';
  text: string;
}

export function JobDetailsModal({ isOpen, onClose, job, cvText }: JobDetailsModalProps) {
  const [isBoostLoading, setIsBoostLoading] = useState(false);
  const [boostTips, setBoostTips] = useState<BoostTip[]>([]);
  const [showBoost, setShowBoost] = useState(false);

  if (!job) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-[#10b981] to-[#06b6d4]';
    if (score >= 60) return 'from-[#3b82f6] to-[#8b5cf6]';
    return 'from-[#f59e0b] to-[#ef4444]';
  };

  const getTipIcon = (type: string) => {
    if (type === 'add') return '➕';
    if (type === 'modify') return '✏️';
    return '🗑️';
  };

  const getTipColor = (type: string) => {
    if (type === 'add') return 'border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]';
    if (type === 'modify') return 'border-[#3b82f6]/30 bg-[#3b82f6]/10 text-[#3b82f6]';
    return 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]';
  };

  // ✅ Appel au backend pour le boost IA
  const handleBoost = async () => {
    setIsBoostLoading(true);
    setShowBoost(true);
    setBoostTips([]);

    try {
      const response = await fetch('/api/analysis/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: cvText || "CV non fourni",
          jobTitle: job.title,
          jobDescription: job.description,
          jobCompany: job.company,
        }),
      });

      if (!response.ok) throw new Error("Erreur boost");

      const data = await response.json();
      setBoostTips(data.tips || []);

    } catch (error) {
      setBoostTips([
        { type: 'modify', text: "Erreur de connexion. Vérifiez que le backend est lancé." }
      ]);
    } finally {
      setIsBoostLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl"
            >
              <button
                onClick={onClose}
                className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-[#ef4444] hover:bg-[#ef4444]/20 group"
              >
                <X className="h-5 w-5 text-white/60 group-hover:text-[#ef4444]" />
              </button>

              <div className="max-h-[90vh] overflow-y-auto p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white pr-10"
                      >
                        {job.title}
                      </motion.h2>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${getScoreColor(job.matchScore)} shadow-lg shadow-black/40`}>
                        <span className="text-2xl font-bold text-white">{job.matchScore}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#10b981]">
                        <TrendingUp className="h-3 w-3" />
                        <span>Compatibilité</span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                      <Building2 className="h-5 w-5 text-[#3b82f6]" />
                      <div>
                        <p className="text-[10px] uppercase text-white/40">Entreprise</p>
                        <p className="text-sm font-medium text-white/90">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                      <MapPin className="h-5 w-5 text-[#8b5cf6]" />
                      <div>
                        <p className="text-[10px] uppercase text-white/40">Localisation</p>
                        <p className="text-sm font-medium text-white/90">{job.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags?.map((tag, i) => (
                      <span key={i} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Description */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[#3b82f6]" />
                    <h3 className="text-lg font-semibold text-white/90">Détails de l'offre</h3>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
                      {job.description || "Aucune description disponible."}
                    </p>
                  </div>
                </div>

                {/* ✅ SECTION BOOST IA */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#f59e0b]" />
                      <h3 className="text-lg font-semibold text-white/90">Booster mon CV pour cette offre</h3>
                    </div>
                    <button
                      onClick={handleBoost}
                      disabled={isBoostLoading}
                      className="flex items-center gap-2 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-5 py-2.5 text-sm font-semibold text-[#f59e0b] transition-all hover:bg-[#f59e0b]/20 disabled:opacity-50"
                    >
                      {isBoostLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                      {isBoostLoading ? "Analyse en cours..." : "Analyser avec l'IA"}
                    </button>
                  </div>

                  {/* Conseils IA */}
                  {showBoost && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {isBoostLoading ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-[#f59e0b]" />
                          <p className="text-white/40 text-sm">L'IA analyse votre CV vs cette offre...</p>
                        </div>
                      ) : boostTips.length > 0 ? (
                        boostTips.map((tip, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex items-start gap-3 rounded-xl border p-4 ${getTipColor(tip.type)}`}
                          >
                            <span className="text-lg flex-shrink-0">{getTipIcon(tip.type)}</span>
                            <p className="text-sm leading-relaxed">{tip.text}</p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                          <p className="text-white/40 text-sm">Aucun conseil disponible.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#3b82f6]/30 transition-all hover:scale-[1.02]"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Postuler maintenant</span>
                  </a>
                  <button
                    onClick={onClose}
                    className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium text-white/80 transition-all hover:bg-white/10"
                  >
                    Retour à la liste
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[#3b82f6]/10 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[#8b5cf6]/10 blur-[100px]" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
import { motion } from 'motion/react';
import { Building2, MapPin, TrendingUp, Bookmark, Zap } from 'lucide-react';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  tags?: string[];
  index: number;
  onViewDetails: () => void;
  onBoostCompatibility: () => void; // ✅ NOUVEAU
}

export function JobCard({
  title,
  company,
  location,
  matchScore,
  tags = [],
  index,
  onViewDetails,
  onBoostCompatibility, // ✅ NOUVEAU
}: JobCardProps) {

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-[#10b981] to-[#06b6d4]';
    if (score >= 60) return 'from-[#3b82f6] to-[#8b5cf6]';
    return 'from-[#f59e0b] to-[#ef4444]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-[#3b82f6]/40 hover:bg-white/[0.08]"
    >
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-semibold leading-snug text-white/90 group-hover:text-white transition-colors">
              {title}
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Building2 className="h-4 w-4 text-[#3b82f6]" />
                <span className="font-medium">{company}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <MapPin className="h-4 w-4 text-[#8b5cf6]" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${getScoreColor(matchScore)} shadow-lg shadow-black/20 transition-transform group-hover:scale-105`}>
              <span className="text-xl font-bold text-white">{matchScore}%</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#10b981]">
              <TrendingUp className="h-3 w-3" />
              <span>Match</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tags.length > 0 ? tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="rounded-lg border border-white/5 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm">
              {tag}
            </span>
          )) : (
            <span className="text-[11px] text-white/30 italic">Analyse des technos en cours...</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4 gap-3">
          <button
            onClick={onViewDetails}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#3b82f6]/20 transition-all hover:shadow-lg hover:shadow-[#3b82f6]/40 active:scale-95"
          >
            Voir les détails
          </button>

          {/* ✅ NOUVEAU BOUTON */}
          <button
            onClick={onBoostCompatibility}
            className="flex items-center gap-2 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-5 py-2.5 text-sm font-semibold text-[#f59e0b] transition-all hover:bg-[#f59e0b]/20 hover:border-[#f59e0b]/60 active:scale-95"
          >
            <Zap className="h-4 w-4" />
            Booster mon CV
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-[#3b82f6] hover:bg-white/10 group/btn">
            <Bookmark className="h-4 w-4 text-white/40 group-hover/btn:text-[#3b82f6]" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#3b82f6]/10 blur-[60px]" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#8b5cf6]/10 blur-[60px]" />
      </div>
    </motion.div>
  );
}
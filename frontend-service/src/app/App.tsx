import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  BriefcaseIcon,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
} from "lucide-react";

import { CVUploadZone } from "./components/cv-upload-zone";
import { JobCard } from "./components/job-card";
import { AnalysisPanel } from "./components/analysis-panel";
import { SearchBar } from "./components/search-bar";
import { JobDetailsModal } from "./components/job-details-modal";

interface JobOffer {
  title: string;
  company: string;
  location: string;
  description: string;
  link: string;
  matchScore?: number;
  tags?: string[];
}

interface AnalysisResult {
  score: number;
  status: string;
  mainSkill?: string;
  allSkills?: string[];
  recommendations: { type: 'strength' | 'improvement'; text: string }[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMainContent, setShowMainContent] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastKeyword, setLastKeyword] = useState("développeur");
  const [lastLocation, setLastLocation] = useState("Maroc");

  // ✅ NOUVEAU : stocker le texte brut du CV pour le boost
  const [cvText, setCvText] = useState<string>("");

  const loadJobsFromBackend = async (
    keyword: string = lastKeyword,
    location: string = lastLocation,
    page: number = 1
  ) => {
    setIsLoading(true);
    setHasSearched(true);
    setLastKeyword(keyword);
    setLastLocation(location);

    try {
      const response = await fetch(
        `/api/jobs/scrape?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}&page=${page}`
      );
      if (!response.ok) throw new Error("Erreur lors du scraping");
      const data = await response.json();
      const formattedJobs = data.map((job: any) => ({
        title: job.title || "Développeur",
        company: job.company || "Entreprise",
        location: job.location || location,
        description: job.description || "Consultez le lien pour plus de détails.",
        link: job.link || "#",
        matchScore: job.matchScore || Math.floor(Math.random() * 20) + 75,
        tags: job.tags || ["Tech", keyword],
      }));
      setJobs(formattedJobs);
    } catch (error) {
      console.error("Erreur de connexion :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisComplete = (result: AnalysisResult & { cvText?: string }) => {
    setAnalysis(result);
    // ✅ Stocker le texte du CV reçu depuis le backend
    if (result.cvText) setCvText(result.cvText);
    if (result.mainSkill) {
      setCurrentPage(1);
      loadJobsFromBackend(result.mainSkill, lastLocation, 1);
    }
  };

  const goToNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadJobsFromBackend(lastKeyword, lastLocation, nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      loadJobsFromBackend(lastKeyword, lastLocation, prevPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToHomePage = () => {
    setCurrentPage(1);
    setShowMainContent(true);
    setHasSearched(false);
    setJobs([]);
  };

  const handleViewDetails = (job: JobOffer) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedJob(null), 300);
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-40 top-20 h-96 w-96 animate-pulse rounded-full bg-[#3b82f6]/10 blur-3xl" />
        <div className="absolute -right-40 top-40 h-96 w-96 animate-pulse rounded-full bg-[#8b5cf6]/10 blur-3xl" />
      </div>

      {/* ✅ Passage du cvText à la modale */}
      <JobDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        job={selectedJob as any}
        cvText={cvText}
      />

      <div className="relative z-10">
        <header className="border-b border-white/5 backdrop-blur-xl sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-lg shadow-[#3b82f6]/30">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">JobFit Assistant</h1>
                  <p className="text-sm text-white/50">Analyse de carrière par IA</p>
                </div>
              </motion.div>

              <div className="flex items-center gap-3">
                {!showMainContent && (
                  <button
                    onClick={goToHomePage}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                  >
                    <Home className="h-4 w-4" />
                    <span>Accueil</span>
                  </button>
                )}
                <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:text-white">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:text-white">
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {showMainContent && (
              <motion.div
                key="main-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <CVUploadZone onAnalysisComplete={handleAnalysisComplete} />

                {analysis?.allSkills && analysis.allSkills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 flex-wrap"
                  >
                    <span className="text-white/40 text-sm">Compétences détectées :</span>
                    {analysis.allSkills.map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(1);
                          loadJobsFromBackend(skill, lastLocation, 1);
                        }}
                        className="rounded-full bg-[#3b82f6]/20 px-3 py-1 text-xs text-[#3b82f6] hover:bg-[#3b82f6]/40 transition-colors cursor-pointer border border-[#3b82f6]/30"
                      >
                        🔍 {skill}
                      </button>
                    ))}
                  </motion.div>
                )}

                <SearchBar
                  onSearch={(query, loc) => {
                    setCurrentPage(1);
                    loadJobsFromBackend(query, loc, 1);
                  }}
                />

                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-1">
                    <AnalysisPanel data={analysis} />
                  </div>

                  <div className="lg:col-span-2">
                    <div className="mb-6 flex items-center gap-3">
                      <BriefcaseIcon className="h-6 w-6 text-[#3b82f6]" />
                      <h2 className="text-xl font-semibold text-white/90">Offres en direct</h2>
                      {hasSearched && (
                        <span className="rounded-full bg-[#3b82f6]/20 px-3 py-1 text-xs text-[#3b82f6]">
                          {jobs.length} offres — page {currentPage}
                        </span>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-[#3b82f6]" />
                        <p className="text-white/40">Recherche de "{lastKeyword}" — page {currentPage}...</p>
                      </div>
                    ) : !hasSearched ? (
                      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-5xl">🔍</p>
                        <p className="text-white/60 font-medium text-lg">Lancez votre recherche</p>
                        <p className="text-white/30 text-sm text-center max-w-xs">
                          Uploadez votre CV pour une recherche automatique, ou entrez un mot-clé manuellement
                        </p>
                      </div>
                    ) : jobs.length > 0 ? (
                      <div className="grid gap-6">
                        {jobs.map((job, index) => (
                          <JobCard
                            key={index}
                            {...job}
                            matchScore={job.matchScore ?? 75}
                            index={index}
                            onViewDetails={() => handleViewDetails(job)}
                            // ✅ NOUVEAU : ouvre la modale directement sur le boost
                            onBoostCompatibility={() => {
                              setSelectedJob(job);
                              setIsModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-5xl">😕</p>
                        <p className="text-white/40">Aucune offre pour "{lastKeyword}"</p>
                        <p className="text-white/20 text-sm">Essayez un autre mot-clé</p>
                      </div>
                    )}

                    {hasSearched && !isLoading && (
                      <div className="mt-8 flex items-center justify-between">
                        <button
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 disabled:opacity-20 hover:border-[#3b82f6] transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                          <span>Précédent</span>
                        </button>
                        <span className="text-white/30 text-sm">Page {currentPage}</span>
                        <button
                          onClick={goToNextPage}
                          disabled={jobs.length < 5}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] px-6 py-3 shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                          <span>Suivant</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
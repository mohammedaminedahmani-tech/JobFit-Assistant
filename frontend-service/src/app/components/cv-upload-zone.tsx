import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';

interface CVUploadZoneProps {
  onAnalysisComplete: (data: any) => void;
}

export function CVUploadZone({ onAnalysisComplete }: CVUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- LOGIQUE D'ENVOI AU BACKEND JAVA ---
  const uploadToBackend = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', "Analyse globale du profil pour recherche d'emploi.");

    try {
      const response = await fetch('/api/analysis/cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'analyse");
      
      // On récupère le JSON envoyé par Gemini via Spring Boot
      const result = await response.json(); 
      console.log("Analyse Gemini réussie :", result);
      
      setUploadedFile(file.name);
      
      // On transmet le résultat à l'état global (App.tsx)
      onAnalysisComplete(result); 
      
    } catch (error) {
      console.error("Erreur d'upload :", error);
      alert("Erreur lors de l'analyse du CV par l'IA. Vérifiez que votre backend est lancé.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      uploadToBackend(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadToBackend(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative overflow-hidden rounded-[24px] border transition-all duration-300 ${
        isDragging
          ? 'border-[#3b82f6] bg-[#3b82f6]/10 backdrop-blur-xl'
          : 'border-white/10 bg-white/5 backdrop-blur-xl'
      } ${isUploading ? 'opacity-80' : 'opacity-100'}`}
    >
      <div className="p-10">
        <label htmlFor="file-upload" className={`block ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <div className="flex flex-col items-center justify-center gap-6">
            <motion.div
              animate={{
                y: isDragging ? -10 : 0,
                scale: isDragging ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {isUploading ? (
                <div className="rounded-2xl bg-[#3b82f6]/20 p-5 ring-1 ring-[#3b82f6]/50">
                  <Loader2 className="h-10 w-10 text-[#3b82f6] animate-spin" />
                </div>
              ) : uploadedFile ? (
                <div className="rounded-2xl bg-gradient-to-br from-[#10b981] to-[#06b6d4] p-5 shadow-lg shadow-[#10b981]/20">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] p-5 shadow-lg shadow-[#3b82f6]/20">
                  <Upload className="h-10 w-10 text-white" />
                </div>
              )}
            </motion.div>

            {isUploading ? (
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-white">Analyse IA en cours</p>
                <p className="text-sm text-white/40 animate-pulse">Gemini parcourt vos compétences...</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-6 py-3 border border-white/10 backdrop-blur-md">
                  <FileText className="h-5 w-5 text-[#3b82f6]" />
                  <span className="text-sm font-medium text-white/90">{uploadedFile}</span>
                </div>
                <p className="text-xs text-[#10b981] font-medium">Analyse terminée avec succès</p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-xl font-medium text-white/90">
                  Déposez votre CV ou <span className="text-[#3b82f6] hover:underline">parcourez</span>
                </p>
                <p className="text-sm text-white/40">
                  Format PDF uniquement • Max 5MB
                </p>
              </div>
            )}
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileInput}
            disabled={isUploading}
          />
        </label>
      </div>
      
      {/* Overlay visuel de chargement progressif */}
      {isUploading && (
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
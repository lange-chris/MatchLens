"use client";

import Link from "next/link";
import { PrintButton } from "@/components/ui/PrintButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScoreRadar } from "@/components/ui/ScoreRadar";

export function ResultsClient({ candidate, details }: { candidate: any, details: any }) {
  const { t } = useLanguage();

  const skillsMatched = details?.skills?.matched || ["Baseline verification"];
  const skillsMissing = details?.skills?.missing || ["None detected"];
  const experiencePoints = details?.experience?.points || ["Awaiting detailed telemetry."];
  const academicHighlights = details?.academicHighlights || [];
  const matchExplanation = details?.matchExplanation || "Matching algorithm executed. Detailed explainability metrics not available for this run.";

  return (
    <div className="animate-fade-in pb-20 max-w-6xl mx-auto">
      <header className="mb-6 border-b border-border pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-muted hover:bg-border transition-colors print:hidden">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-main">Match Results</h1>
        </div>
        <div className="flex gap-2">
           <PrintButton />
           {candidate.cv_url && (
             <a href={candidate.cv_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded shadow-sm hover:shadow-md transition-all">
               View PDF
             </a>
           )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="material-card p-8 mb-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-primary/5 to-transparent">
          {/* Circular Score Indicator */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#00BCD4" strokeWidth="8"
                strokeDasharray={`${candidate.score * 2.827} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000 origin-center"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-black text-text-main">{candidate.score}%</span>
              <span className="text-[10px] font-bold uppercase text-primary">Match</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <h2 className="text-3xl font-display font-black text-text-main truncate w-full" title={candidate.name}>{candidate.name}</h2>
            <p className="text-lg text-text-muted truncate w-full">{candidate.job_title}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Detail Breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <section className="material-card p-6 border-l-4 border-secondary">
            <h3 className="text-sm font-bold uppercase text-secondary mb-4 flex items-center gap-2 border-b border-border pb-2">
              <span className="material-symbols-outlined">psychology</span> {t.results.explainableAIBreakdown}
            </h3>
            <div className="bg-background p-4 rounded-xl">
               <p className="text-sm text-text-main leading-relaxed font-medium mb-3">
                 {candidate.analysis_summary}
               </p>
               <div className="flex gap-2 items-start mt-4 pt-4 border-t border-border">
                 <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                 <p className="text-xs text-text-muted italic leading-relaxed">
                   {matchExplanation}
                 </p>
               </div>
            </div>
          </section>

          <section className="material-card p-6">
            <h3 className="text-sm font-bold uppercase text-primary mb-6 flex items-center gap-2 border-b border-border pb-2">
              <span className="material-symbols-outlined">checklist</span> {t.results.capabilitiesCheck}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Matched */}
              <div>
                <p className="text-xs font-bold text-text-muted uppercase mb-3 border-b border-border pb-1">{t.results.verifiedSkills}</p>
                <div className="flex flex-col gap-2">
                  {skillsMatched.map((skill: string) => (
                    <div key={skill} className="flex items-center gap-2 text-sm text-text-main bg-background px-3 py-2 rounded">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span> {skill}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Missing */}
              <div>
                <p className="text-xs font-bold text-text-muted uppercase mb-3 border-b border-border pb-1">{t.results.missingGaps}</p>
                <div className="flex flex-col gap-2">
                  {skillsMissing.map((skill: string) => (
                    <div key={skill} className="flex items-center gap-2 text-sm text-text-main bg-background px-3 py-2 rounded">
                      <span className="material-symbols-outlined text-secondary text-sm">cancel</span> {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="material-card p-6">
             <h3 className="text-sm font-bold uppercase text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
               <span className="material-symbols-outlined">work_history</span> {t.results.experienceAlignment}
             </h3>
             <ul className="space-y-3">
                {experiencePoints.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                     <span className="material-symbols-outlined text-text-muted mt-0.5 text-sm">arrow_right</span>
                     <p className="text-sm text-text-main">{point}</p>
                  </li>
                ))}
             </ul>
          </section>

        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="material-card p-6 border-t-4 border-secondary shadow-sm rounded-2xl">
            <h3 className="text-sm font-bold uppercase text-secondary mb-4 flex items-center gap-2 border-b border-border pb-2">
               <span className="material-symbols-outlined">radar</span> {t.results.matchDimensions}
            </h3>
            <ScoreRadar categoryScores={details?.category_scores} overallScore={candidate.score} />
          </div>

          <div className="material-card p-6 border-t-4 border-primary shadow-sm rounded-2xl">
            <h3 className="text-sm font-bold uppercase text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
               <span className="material-symbols-outlined">school</span> {t.results.academicProfile}
            </h3>
            <ul className="space-y-4">
              {Array.isArray(academicHighlights) && academicHighlights.length > 0 ? academicHighlights.map((highlight: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-text-main items-start bg-background p-3 rounded-xl border border-black/5 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-base flex-shrink-0">workspace_premium</span>
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              )) : (
                <li className="text-sm text-text-muted italic bg-background p-3 rounded-xl">
                   {t.results.noAcademicHighlights}
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

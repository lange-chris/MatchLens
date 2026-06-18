"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { mockJobs, JobListing } from "@/data/mockJobs";
import { createClient } from "@/utils/supabase/client";
import { ScoreRadar } from "@/components/ui/ScoreRadar";

export default function JobSearchPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCvUrl, setSelectedCvUrl] = useState<string>("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<Record<string, any>>({});
  const [selectedJobIdForRadar, setSelectedJobIdForRadar] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchCandidates() {
      const { data, error } = await supabase
        .from('candidates')
        .select('id, name, cv_url, created_at, job_title')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        const uniqueCandidates = Array.from(new Map(data.filter(c => c.cv_url).map(item => [item.cv_url, item])).values());
        setCandidates(uniqueCandidates);
      }
    }
    fetchCandidates();
  }, [supabase]);

  const handleRunMatch = async () => {
    if (!selectedCvUrl) return;
    
    setIsMatching(true);
    setMatchResults({});
    
    try {
      const res = await fetch('/api/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cvUrl: selectedCvUrl, 
          jobs: mockJobs,
          language: 'de' 
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMatchResults(data.matches || {});
    } catch (err) {
      console.error("Match failed", err);
      alert("Failed to calculate matches. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  const selectedJobDetail = selectedJobIdForRadar ? matchResults[selectedJobIdForRadar] : null;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-[40px] font-display font-medium text-[#1a1235] mb-6">Job search</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
           <div className="flex-1 w-full">
             <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Your Search Profile (CV)</label>
             <select 
               className="w-full bg-background border border-border rounded p-2.5 text-sm text-text-main focus:outline-none focus:border-secondary transition-all"
               value={selectedCvUrl}
               onChange={(e) => setSelectedCvUrl(e.target.value)}
             >
               <option value="" disabled>-- Select your CV to see Matches --</option>
               {candidates.map((c) => (
                 <option key={c.id} value={c.cv_url}>
                   {c.name} - {c.job_title}
                 </option>
               ))}
             </select>
           </div>
           <button 
             onClick={handleRunMatch}
             disabled={!selectedCvUrl || isMatching}
             className="w-full md:w-auto px-6 py-2.5 bg-secondary text-white font-bold rounded shadow-sm hover:shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 h-full mt-auto"
           >
             {isMatching ? <span className="material-symbols-outlined animate-spin text-sm">refresh</span> : <span className="material-symbols-outlined text-sm">auto_awesome</span>}
             {isMatching ? 'Matching...' : 'Show Match Scores'}
           </button>
        </div>
      </header>

      <div className="mb-8">
        {/* Search Bar */}
        <div className="flex bg-white rounded-full border border-border overflow-hidden shadow-sm mb-4">
          <input 
            type="text" 
            placeholder="Keyword, field or subject, position, location" 
            className="flex-1 px-6 py-4 text-base text-text-main focus:outline-none"
            readOnly
          />
          <button className="bg-[#2D1B4E] text-white w-12 flex items-center justify-center transition-colors hover:bg-opacity-90">
            <span className="material-symbols-outlined text-sm">search</span>
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4">
          <select className="flex-1 bg-white border border-border rounded p-2 text-sm text-text-muted focus:outline-none appearance-none" disabled>
            <option>Type of employer</option>
          </select>
          <select className="flex-1 bg-white border border-border rounded p-2 text-sm text-text-muted focus:outline-none appearance-none" disabled>
            <option>Working hours</option>
          </select>
          <select className="flex-1 bg-white border border-border rounded p-2 text-sm text-text-muted focus:outline-none appearance-none" disabled>
            <option>Contract type</option>
          </select>
          <button className="bg-white border border-border rounded p-2 text-text-main hover:bg-black/5 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">filter_alt</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
        <p className="text-sm font-bold text-[#1a1235]">All job offers matching your search</p>
        <span className="material-symbols-outlined text-text-muted text-sm">swap_vert</span>
      </div>

      <div className="flex flex-col gap-4">
        {mockJobs.map((job, index) => {
           const match = matchResults[job.id];
           
           return (
             <Fragment key={job.id}>
             <div className="bg-white border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-visible group">
               {/* academics Logo Placeholder */}
               <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 border border-border rounded flex items-center justify-center font-bold text-primary flex-shrink-0 bg-background text-lg">
                    {job.logoInitial}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-[#1a1235] hover:underline cursor-pointer transition-colors leading-tight">
                      {job.title}
                    </h2>
                    <p className="text-sm text-text-muted mt-1.5">{job.employer}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-[#f0f0f0] px-2.5 py-1 rounded text-xs text-text-main font-bold">{job.location}</span>
                      {job.employmentType.map((type) => (
                         <span key={type} className="bg-[#f0f0f0] px-2.5 py-1 rounded text-xs text-text-main font-bold">{type}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between h-full min-h-[80px]">
                     <span className="material-symbols-outlined text-text-muted hover:text-[#2D1B4E] cursor-pointer text-[26px] mt-[-4px]">star_border</span>
                     <span className="text-sm text-text-muted">{job.datePosted}</span>
                  </div>
               </div>

               {/* Match Score Injection */}
               {match && (
                 <div className="mt-5 pt-4 border-t border-border flex items-center justify-between bg-secondary/5 -mx-6 -mb-6 px-6 py-4 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" strokeWidth="8" />
                          <circle 
                            cx="50" cy="50" r="45" fill="none" stroke="#9333ea" strokeWidth="8"
                            strokeDasharray={`${match.score * 2.827} 283`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 origin-center"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xs font-black text-secondary">{match.score}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-base font-bold text-secondary flex items-center gap-1">
                           <span className="material-symbols-outlined text-sm">psychology</span> Match-Analyse
                        </p>
                        <p className="text-sm text-text-main font-medium max-w-2xl line-clamp-2 mt-1">
                          {match.analysis_summary}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setSelectedJobIdForRadar(selectedJobIdForRadar === job.id ? null : job.id)}
                        className={`px-4 py-2 border transition-colors text-xs font-bold rounded-full flex items-center gap-1 flex-shrink-0 shadow-sm ${
                          selectedJobIdForRadar === job.id 
                            ? 'bg-secondary text-white border-secondary' 
                            : 'bg-white border-secondary text-secondary hover:bg-secondary hover:text-white'
                        }`}
                      >
                        Radar <span className="material-symbols-outlined text-xs">radar</span>
                      </button>

                      {/* Floating Popover to the right */}
                      {selectedJobIdForRadar === job.id && (
                        <div className="absolute left-[calc(100%+24px)] top-1/2 -translate-y-1/2 z-50 w-[400px] bg-white rounded-2xl shadow-2xl border border-border p-6 animate-fade-in origin-left before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:-left-3 before:border-[6px] before:border-transparent before:border-r-white">
                           <button 
                             onClick={() => setSelectedJobIdForRadar(null)}
                             className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-background text-text-muted hover:text-text-main transition-colors"
                           >
                             <span className="material-symbols-outlined">close</span>
                           </button>
                           
                           <h2 className="text-xl font-bold text-secondary mb-2 flex items-center gap-2">
                             <span className="material-symbols-outlined">radar</span> Match-Radar
                           </h2>
                           <p className="text-sm text-text-main font-medium mb-4 bg-secondary/5 p-4 rounded-xl border border-secondary/20">
                             {match.analysis_summary}
                           </p>
                           
                           <div className="flex justify-center border border-border rounded-xl p-2 bg-background/50 h-64">
                             <ScoreRadar categoryScores={match.category_scores} overallScore={match.score} />
                           </div>
                        </div>
                      )}
                    </div>
                 </div>
               )}
             </div>
             {/* Inject Banner after 3rd job */}
             {index === 2 && (
               <div key="banner" className="bg-[#7BA79B] rounded-xl p-6 shadow-sm flex items-center justify-between text-white mt-2">
                 <div className="flex items-center gap-4">
                   <div className="text-4xl font-bold opacity-30">ML</div>
                   <div>
                     <h3 className="text-lg font-bold">Not found anything suitable yet?</h3>
                     <p className="text-sm">Receive future openings by job mail!</p>
                   </div>
                 </div>
                 <button className="bg-white text-[#7BA79B] px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-opacity-90 transition-colors">
                   Subscribe to search <span className="material-symbols-outlined text-sm align-middle ml-1">notifications</span>
                 </button>
               </div>
             )}
           </Fragment>
           );
        })}
      </div>

      {/* Modal removed in favor of inline popover */}
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { AnalyticsFilterBar } from "@/components/ui/AnalyticsFilterBar";

export default async function AnalyticsPage({ searchParams }: { searchParams: any }) {
  const p = await searchParams;
  const filterJob = p?.job || "all";
  const filterScore = parseInt(p?.score || "0", 10);
  const scoreMin = p?.scoreMin ? parseInt(p.scoreMin, 10) : null;
  const scoreMax = p?.scoreMax ? parseInt(p.scoreMax, 10) : null;

  const supabase = createClient();
  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  let allEntries = candidates || [];
  
  // Get all unique job titles for filter dropdown
  const allJobTitles = Array.from(new Set(allEntries.map(c => c.job_title))).filter(Boolean);

  // Apply Global Filters
  let entries = [...allEntries];
  if (filterJob !== "all") {
    entries = entries.filter(c => c.job_title === filterJob);
  }
  if (filterScore > 0) {
    entries = entries.filter(c => (c.score || 0) >= filterScore);
  }
  if (scoreMin !== null && scoreMax !== null) {
    entries = entries.filter(c => (c.score || 0) >= scoreMin && (c.score || 0) <= scoreMax);
  }

  // --- DATA AGGREGATION ---
  
  const totalAnalyzed = entries.length;
  const avgScore = totalAnalyzed > 0 
    ? (entries.reduce((acc, c) => acc + (c.score || 0), 0) / totalAnalyzed).toFixed(1)
    : "0";
  const highPotentials = entries.filter(c => (c.score || 0) >= 90).length;

  // Aggregate Skills
  const matchedSkillsMap: Record<string, number> = {};
  const missingSkillsMap: Record<string, number> = {};

  entries.forEach(c => {
    // Safe parsing of analysis_details
    let details = c.analysis_details;
    if (typeof details === 'string') {
      try { details = JSON.parse(details); } catch (e) { details = {}; }
    }

    const matched = details?.skills?.matched || [];
    const missing = details?.skills?.missing || [];

    matched.forEach((s: string) => {
        if (s !== "General competency found") {
            matchedSkillsMap[s] = (matchedSkillsMap[s] || 0) + 1;
        }
    });
    missing.forEach((s: string) => {
        if (s !== "No specific missing criteria identified") {
            missingSkillsMap[s] = (missingSkillsMap[s] || 0) + 1;
        }
    });
  });

  const topMatched = Object.entries(matchedSkillsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  
  const topMissing = Object.entries(missingSkillsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const bins = [0, 0, 0, 0, 0]; // 0-20, 21-40, 41-60, 61-80, 81-100
  const binRanges = [[0, 20], [21, 40], [41, 60], [61, 80], [81, 100]];
  
  // Important: aggregation for the heatmap should use the CURRENTLY filtered dataset 
  // OR the globally filtered dataset? Usually we want the heatmap to show the current context.
  entries.forEach(c => {
    const score = c.score || 0;
    const binIdx = Math.min(Math.floor(score / 20.01), 4);
    bins[binIdx]++;
  });

  const binLabels = ["0-20%", "21-40%", "41-60%", "61-80%", "81-100%"];
  const maxBinValue = Math.max(...bins, 1);

  return (
    <div className="animate-fade-in pb-20 max-w-full px-2">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-text-main tracking-tight">Recruitment Analytics</h1>
          <p className="text-sm text-text-muted mt-1">Intelligence and trends from processed matching operations.</p>
        </div>
      </header>

      <AnalyticsFilterBar jobTitles={allJobTitles} />

      {/* KPI Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="material-card p-6 border-l-4 border-primary bg-gradient-to-br from-primary/5 to-transparent">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Pipeline Volume</p>
          <p className="text-4xl font-display font-black text-text-main">{totalAnalyzed}</p>
          <p className="text-xs text-text-muted mt-2 font-medium">Candidates Analyzed Total</p>
        </div>
        <div className="material-card p-6 border-l-4 border-secondary bg-gradient-to-br from-secondary/5 to-transparent">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Quality Benchmark</p>
          <p className="text-4xl font-display font-black text-text-main">{avgScore}%</p>
          <p className="text-xs text-text-muted mt-2 font-medium">Average Match Accuracy</p>
        </div>
        <div className="material-card p-6 border-l-4 border-accent bg-gradient-to-br from-accent/5 to-transparent">
          <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">High Potentials</p>
          <p className="text-4xl font-display font-black text-text-main">{highPotentials}</p>
          <p className="text-xs text-text-muted mt-2 font-medium">Scores Above 90% Match</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Matched Skills Bar Chart */}
        <section className="material-card p-8">
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-8 uppercase tracking-wide">
             <span className="material-symbols-outlined text-primary">verified</span> Top Found Developer Skills
          </h2>
          <div className="space-y-5">
            {topMatched.length > 0 ? topMatched.map(([skill, count]) => {
                const percentage = (count / totalAnalyzed) * 100;
                return (
                    <div key={skill} className="group">
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-sm font-bold text-text-main capitalize">{skill}</span>
                            <span className="text-xs font-bold text-text-muted">{count} Applicants</span>
                        </div>
                        <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-border shadow-inner">
                            <div 
                                className="h-full bg-primary shadow-[0_0_10px_rgba(0,188,212,0.4)] transition-all duration-1000 ease-out origin-left"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                )
            }) : (
                <p className="text-center text-text-muted py-10 italic">Not enough data to calculate skill trends.</p>
            )}
          </div>
        </section>

        {/* Missing Skills (The "Gap" Analysis) */}
        <section className="material-card p-8 bg-surface/50 border-dashed">
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-8 uppercase tracking-wide">
             <span className="material-symbols-outlined text-secondary">warning</span> Highest Skill Scarcity
          </h2>
          <div className="space-y-5">
            {topMissing.length > 0 ? topMissing.map(([skill, count]) => {
                const percentage = (count / totalAnalyzed) * 100;
                return (
                    <div key={skill} className="group">
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-sm font-bold text-text-main capitalize">{skill}</span>
                            <span className="text-xs font-bold text-secondary">{count} Gaps Flagged</span>
                        </div>
                        <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-border shadow-inner">
                            <div 
                                className="h-full bg-secondary shadow-[0_0_8px_rgba(255,64,129,0.3)] transition-all duration-1000 ease-out origin-left"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                )
            }) : (
                <p className="text-center text-text-muted py-10 italic">No significant talent gaps identified yet.</p>
            )}
          </div>
        </section>

        {/* Score Distribution (Heatmap style histogram) */}
        <section className="lg:col-span-2 material-card p-8">
           <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-10 uppercase tracking-wide border-b border-border pb-4 w-full">
              <span className="material-symbols-outlined text-text-muted">bar_chart_4_bars</span> Score Distribution Heatmap
           </h2>
           <div className="flex items-stretch justify-between gap-4 h-64 px-4 bg-background/50 rounded-xl border border-border/50 pt-10 pb-2">
              {bins.map((val, i) => {
                  const height = (val / maxBinValue) * 100;
                  const range = binRanges[i];
                  const isActive = scoreMin === range[0] && scoreMax === range[1];
                  
                  // Build query params for the link
                  const query = new URLSearchParams();
                  if (filterJob !== "all") query.set("job", filterJob);
                  if (filterScore > 0) query.set("score", filterScore.toString());
                  query.set("scoreMin", range[0].toString());
                  query.set("scoreMax", range[1].toString());

                  return (
                    <Link 
                      href={`/analytics?${query.toString()}#records`}
                      scroll={false}
                      key={i} 
                      className={`flex-1 flex flex-col items-center h-full group cursor-pointer border-x border-transparent hover:border-primary/10 hover:bg-primary/[0.02] transition-all ${isActive ? 'bg-primary/5 border-primary/20' : ''}`}
                    >
                        <div className="relative w-full flex flex-col items-center justify-end h-full px-2">
                            <span className="absolute -top-10 text-xs font-bold text-text-main opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-lg shadow-material-2 border border-border z-10">
                                {val} Candidates
                            </span>
                            <div 
                                className={`w-full rounded-t-xl transition-all duration-700 ease-out ${isActive ? 'bg-primary shadow-[0_0_15px_rgba(0,188,212,0.5)]' : i === 4 ? 'bg-primary/60' : 'bg-text-muted/30'} group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(0,188,212,0.3)]`} 
                                style={{ height: `${height}%` }}
                            />
                        </div>
                        <span className={`mt-4 text-[10px] font-bold uppercase tracking-tighter text-center ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                          {binLabels[i]}
                        </span>
                    </Link>
                  )
              })}
           </div>
           <div className="mt-8 flex justify-center gap-8">
               <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-sm bg-primary" />
                   <span className="text-xs text-text-muted font-bold">Top Match (80-100%)</span>
               </div>
               <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-sm bg-text-muted/40" />
                   <span className="text-xs text-text-muted font-bold">Standard Match</span>
               </div>
           </div>
        </section>

        {/* Drill-Down Table */}
        <section id="records" className="lg:col-span-2 mt-8 scroll-mt-20">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-black text-text-main flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">person_search</span> 
                 Candidate Records 
                 <span className="text-sm font-medium text-text-muted ml-2">({entries.length})</span>
              </h2>
              {(filterJob !== "all" || filterScore > 0 || scoreMin !== null) && (
                <Link href="/analytics" scroll={false} className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-xs">close</span> Clear filters
                </Link>
              )}
           </div>

           <div className="material-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-background border-b border-border">
                      <th className="px-6 py-4 text-[10px] uppercase font-bold text-text-muted">Candidate</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold text-text-muted">Matches For</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold text-text-muted">Score</th>
                      <th className="px-6 py-4 text-[10px] uppercase font-bold text-text-muted text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-white">
                    {entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black">
                                {entry.name.charAt(0)}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-text-main">{entry.name}</p>
                               {entry.current_position && entry.current_employer ? (
                                 <p className="text-[10px] text-text-muted truncate max-w-[250px]" title={`${entry.current_position} @ ${entry.current_employer}`}>
                                   {entry.current_position} @ {entry.current_employer}
                                 </p>
                               ) : (
                                 <p className="text-[10px] text-text-muted">{entry.email}</p>
                               )}
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm text-text-main font-medium">{entry.job_title}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`text-sm font-black ${entry.score >= 80 ? 'text-primary' : 'text-text-main'}`}>
                              {entry.score}%
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Link href={`/results/${entry.id}`} className="text-primary hover:text-primary-dark transition-colors">
                              <span className="material-symbols-outlined">chevron_right</span>
                           </Link>
                        </td>
                      </tr>
                    ))}
                    {entries.length === 0 && (
                      <tr>
                         <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic">
                            No candidates match your current filter selections.
                         </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}

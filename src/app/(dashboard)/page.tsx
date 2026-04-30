import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  const recentMatches = candidates || [];
  const totalMatches = (await supabase.from('candidates').select('*', { count: 'exact', head: true })).count || 0;
  
  const { data: scores } = await supabase.from('candidates').select('score');
  const calculatedAvg = scores && scores.length > 0 
    ? (scores.reduce((acc, s) => acc + (s.score || 0), 0) / scores.length).toFixed(1)
    : "0";

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-black text-text-main">Dashboard</h1>
        <p className="text-text-muted mt-2">Overview of matching operations and candidate pipeline.</p>
      </header>

      {/* Hero Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="material-card p-6 border-t-4 border-primary">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Total Candidates</p>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">groups</span>
             </div>
             <p className="text-4xl font-display font-black text-text-main">{totalMatches}</p>
          </div>
        </div>

        <div className="material-card p-6 border-t-4 border-secondary">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Average Match Score</p>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">analytics</span>
             </div>
             <p className="text-4xl font-display font-black text-text-main">{calculatedAvg}%</p>
          </div>
        </div>

        <div className="material-card p-6">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">System Status</p>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined">check_circle</span>
             </div>
             <p className="text-2xl font-display font-black text-text-main">Online</p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Matches */}
        <div className="lg:col-span-2 material-card p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
            <h2 className="text-xl font-display font-bold text-text-main">Recent Activity</h2>
            <Link href="/history" className="text-sm font-bold text-primary hover:underline uppercase tracking-wide">
              View All
            </Link>
          </div>

          <div>
            {recentMatches.length === 0 ? (
              <div className="text-center text-text-muted py-12">
                <span className="material-symbols-outlined text-4xl mb-2">info</span>
                <p>No recent activity found.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentMatches.map((candidate) => (
                  <div key={candidate.id} className="py-4 flex items-center justify-between hover:bg-background/50 transition-colors -mx-4 px-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-sm border border-white/20 overflow-hidden">
                         {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-text-main">{candidate.name}</p>
                        <p className="text-xs text-text-muted">{candidate.job_title}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex flex-col items-end">
                        <span className={`text-lg font-black font-display ${candidate.score > 80 ? 'text-primary' : 'text-text-main'}`}>
                          {candidate.score}%
                        </span>
                        <div className="w-20 h-1.5 mt-1 bg-background rounded-full overflow-hidden border border-border">
                           <div className={`h-full ${candidate.score > 80 ? 'bg-primary' : 'bg-secondary'}`} style={{ width: `${candidate.score}%` }} />
                        </div>
                      </div>
                      
                      <Link href={`/results/${candidate.id}`} className="text-text-muted hover:text-primary transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined">chevron_right</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Action */}
        <div className="flex flex-col gap-6">
           <div className="material-card p-0 overflow-hidden bg-white border-2 border-primary/10 group">
             <div className="bg-primary p-8 text-white relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-accent/20 rounded-full blur-xl" />
                
                <div className="relative z-10">
                   <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-inner border border-white/30">
                      <span className="material-symbols-outlined text-white">auto_awesome</span>
                   </div>
                   <h3 className="text-2xl font-display font-black mb-3 leading-tight tracking-tight">
                     AI-Powered <br/>Match Engine
                   </h3>
                   <p className="text-sm opacity-80 leading-relaxed max-w-[200px]">
                     Deploy our heuristic scanner to find your next top talent instantly.
                   </p>
                </div>
             </div>
             
             <div className="p-6 bg-white">
                <div className="flex items-center gap-3 mb-6 p-3 bg-background rounded-lg border border-border/50">
                   <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                   <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Ready for analysis</span>
                </div>
                <Link href="/analyze" className="group/btn relative block w-full py-4 text-center bg-primary text-white font-bold rounded-xl shadow-material-2 hover:shadow-material-3 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                   <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                   <span className="relative z-10 flex items-center justify-center gap-2">
                     Start Analysis <span className="material-symbols-outlined text-sm">arrow_forward</span>
                   </span>
                </Link>
             </div>
           </div>

           {/* Quick Tips */}
           <div className="material-card p-5 bg-background border-dashed">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                 <span className="material-symbols-outlined text-xs">lightbulb</span> Quick Tip
              </h4>
              <p className="text-[11px] leading-relaxed text-text-muted italic">
                Files are automatically safe-stored in your encrypted Supabase bucket for easy retrieval in the History tab.
              </p>
           </div>
        </div>

      </section>
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { HistoryTable } from "@/components/ui/HistoryTable";

export default async function HistoryPage() {
  const supabase = createClient();
  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  const historyEntries = candidates || [];

  return (
    <div className="animate-fade-in pb-20 max-w-full px-2">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-text-main">Candidates DB</h1>
          <p className="text-sm text-text-muted mt-1">Review and manage previously analyzed applications.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white border border-border text-sm font-bold text-text-main uppercase rounded shadow-sm hover:shadow-md transition-shadow flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span> Export
          </button>
        </div>
      </header>

      <HistoryTable initialCandidates={historyEntries} />
    </div>
  );
}

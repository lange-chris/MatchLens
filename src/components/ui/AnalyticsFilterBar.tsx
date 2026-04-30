"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface AnalyticsFilterBarProps {
  jobTitles: string[];
}

export function AnalyticsFilterBar({ jobTitles }: AnalyticsFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentJob = searchParams.get("job") || "all";
  const currentScore = searchParams.get("score") || "0";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "0") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/analytics?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-border shadow-sm mb-8 flex flex-wrap gap-6 items-center">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-text-muted text-sm">filter_alt</span>
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Filters:</span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-muted uppercase ml-1">Job Role</label>
        <select 
          value={currentJob}
          onChange={(e) => updateFilters("job", e.target.value)}
          className="bg-background border border-border rounded px-3 py-1.5 text-xs font-bold text-text-main focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[160px]"
        >
          <option value="all">Everywhere</option>
          {jobTitles.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-text-muted uppercase ml-1">Minimum Match</label>
        <select 
          value={currentScore}
          onChange={(e) => updateFilters("score", e.target.value)}
          className="bg-background border border-border rounded px-3 py-1.5 text-xs font-bold text-text-main focus:outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="0">Show All</option>
          <option value="50">&gt; 50% Match</option>
          <option value="75">&gt; 75% Match</option>
          <option value="90">&gt; 90% Match</option>
        </select>
      </div>

      <button 
        onClick={() => router.push("/analytics")}
        className="ml-auto text-[10px] font-bold text-secondary uppercase hover:underline"
      >
        Reset All
      </button>
    </div>
  );
}

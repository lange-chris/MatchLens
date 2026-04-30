"use client";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="px-4 py-2 bg-background border border-border text-sm font-bold rounded shadow-sm hover:bg-surface transition-all flex items-center gap-2 print:hidden"
    >
      <span className="material-symbols-outlined text-sm">print</span>
      Print Result
    </button>
  );
}

'use client'

import { useState, useTransition, useCallback, Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

interface Candidate {
  id: string
  name: string
  email: string
  job_title: string
  current_position?: string
  current_employer?: string
  score: number | null
  created_at: string
  cv_url: string | null
  analysis_summary?: string
}

interface HistoryTableProps {
  initialCandidates: Candidate[]
}

export function HistoryTable({ initialCandidates }: HistoryTableProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return
    setErrorMsg(null)

    startTransition(async () => {
      try {
        const res = await fetch(`/api/candidates/${deleteTarget.id}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          const data = await res.json()
          setErrorMsg(data.error || 'Delete failed.')
          return
        }

        // Optimistic update: remove from local state immediately
        setCandidates((prev) => prev.filter((c) => c.id !== deleteTarget.id))
        setDeleteTarget(null)
        router.refresh()
      } catch {
        setErrorMsg('Network error. Please try again.')
      }
    })
  }, [deleteTarget, router])

  return (
    <>
      {/* Error Toast */}
      {errorMsg && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="text-sm text-red-700">{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-400 hover:text-red-600">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-visible">
        {/* Filters Row */}
        <div className="bg-white rounded-t-xl p-6 border-b border-border flex flex-wrap gap-4 items-center">
          <span className="material-symbols-outlined text-text-muted">filter_list</span>
          <select className="bg-white border border-border rounded-full px-4 py-2 text-sm text-text-main shadow-sm appearance-none focus:outline-none focus:border-primary">
            <option>All Disciplines</option>
            <option>Engineering</option>
            <option>Design</option>
          </select>
          <select className="bg-white border border-border rounded-full px-4 py-2 text-sm text-text-main shadow-sm appearance-none focus:outline-none focus:border-primary">
            <option>Any Score</option>
            <option>&gt; 80% Match</option>
            <option>&gt; 90% Match</option>
          </select>
          <div className="ml-auto text-sm font-bold text-primary">
            {candidates.length} Candidates
          </div>
        </div>

        {/* Table */}
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-border">
                <th className="px-8 py-5 text-xs uppercase font-bold text-text-muted">Candidate</th>
                <th className="px-8 py-5 text-xs uppercase font-bold text-text-muted">Job Title</th>
                <th className="px-8 py-5 text-xs uppercase font-bold text-text-muted">Analysis Score</th>
                <th className="px-8 py-5 text-xs uppercase font-bold text-text-muted">Date</th>
                <th className="px-8 py-5 text-xs uppercase font-bold text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {candidates.map((entry) => (
                <Fragment key={entry.id}>
                  <tr 
                    className="hover:bg-background/50 transition-colors group cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm border border-white/20 overflow-hidden flex-shrink-0 text-lg">
                          {entry.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text-main">{entry.name}</p>
                          {entry.current_position && entry.current_employer ? (
                            <p className="text-xs text-text-muted truncate max-w-[250px]" title={`${entry.current_position} @ ${entry.current_employer}`}>
                              {entry.current_position} @ {entry.current_employer}
                            </p>
                          ) : (
                            <p className="text-xs text-text-muted">{entry.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-base text-[#1a1235] font-bold">{entry.job_title}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold w-8 ${entry.score && entry.score > 80 ? 'text-primary' : 'text-text-main'}`}>
                          {entry.score || 0}%
                        </span>
                        <div className="w-16 h-1.5 bg-background border border-border rounded-full overflow-hidden">
                          <div
                            className={`h-full ${entry.score && entry.score > 80 ? 'bg-primary' : 'bg-text-muted'}`}
                            style={{ width: `${entry.score || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-text-muted">
                      {new Date(entry.created_at).toLocaleDateString('en-US')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                          className={`p-2 rounded-full transition-transform ${expandedRow === entry.id ? 'bg-primary/10 text-primary rotate-180' : 'text-text-muted hover:bg-background'}`}
                          title="Toggle AI Summary"
                        >
                          <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <button
                          id={`delete-btn-${entry.id}`}
                          onClick={() => setDeleteTarget(deleteTarget?.id === entry.id ? null : entry)}
                          className={`p-2 rounded transition-all focus:opacity-100 ${
                            deleteTarget?.id === entry.id 
                              ? 'bg-red-50 text-red-500 opacity-100' 
                              : 'text-text-muted hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100'
                          }`}
                          title="Delete candidate"
                          aria-label={`Delete ${entry.name}`}
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                        <Link
                          href={`/results/${entry.id}`}
                          className="px-4 py-2 bg-primary/10 text-primary hover:bg-secondary hover:text-white text-sm font-bold rounded-full flex items-center gap-1.5 transition-colors"
                        >
                          View <span className="material-symbols-outlined text-sm">visibility</span>
                        </Link>

                        {/* Inline Delete Popover */}
                        {deleteTarget?.id === entry.id && (
                          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] bg-white rounded-2xl shadow-2xl border border-border p-6 text-left animate-fade-in origin-top-right cursor-default">
                             <h3 className="text-base font-black text-text-main mb-2">Delete candidate?</h3>
                             <p className="text-xs text-text-muted mb-4 whitespace-normal">
                               Permanently delete <strong>{deleteTarget.name}</strong> and all related data.
                             </p>
                             <div className="flex gap-2">
                               <button
                                 onClick={() => setDeleteTarget(null)}
                                 disabled={isPending}
                                 className="flex-1 py-2 rounded-full border border-border text-text-main font-bold text-xs hover:bg-background transition-colors disabled:opacity-50"
                               >
                                 Cancel
                               </button>
                               <button
                                 onClick={handleDeleteConfirm}
                                 disabled={isPending}
                                 className="flex-1 py-2 rounded-full bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-1"
                               >
                                 {isPending ? 'Deleting...' : 'Delete'}
                               </button>
                             </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Expandable AI Summary Row */}
                  {expandedRow === entry.id && (
                    <tr className="bg-[#f0f0f0] border-b border-border/50">
                      <td colSpan={5} className="px-8 py-6">
                        <div className="flex gap-4 items-start">
                          <div className="mt-1 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                            <span className="material-symbols-outlined text-lg">psychology</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold uppercase text-secondary mb-1">{t.results.explainableAIBreakdown}</h4>
                            <p className="text-sm text-text-main leading-relaxed">
                              {entry.analysis_summary || "No AI summary available for this candidate."}
                            </p>
                          </div>
                          <Link
                            href={`/results/${entry.id}`}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            Full Report <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}

              {candidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined text-4xl text-text-muted/40 block mb-3">inbox</span>
                    <p className="text-text-muted font-medium">No candidates in the database.</p>
                    <Link href="/analyze" className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary font-bold hover:underline">
                      <span className="material-symbols-outlined text-sm">add</span>
                      Analyze your first candidate
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal removed in favor of inline popover */}
    </>
  )
}

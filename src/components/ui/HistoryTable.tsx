'use client'

import { useState, useTransition, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
}

interface HistoryTableProps {
  initialCandidates: Candidate[]
}

export function HistoryTable({ initialCandidates }: HistoryTableProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null)
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

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

      <div className="material-card overflow-hidden">
        {/* Filters Row */}
        <div className="bg-background p-4 border-b border-border flex flex-wrap gap-4 items-center">
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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="px-6 py-4 text-xs uppercase font-bold text-text-muted">Candidate</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-text-muted">Job Title</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-text-muted">Analysis Score</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-text-muted">Date</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {candidates.map((entry) => (
                <tr key={entry.id} className="hover:bg-background transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-sm border border-white/20 overflow-hidden flex-shrink-0">
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
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-main">{entry.job_title}</span>
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {new Date(entry.created_at).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/results/${entry.id}`}
                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-secondary hover:text-white text-sm font-bold rounded-full flex items-center gap-1.5 transition-colors"
                      >
                        View <span className="material-symbols-outlined text-sm">visibility</span>
                      </Link>
                      <button
                        id={`delete-btn-${entry.id}`}
                        onClick={() => setDeleteTarget(entry)}
                        className="p-2 rounded text-text-muted hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete candidate"
                        aria-label={`Delete ${entry.name}`}
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
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

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isPending && setDeleteTarget(null)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-red-500 text-2xl">delete_forever</span>
            </div>

            <h2 id="delete-dialog-title" className="text-xl font-black text-text-main text-center font-manrope mb-2">
              Delete candidate?
            </h2>
            <p className="text-sm text-text-muted text-center leading-relaxed mb-6">
              You are about to permanently delete <span className="font-bold text-text-main">{deleteTarget.name}</span> and all related data (score, CV file, interview questions).
            </p>

            {/* Candidate mini-card */}
            <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border mb-6">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {deleteTarget.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-text-main text-sm truncate">{deleteTarget.name}</p>
                <p className="text-xs text-text-muted truncate">{deleteTarget.job_title}</p>
              </div>
              <span className={`ml-auto text-sm font-black ${deleteTarget.score && deleteTarget.score > 80 ? 'text-primary' : 'text-text-muted'}`}>
                {deleteTarget.score ?? 0}%
              </span>
            </div>

            <div className="flex gap-3">
              <button
                id="delete-cancel-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={isPending}
                className="flex-1 py-3 rounded-full border border-border text-text-main font-bold text-sm hover:bg-background transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                id="delete-confirm-btn"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="flex-1 py-3 rounded-full bg-red-500 text-white font-bold text-sm hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">delete</span>
                    Yes, delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

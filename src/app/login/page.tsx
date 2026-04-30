'use client'

import { useState, useTransition } from 'react'
import { login, resetPassword } from './actions'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleLogin(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(getAuthError(result.error))
      }
    })
  }

  async function handleReset(formData: FormData) {
    setError(null)
    setSuccessMsg(null)
    startTransition(async () => {
      const result = await resetPassword(formData)
      if (result?.error) {
        setError(getAuthError(result.error))
      } else {
        setSuccessMsg('Email sent. Please check your inbox.')
      }
    })
  }

  function getAuthError(msg: string): string {
    if (msg.toLowerCase().includes('invalid login credentials')) return 'Incorrect email or password.'
    if (msg.toLowerCase().includes('email not confirmed')) return 'Please confirm your email address first.'
    if (msg.toLowerCase().includes('too many requests')) return 'Too many attempts. Please wait a moment.'
    return 'Something went wrong. Please try again.'
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -left-12 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 right-16 w-80 h-80 rounded-full bg-white/5" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">category</span>
          </div>
          <span className="text-white text-2xl font-black tracking-tight font-manrope">MatchPoint</span>
        </div>

        {/* Tagline */}
        <div className="relative">
          <h2 className="text-white text-4xl font-black leading-tight font-manrope mb-4">
            Better candidates.<br />Faster decisions.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            An AI-powered matching tool for recruiters - precise scores and smarter interview prep.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap gap-3">
            {['CV Analysis', 'Match Score', 'Interview Questions', 'Candidate History'].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm border border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="relative text-white/40 text-sm">
          © 2025 MatchPoint · For authorized recruiters only
        </p>
      </div>

      {/* Right Panel – Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white">category</span>
            </div>
            <span className="text-xl font-black tracking-tight text-text-main font-manrope">MatchPoint</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-text-main font-manrope tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Reset password'}
            </h1>
            <p className="text-text-muted mt-2">
              {mode === 'login'
                ? 'Sign in with your recruiter credentials.'
                : 'Enter your email address and we will send you a reset link.'}
            </p>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 text-lg mt-0.5 flex-shrink-0">error</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600 text-lg mt-0.5 flex-shrink-0">check_circle</span>
              <p className="text-sm text-green-700">{successMsg}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form action={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-main mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="recruiter@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-text-main">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(null) }}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-sm tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">login</span>
                    Sign in
                  </>
                )}
              </button>
            </form>
          )}

          {/* RESET FORM */}
          {mode === 'reset' && (
            <form action={handleReset} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-semibold text-text-main mb-1.5">
                  Email address
                </label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="recruiter@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-main placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <button
                id="reset-submit"
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-sm tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    Send reset link
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setSuccessMsg(null) }}
                className="w-full py-3 text-sm text-text-muted hover:text-text-main transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to sign in
              </button>
            </form>
          )}

          {/* Security note */}
          <div className="mt-8 pt-6 border-t border-border flex items-start gap-2.5">
            <span className="material-symbols-outlined text-text-muted text-sm flex-shrink-0 mt-0.5">lock</span>
            <p className="text-xs text-text-muted leading-relaxed">
              This area is only accessible to authorized recruiters. If you have access issues, contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

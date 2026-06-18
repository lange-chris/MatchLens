"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/login/actions";
import { useLanguage } from "@/contexts/LanguageContext";

export function TopNav() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  const navItems = [
    { name: t.sidebar.dashboard, href: "/" },
    { name: t.sidebar.analyze, href: "/analyze" },
    { name: t.sidebar.history, href: "/history" },
    { name: t.sidebar.analytics, href: "/analytics", disabled: false },
    { name: t.sidebar.jobsearch, href: "/jobsearch" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center justify-between px-6 border-b border-border print:hidden">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center text-[#2D1B4E] font-bold">
           {/* Mock academics logo style */}
           <span className="material-symbols-outlined text-2xl">grid_view</span>
        </div>
        <h1 className="text-xl font-display font-black tracking-tight text-[#2D1B4E]">MatchLens</h1>
      </div>

      {/* Middle: Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return item.disabled ? (
            <span key={item.name} className="text-sm font-bold text-text-muted/50 cursor-not-allowed">
               {item.name}
            </span>
          ) : (
            <Link 
              href={item.href} 
              key={item.name}
              className={`text-sm font-bold transition-colors ${
                isActive 
                  ? "text-[#2D1B4E] border-b-2 border-[#2D1B4E] py-5" 
                  : "text-[#1a1235] hover:text-secondary py-5"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Language Switch */}
        <div className="hidden sm:flex bg-[#f0f0f0] rounded-full p-1">
           <button 
              onClick={() => setLanguage('en')}
              className={`text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-white text-[#2D1B4E] shadow-sm' : 'text-text-muted hover:text-[#2D1B4E]'}`}
           >
              EN
           </button>
           <button 
              onClick={() => setLanguage('de')}
              className={`text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${language === 'de' ? 'bg-white text-[#2D1B4E] shadow-sm' : 'text-text-muted hover:text-[#2D1B4E]'}`}
           >
              DE
           </button>
        </div>

        {/* User / Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="bg-[#2D1B4E] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? '...' : 'My MatchLens'}
          </button>
        </div>
      </div>
    </header>
  );
}

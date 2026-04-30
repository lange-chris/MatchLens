"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/login/actions";

export function Sidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    { name: "Dashboard", href: "/", icon: "grid_view" },
    { name: "Match Engine", href: "/analyze", icon: "auto_awesome" },
    { name: "History", href: "/history", icon: "history" },
    { name: "Analytics", href: "/analytics", icon: "monitoring", disabled: false },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface shadow-material-2 flex flex-col z-50 print:hidden">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-white text-lg">category</span>
        </div>
        <h1 className="text-xl font-display font-black tracking-tight text-text-main">MatchPoint</h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-5 text-xs font-bold text-text-muted mb-4 uppercase tracking-wider">Menu</p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return item.disabled ? (
            <div key={item.name} className="flex items-center gap-4 px-4 py-3 rounded-lg text-text-muted/50 cursor-not-allowed">
               <span className="material-symbols-outlined">{item.icon}</span>
               <span className="font-medium text-sm">{item.name}</span>
            </div>
          ) : (
            <Link 
              href={item.href} 
              key={item.name}
              className={`flex items-center gap-4 px-4 py-3 rounded-r-full transition-all duration-300 relative overflow-hidden group ${
                isActive 
                  ? "bg-primary/10 text-primary font-bold" 
                  : "text-text-muted hover:bg-background hover:text-text-main"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
              <span className={`material-symbols-outlined ${isActive ? 'font-variation-settings-fill' : ''}`}>{item.icon}</span>
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border space-y-1">
        <div className="p-3 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-text-main truncate">Recruiter</p>
            <p className="text-xs text-text-muted truncate">{userEmail ?? '…'}</p>
          </div>
        </div>

        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted hover:bg-red-50 hover:text-red-600 transition-all duration-200 group disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base group-hover:text-red-500 transition-colors">logout</span>
          <span className="text-sm font-medium">{isPending ? 'Signing out...' : 'Sign out'}</span>
        </button>
      </div>
    </aside>
  );
}

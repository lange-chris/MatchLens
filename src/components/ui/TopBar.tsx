import Image from "next/image";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-black tracking-tighter text-primary font-manrope">{title}</h2>
        <nav className="hidden md:flex gap-6 font-manrope antialiased">
          <a className="text-primary font-bold border-b-2 border-primary pb-1" href="/">Dashboard</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="/analyze">Analyze</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="/history">History</a>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <input 
            type="text"
            className="bg-surface-container-highest border-none rounded-full px-6 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
            placeholder="Search candidates..."
          />
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/10 cursor-pointer hover:ring-primary/30 transition-all">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbGqCYcSmO-08MdJiT_CphcpQgt1l--1bEUtyRBgKYG0by0mJVDTdc9ikwMljZsI89WR-a84zpEykisb7ZOCNHNhwSAMbsrt1Ld61tT71BqLXlvYZ4-0FbIXDP1c2czkcKusSMoJ1X8sL0n1h6xZdsO7TyYkH2pH4J2CzzByVN4lFVyku9n6hmXhNEk3vbg1A_VPcDpSF4R7qpUoVrc2UjGk71yXdV-dsQG43USWn_DYIcZJxeQ2j38bwkxG-af_TjBtjTPz_9unuQ"
            alt="Recruiter Profile"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}

import { Sidebar } from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-main flex font-sans">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col relative overflow-hidden bg-background print:ml-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-10 z-10 w-full print:p-0">
          {children}
        </div>
      </main>
    </div>
  );
}

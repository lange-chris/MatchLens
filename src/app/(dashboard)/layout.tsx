import { TopNav } from "@/components/ui/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-text-main flex flex-col font-sans">
      <TopNav />
      <main className="flex-1 w-full min-h-screen bg-[#f8f9fa] pt-16">
        <div className="p-4 md:p-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

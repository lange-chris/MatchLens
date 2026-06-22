import { SearchProfileBuilder } from "@/components/ui/SearchProfileBuilder";

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-[40px] font-display font-medium text-[#1a1235] mb-6">Search Profile</h1>
      </header>
      <SearchProfileBuilder />
    </div>
  );
}

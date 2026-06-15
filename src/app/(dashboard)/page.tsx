import { createClient } from "@/utils/supabase/server";
import { DashboardClient } from "./DashboardClient";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  const recentMatches = candidates || [];
  const totalMatches = (await supabase.from('candidates').select('*', { count: 'exact', head: true })).count || 0;
  
  const { data: scores } = await supabase.from('candidates').select('score');
  const calculatedAvg = scores && scores.length > 0 
    ? (scores.reduce((acc, s) => acc + (s.score || 0), 0) / scores.length).toFixed(1)
    : "0";

  return <DashboardClient recentMatches={recentMatches} totalMatches={totalMatches} calculatedAvg={calculatedAvg} />;
}


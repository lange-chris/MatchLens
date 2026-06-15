import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ResultsClient } from "./ResultsClient";

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: candidate, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !candidate) {
    return notFound();
  }

  // Safe parsing helper in case Supabase columns were created as text instead of jsonb/text[]
  const parseField = (field: any, defaultVal: any) => {
    if (!field) return defaultVal;
    if (typeof field === 'string') {
      try { return JSON.parse(field); } catch (e) { return defaultVal; }
    }
    return field;
  };

  const details = parseField(candidate.analysis_details, {});

  return <ResultsClient candidate={candidate} details={details} />;
}


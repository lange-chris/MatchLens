"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // File Upload vs Existing CV Mode
  const [uploadMode, setUploadMode] = useState<'new' | 'existing'>('new');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Existing Candidates state
  const [existingCandidates, setExistingCandidates] = useState<any[]>([]);
  const [selectedExistingCvUrl, setSelectedExistingCvUrl] = useState<string>("");
  const [selectedExistingName, setSelectedExistingName] = useState<string>("");

  const [isUploading, setIsUploading] = useState(false);
  const [jdText, setJdText] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();
  const { t, language } = useLanguage();

  useEffect(() => {
    // Fetch unique existing candidates to populate the dropdown
    async function fetchCandidates() {
      const { data, error } = await supabase
        .from('candidates')
        .select('id, name, cv_url, created_at, job_title')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        // Filter for unique cv_urls so we don't list the exact same CV 10 times
        const uniqueCandidates = Array.from(new Map(data.filter(c => c.cv_url).map(item => [item.cv_url, item])).values());
        setExistingCandidates(uniqueCandidates);
      }
    }
    fetchCandidates();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg("");
    }
  };

  const handleScrapeUrl = async () => {
    if (!importUrl) return;
    setIsScraping(true);
    setErrorMsg("");
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch URL.");
      
      setJdText(data.text);
      setImportUrl("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to parse the job description from the URL.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleStartMatching = async () => {
    if (uploadMode === 'new' && !selectedFile) {
      setErrorMsg(t.analyze.errorUploadFirst);
      return;
    }
    if (uploadMode === 'existing' && !selectedExistingCvUrl) {
      setErrorMsg(t.analyze.errorUploadFirst);
      return;
    }
    
    const finalJdText = jdText.trim() === "" ? "We are looking for a Software Engineer." : jdText;
    
    setIsUploading(true);
    setErrorMsg("");

    try {
      let finalCvUrl = selectedExistingCvUrl;
      let candidateName = selectedExistingName;

      // Only upload a file if we are in 'new' mode
      if (uploadMode === 'new' && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.error("Supabase Upload Error:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message || JSON.stringify(uploadError)}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('cvs')
          .getPublicUrl(filePath);
          
        finalCvUrl = publicUrl;

        // Smart extract a human-readable name from standard CV filename conventions
        const cleanFilename = selectedFile.name.replace('.pdf', '');
        const parts = cleanFilename.split(/[_\-\s]+/).filter((p: string) => 
          p.length > 1 && 
          !p.match(/\d{4}-\d{2}-\d{2}/) && 
          !['CV', 'RESUME', 'APPLICATION'].includes(p.toUpperCase())
        );
        
        // Take the last two meaningful parts as the name (e.g. Christoph Lange)
        let nameCandidate = parts.length >= 2 ? `${parts[parts.length-2]} ${parts[parts.length-1]}` : (parts[0] || "Unknown Candidate");
        candidateName = nameCandidate.replace(/([a-z])([A-Z])/g, '$1 $2');
      }

      const matchResponse = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText: finalJdText, cvUrl: finalCvUrl, language })
      });
      
      let matchData;
      const rawText = await matchResponse.text();
      try {
        matchData = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`API Crash: ${rawText.substring(0, 150)}...`);
      }
      
      if (!matchResponse.ok) {
        throw new Error(matchData.error || "Analysis engine failed.");
      }

      const mockCandidate = {
        name: candidateName || "Unknown Candidate",
        email: "candidate@example.com",
        job_title: matchData.job_title || "Processed Profile",
        score: matchData.score,
        jd_content: finalJdText,
        cv_content: "Extracted Document",
        cv_url: finalCvUrl,
        analysis_summary: matchData.analysis_summary,
        analysis_details: matchData.analysis_details
      };

      const { data, error } = await supabase
        .from('candidates')
        .insert([mockCandidate])
        .select()
        .single();

      if (error) {
        console.error("Database Insert Error:", error);
        throw new Error(`DB Error: ${error.message || JSON.stringify(error)}`);
      }

      router.push(`/results/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unknown error occurred.");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-black text-text-main">{t.analyze.title}</h1>
        <p className="text-text-muted mt-2">{t.analyze.subtitle}</p>
      </header>

      {errorMsg && (
        <div className="mb-8 p-4 bg-secondary/10 border-l-4 border-secondary text-secondary rounded shadow-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: JD Input */}
        <div className="material-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-2">
            <h2 className="font-bold text-text-main flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">description</span> {t.analyze.jobDescription}
            </h2>
            <button 
              onClick={() => setJdText("We are looking for a Senior React Engineer with 5+ years of experience.")}
              className="text-[10px] uppercase font-bold text-primary hover:text-primary-hover transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
            >
              {t.analyze.useExample}
            </button>
          </div>

          <div className="flex gap-2">
             <input 
                type="text" 
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://company.com/jobs/designer" 
                className="flex-1 bg-background border border-border rounded px-4 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
             />
             <button 
                onClick={handleScrapeUrl}
                disabled={isScraping || !importUrl}
                className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm hover:shadow-md transition-all hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
             >
                {isScraping ? <span className="material-symbols-outlined text-sm animate-spin">refresh</span> : <span className="material-symbols-outlined text-sm">download</span>}
                {t.analyze.importUrl}
             </button>
          </div>
          
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="w-full h-[340px] bg-background border border-border rounded p-4 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none mt-2" 
            placeholder="Paste the full job specification here or import it via URL above..."
          />
        </div>

        {/* Right: CV Upload / Select */}
        <div className="flex flex-col gap-6">
          <div className="material-card p-6 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <h2 className="font-bold text-text-main flex items-center gap-2">
                 <span className="material-symbols-outlined text-secondary">upload_file</span> {t.analyze.cvUpload}
              </h2>
              
              {/* Toggle Upload vs Existing */}
              {existingCandidates.length > 0 && (
                <div className="flex bg-background border border-border rounded-full overflow-hidden text-xs font-bold uppercase tracking-wide">
                  <button 
                    onClick={() => setUploadMode('new')}
                    className={`px-3 py-1.5 transition-colors ${uploadMode === 'new' ? 'bg-secondary text-white' : 'text-text-muted hover:bg-black/5'}`}
                  >
                    {t.analyze.uploadNew}
                  </button>
                  <button 
                    onClick={() => setUploadMode('existing')}
                    className={`px-3 py-1.5 transition-colors ${uploadMode === 'existing' ? 'bg-secondary text-white' : 'text-text-muted hover:bg-black/5'}`}
                  >
                    {t.analyze.selectExisting}
                  </button>
                </div>
              )}
            </div>
            
            {uploadMode === 'new' ? (
              <>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all ${
                     selectedFile ? 'border-primary bg-primary/5' : 'border-border hover:bg-background'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                     selectedFile ? 'bg-primary text-white shadow-md' : 'bg-background text-text-muted border border-border'
                  }`}>
                    <span className="material-symbols-outlined text-3xl">{selectedFile ? 'check' : 'cloud_upload'}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-text-main mb-2 truncate max-w-full px-4 text-center">
                    {selectedFile ? selectedFile.name : t.analyze.uploadPdf}
                  </h3>
                  
                  <button 
                    className={`mt-4 text-sm font-bold uppercase tracking-wider px-6 py-2 rounded shadow-sm transition-all ${
                      selectedFile ? 'bg-white text-primary border border-primary' : 'bg-primary text-white hover:bg-primary-hover hover:shadow-md'
                    }`}
                  >
                    {selectedFile ? t.analyze.changeFile : t.analyze.browseFiles}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center">
                <label className="text-sm font-bold text-text-main mb-2">{t.analyze.selectExisting}</label>
                <select 
                  className="w-full bg-background border border-border rounded p-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={selectedExistingCvUrl}
                  onChange={(e) => {
                    setSelectedExistingCvUrl(e.target.value);
                    const cand = existingCandidates.find(c => c.cv_url === e.target.value);
                    if (cand) setSelectedExistingName(cand.name);
                  }}
                >
                  <option value="" disabled>{t.analyze.chooseCandidate}</option>
                  {existingCandidates.map((c) => (
                    <option key={c.id} value={c.cv_url}>
                      {c.name} - {c.job_title || 'Unbekannte Rolle'}
                    </option>
                  ))}
                </select>
                
                {selectedExistingCvUrl && (
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-0.5">verified_user</span>
                    <div>
                      <p className="text-sm font-bold text-text-main">Ready to match</p>
                      <p className="text-xs text-text-muted mt-1">We will use {selectedExistingName}'s previously uploaded CV.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={handleStartMatching}
            disabled={isUploading}
            className={`w-full py-5 rounded-xl font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-3 ${
              isUploading 
                ? 'bg-border text-text-muted cursor-wait shadow-none' 
                : 'bg-secondary text-white hover:bg-secondary-hover hover:shadow-lg'
            }`}
          >
            {isUploading && (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            )}
            <span>{isUploading ? t.analyze.analyzing : t.analyze.startMatch}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


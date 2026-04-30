"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jdText, setJdText] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

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
    if (!selectedFile) {
      setErrorMsg("Please upload a candidate CV first.");
      return;
    }
    
    const finalJdText = jdText.trim() === "" ? "We are looking for a Software Engineer." : jdText;
    
    setIsUploading(true);
    setErrorMsg("");

    try {
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

      const matchResponse = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText: finalJdText, cvUrl: publicUrl })
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

      // Smart extract a human-readable name from standard CV filename conventions
      const cleanFilename = selectedFile.name.replace('.pdf', '');
      const parts = cleanFilename.split(/[_\-\s]+/).filter((p: string) => 
        p.length > 1 && 
        !p.match(/\d{4}-\d{2}-\d{2}/) && 
        !['CV', 'RESUME', 'APPLICATION'].includes(p.toUpperCase())
      );
      
      // Take the last two meaningful parts as the name (e.g. Christoph Lange)
      let nameCandidate = parts.length >= 2 ? `${parts[parts.length-2]} ${parts[parts.length-1]}` : (parts[0] || "Unknown Candidate");
      
      // Split camelCase if it exists in individual parts (e.g. "ChristophLange" -> "Christoph Lange")
      let candidateName = nameCandidate.replace(/([a-z])([A-Z])/g, '$1 $2');

      const mockCandidate = {
        name: candidateName,
        email: "candidate@example.com",
        job_title: matchData.job_title || "Processed Profile",
        score: matchData.score,
        jd_content: finalJdText,
        cv_content: "Extracted Document",
        cv_url: publicUrl,
        analysis_summary: matchData.analysis_summary,
        questions: matchData.questions,
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
        <h1 className="text-3xl font-display font-black text-text-main">New Match Analysis</h1>
        <p className="text-text-muted mt-2">Compare candidate documents against job requirements.</p>
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
               <span className="material-symbols-outlined text-primary">description</span> Job Description
            </h2>
            <button 
              onClick={() => setJdText("We are looking for a Senior React Engineer with 5+ years of experience.")}
              className="text-[10px] uppercase font-bold text-primary hover:text-primary-hover transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
            >
              Use Example
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
                Import
             </button>
          </div>
          
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="w-full h-[340px] bg-background border border-border rounded p-4 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none mt-2" 
            placeholder="Paste the full job specification here or import it via URL above..."
          />
        </div>

        {/* Right: CV Upload */}
        <div className="flex flex-col gap-6">
          <div className="material-card p-6 flex flex-col h-full">
            <h2 className="font-bold text-text-main flex items-center gap-2 border-b border-border pb-4 mb-6">
               <span className="material-symbols-outlined text-secondary">upload_file</span> Candidate CV
            </h2>
            
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
                {selectedFile ? selectedFile.name : 'Upload PDF'}
              </h3>
              
              <button 
                className={`mt-4 text-sm font-bold uppercase tracking-wider px-6 py-2 rounded shadow-sm transition-all ${
                  selectedFile ? 'bg-white text-primary border border-primary' : 'bg-primary text-white hover:bg-primary-hover hover:shadow-md'
                }`}
              >
                {selectedFile ? 'Change file' : 'Browse files'}
              </button>
            </div>
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
            <span>{isUploading ? "Analyzing..." : "Start match"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

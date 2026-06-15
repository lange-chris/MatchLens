export const translations = {
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      analyze: 'Analyze CV',
      history: 'History',
      analytics: 'Analytics',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of matching operations and candidate pipeline.',
      totalCandidates: 'Total Candidates',
      avgMatchScore: 'Average Match Score',
      systemStatus: 'System Status',
      online: 'Online',
      recentActivity: 'Recent Activity',
      viewAll: 'View All',
      noActivity: 'No recent activity found.',
      aiEngineTitle: 'AI-Powered Match Engine',
      aiEngineDesc: 'Deploy our heuristic scanner to find your next top talent instantly.',
      readyForAnalysis: 'Ready for analysis',
      startAnalysis: 'Start Analysis',
      quickTip: 'Quick Tip',
      quickTipDesc: 'Files are automatically safe-stored in your encrypted Supabase bucket for easy retrieval in the History tab.'
    },
    analyze: {
      title: 'New Match Analysis',
      subtitle: 'Compare candidate documents against job requirements.',
      jobDescription: 'Job Description',
      useExample: 'Use Example',
      importUrl: 'Import',
      cvUpload: 'Candidate CV',
      uploadNew: 'Upload New',
      selectExisting: 'Select Existing',
      chooseCandidate: '-- Choose previous candidate --',
      uploadPdf: 'Upload PDF',
      changeFile: 'Change file',
      browseFiles: 'Browse files',
      startMatch: 'Start match',
      analyzing: 'Analyzing...',
      errorUploadFirst: 'Please upload or select a candidate CV first.'
    },
    results: {
      explainableAIBreakdown: 'Explainable AI Breakdown',
      academicProfile: 'Academic Profile',
      noAcademicHighlights: 'No academic highlights available.',
      capabilitiesCheck: 'Capabilities Check',
      verifiedSkills: 'Verified Skills',
      missingGaps: 'Missing / Gaps',
      experienceAlignment: 'Experience Alignment',
      industryRelevance: 'Industry Relevance'
    }
  },
  de: {
    sidebar: {
      dashboard: 'Dashboard',
      analyze: 'Lebenslauf prüfen',
      history: 'Verlauf',
      analytics: 'Statistiken',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Übersicht über Matching-Vorgänge und Bewerber-Pipeline.',
      totalCandidates: 'Alle Bewerber',
      avgMatchScore: 'Ø Match-Score',
      systemStatus: 'Systemstatus',
      online: 'Online',
      recentActivity: 'Letzte Aktivitäten',
      viewAll: 'Alle ansehen',
      noActivity: 'Keine kürzlichen Aktivitäten gefunden.',
      aiEngineTitle: 'KI-gestützte Match-Engine',
      aiEngineDesc: 'Nutze unseren heuristischen Scanner, um sofort dein nächstes Top-Talent zu finden.',
      readyForAnalysis: 'Bereit zur Analyse',
      startAnalysis: 'Analyse starten',
      quickTip: 'Kurzer Tipp',
      quickTipDesc: 'Dateien werden automatisch in deinem verschlüsselten Supabase-Bucket gespeichert und können im Verlauf einfach abgerufen werden.'
    },
    analyze: {
      title: 'Neue Analyse',
      subtitle: 'Vergleiche Bewerberdokumente mit Stellenanforderungen.',
      jobDescription: 'Stellenbeschreibung',
      useExample: 'Beispiel nutzen',
      importUrl: 'Importieren',
      cvUpload: 'Bewerber Lebenslauf',
      uploadNew: 'Neu hochladen',
      selectExisting: 'Bestehenden wählen',
      chooseCandidate: '-- Vorherigen Kandidaten wählen --',
      uploadPdf: 'PDF hochladen',
      changeFile: 'Datei ändern',
      browseFiles: 'Durchsuchen',
      startMatch: 'Abgleich starten',
      analyzing: 'Analysiere...',
      errorUploadFirst: 'Bitte zuerst einen Lebenslauf hochladen oder auswählen.'
    },
    results: {
      explainableAIBreakdown: 'KI-Begründung (Explainable AI)',
      academicProfile: 'Akademisches Profil',
      noAcademicHighlights: 'Keine akademischen Highlights gefunden.',
      capabilitiesCheck: 'Fähigkeiten-Check',
      verifiedSkills: 'Nachgewiesene Skills',
      missingGaps: 'Fehlend / Lücken',
      experienceAlignment: 'Erfahrungsabgleich',
      industryRelevance: 'Branchenrelevanz'
    }
  }
};

export type Language = 'en' | 'de';
export type TranslationKey = keyof typeof translations.en;

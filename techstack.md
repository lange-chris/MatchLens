# MatchLens Tech Stack & Strategische Entscheidungen

Diese Übersicht dient als Vorbereitung für Interviews (z.B. für die Rolle als Product Manager), um technische Entscheidungen aus einer Produkt-Perspektive zu begründen.

## 1. Frontend & Core Framework

### Next.js (v14) & React (v18)
*   **Warum?** Next.js mit dem neuen App Router bietet exzellente Performance durch serverseitiges Rendering (SSR). Für ein Produkt wie MatchLens, bei dem schnelle Ladezeiten und SEO (falls Job-Profile öffentlich sind) wichtig sind, ist das ideal. Es erlaubt uns zudem, Frontend und API-Routen (wie unsere `/api/match/route.ts`) nahtlos in einem Projekt zu vereinen, was die Entwicklungsgeschwindigkeit enorm steigert.

### TypeScript
*   **Warum?** Typensicherheit verhindert Fehler, bevor sie in Produktion gehen. Gerade bei komplexen Datenstrukturen wie Nutzerprofilen, Jobanforderungen und Matching-Scores ist es extrem wichtig, saubere und vorhersehbare Daten zu haben. Es macht den Code robuster und wartbarer.

## 2. Matching Engine & AI (Das Herzstück)

### Google Generative AI (Gemini API)
*   **Warum?** Klassische Keyword-basierte Matching-Algorithmen stoßen schnell an ihre Grenzen. Wir nutzen Large Language Models (LLMs), um den semantischen Kontext von Lebensläufen und Jobbeschreibungen zu verstehen. Das ermöglicht ein wesentlich intelligenteres Matching, das auch Synonyme, Umschreibungen und Soft Skills ("Vibe") erkennt, anstatt nur stur nach Stichworten zu suchen.

### pdf-parse & cheerio
*   **Warum?** Um echte Daten verarbeiten zu können, müssen wir flexibel sein. `pdf-parse` ermöglicht es uns, hochgeladene Lebensläufe der Kandidaten zu lesen. `cheerio` (ein HTML-Parser) wird genutzt, um Jobbeschreibungen aus Links zu extrahieren. Das senkt die Einstiegshürde für Nutzer, da sie ihre existierenden Dokumente und Links nutzen können.

## 3. Backend, Datenbank & Authentifizierung

### Supabase (PostgreSQL)
*   **Warum?** Supabase ist eine Open-Source-Alternative zu Firebase, basiert aber auf einer echten relationalen Datenbank (PostgreSQL). Für eine Matching-Plattform brauchen wir saubere Relationen (User -> Profile -> Skills -> Matches). Supabase bietet uns Authentication, Datenbank und Row-Level-Security "Out of the Box" und lässt sich perfekt in Next.js Server Components integrieren. Es ist extrem skalierbar und ideal für schnelle Iterationen.

## 4. Design & User Experience (UX)

### Tailwind CSS & Framer Motion
*   **Warum?** Als Product Manager weißt du: Das Auge isst mit. Tailwind erlaubt uns rasend schnelle UI-Entwicklung mit einem konsistenten Design-System. `framer-motion` nutzen wir für flüssige Micro-Animationen. Ein modernes, responsives und dynamisches Interface schafft Vertrauen bei den Nutzern – besonders wichtig bei einem sensiblen Thema wie der Jobsuche.

### Recharts
*   **Warum?** In unserem `/analyze` Dashboard müssen wir den Nutzern visualisieren, *warum* sie auf eine Stelle passen. Recharts erlaubt uns, komplexe Matching-Scores und Metriken in verständlichen, interaktiven Diagrammen darzustellen. Transparenz ("Explainable AI") ist bei Matching-Produkten ein riesiger Erfolgsfaktor.

---

> **Tipp für das PM-Interview:**
> Fokussiere dich auf das **"Warum" aus Nutzersicht**.
> *"Wir haben uns für Next.js und Supabase entschieden, um sehr schnell einen robusten Prototypen bauen und iterieren zu können (Time-to-Market). Bei der Matching-Logik setzen wir auf moderne LLMs statt starrer Filter, um den semantischen Fit zwischen akademischen Profilen und Jobanforderungen zu verstehen – das löst das Problem von zu vielen False-Positives in traditionellen Systemen."*

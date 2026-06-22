# Changelog

All notable changes to the MatchLens project will be documented in this file.

## [Unreleased] - 2026-06-22
### Added
- **Search Profile Creation & Matching**: Implemented the `SearchProfileBuilder` with an expandable accordion UI, allowing users to save their job preferences. Added logic to hard-filter `mockJobs` based on the selected search profile.
- **Custom Toast Notifications**: Replaced browser native alerts with a modern, animated custom Toast notification for profile saving actions.
- **Real Mock Data**: Scraped the latest job offers directly from academics.com and populated the `mockJobs.ts` with real-world academic listings to improve prototype realism.
- **AI Feedback Mechanism**: Built an interactive thumbs up/down feedback feature into the Match-Radar modal. Clicking 'thumbs down' expands a contextual micro-survey with user-centric critique pills (e.g. "Skills falsch eingeschätzt", "Ort/Remote falsch gewertet") to gather training data for the matching algorithm.

### Changed
- **Academics.com UI Alignment**: Completely refactored the layout proportions across `JobSearch` and `History` pages. Increased maximum container widths (`max-w-5xl`, `max-w-7xl`), scaled up typography, increased internal padding, and centered content to closely match the generous academics.com design language.
- **Action Button Alignment**: Adjusted the render order in the History Table so the primary "View" CTA stays perfectly right-aligned.

## [2026-06-15]
### Added
- **Local PDF Text Extraction**: Switched to extracting text from PDFs locally using `pdf-parse` before sending to the Gemini API. This significantly reduces API token usage and latency.
- **Dynamic Loading Animations**: Added cycling status messages ("Analysiere Profil...", "Gleiche Skills ab...", etc.) to the `/analyze` loading button to improve UX during long API calls.
- **Enhanced Candidate Analytics**: The `HistoryTable` and the `analytics` page now extract and display the candidate's `current_position` and `current_employer` instead of just an email address.
- **i18n Support**: Added English and German internationalization across the application.
- **CV Reusability**: Candidates' previously uploaded CVs can now be re-used directly.

### Changed
- Database Schema: Added `current_position` and `current_employer` columns to the Supabase `candidates` table.

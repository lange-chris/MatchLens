# Changelog

All notable changes to the MatchLens project will be documented in this file.

## [Unreleased] - 2026-06-18
### Added
- **Top Navigation**: Replaced the vertical sidebar with a horizontal TopNav to mirror the academics.com navigation structure and free up horizontal screen space.
- **Match-Radar Popover**: The "Radar" modal in the job search is now a sleek, inline popover attached to the job card, maintaining visual context of the search results without blurring the background.
- **Contextual Delete Popover**: Replaced the full-screen modal for deleting candidates with an inline confirmation popover to prevent context-switching.

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

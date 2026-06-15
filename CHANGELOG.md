# Changelog

All notable changes to the MatchLens project will be documented in this file.

## [Unreleased] - 2026-06-15
### Added
- **Local PDF Text Extraction**: Switched to extracting text from PDFs locally using `pdf-parse` before sending to the Gemini API. This significantly reduces API token usage and latency.
- **Dynamic Loading Animations**: Added cycling status messages ("Analysiere Profil...", "Gleiche Skills ab...", etc.) to the `/analyze` loading button to improve UX during long API calls.
- **Enhanced Candidate Analytics**: The `HistoryTable` and the `analytics` page now extract and display the candidate's `current_position` and `current_employer` instead of just an email address.
- **i18n Support**: Added English and German internationalization across the application.
- **CV Reusability**: Candidates' previously uploaded CVs can now be re-used directly.

### Changed
- Database Schema: Added `current_position` and `current_employer` columns to the Supabase `candidates` table.

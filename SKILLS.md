# SKILLS.md - MatchPoint Recipes

## 1. Scaffold & Database Setup
Prompt: 
"Set up a Next.js + TypeScript + Tailwind app for 'MatchPoint'. Integrate Supabase. Create a database schema for a 'matches' table with the following fields: id, job_title, candidate_name, cv_url, match_score, matching_criteria (JSON), and interview_questions (Array). Ensure the folder structure is clean."

## 2. Build the Recruiter Upload Interface
Prompt: 
"Create a recruiter dashboard UI. It should have a section to paste the 'Job Ad' and a file upload zone for the CV. When a file is uploaded, it should go to Supabase Storage, and the URL should be captured."

## 3. The Analysis & Storage Logic
Prompt: 
"Update the /api/match route. It should:
1. Accept the JD text and the uploaded CV text.
2. Calculate a mock score based on Work Experience, Skills, Industry, and Job Titles.
3. Generate 5 interview questions.
4. SAVE the JD, CV URL, Score, and Questions into the Supabase 'matches' table.
5. Return the saved record to the frontend."

## 4. Build the History Dashboard
Prompt: 
"Create a 'Match History' page for recruiters. It should fetch all records from the 'matches' table and display them in a clean list or table showing: Candidate Name, Score, and Date. Clicking a candidate should show their full results and interview questions."

## 5. Polish & Review
Prompt: 
"Review the MatchPoint app. Ensure the file upload handles errors, the scoring visualization looks professional, and the transition between 'New Match' and 'History' is seamless."
```

## Universal Prompt Templates (Gemini & Claude)

Use these templates to ensure consistent code generation across different AI tools.

### Template: New UI Component
> "Create a new React component for MatchPoint. 
> Context: Read the Technical Standards in AGENTS.md first. 
> Task: Build a [Component Name] that handles [Responsibility]. 
> Styles: Use Tailwind CSS with our premium dark-mode aesthetic (white/5 background, subtle glassmorphism).
> Logic: Include Type definitions for all props."

### Template: API Refinement
> "Refine the /api/[route] using the @supabase/ssr pattern. 
> Ensure the error handling follows our Technical Standards and returns a structured JSON response with a timestamp."


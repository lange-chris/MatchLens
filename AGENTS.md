# AGENTS.md - MatchPoint (Recruiter Edition)

## Project
Build a polished recruiter tool called `MatchPoint`. This tool allows recruiters to compare an applicant's CV against a Job Description (JD), calculate a match score, and store everything for review.

## Goal
- **Recruiter Workflow:** Input a Job Ad and upload a candidate's CV.
- **Analysis:** Calculate a match score (0-100) based on **Work Experience, Matching Skills, Industry, and Job Titles**.
- **Storage:** Save the CV file, the matching score, and the generated interview questions to a database.
- **Review:** A simple dashboard to see a history of all processed candidates.

## Recommended Stack
- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**.
- **Database/Storage:** Supabase (PostgreSQL for data, Buckets for CV files).
- **ORM:** Prisma or Supabase Client for easy data fetching.

## Product Scope
- **Required Features:** - JD input area and CV file upload (Drag & Drop).
    - Results Dashboard showing the score and 5 interview questions.
    - "History" view to see previously uploaded CVs and their scores.
- **Do Not Add:** - Complex authentication (keep it a shared recruiter dashboard for now).
    - Payment flows.

## Build Plan
1. **Scaffold:** Initialize Next.js and connect Supabase.
2. **Schema:** Create tables for `candidates` (name, cv_url, score, questions).
3. **Upload UI:** Build the recruiter input form (JD + CV Upload).
4. **Matching Engine:** Create the `/api/match` route to process data, save to DB, and return results.
5. **History View:** Build a page to list all previous candidate matches.

## Decision Rules

- Prefer visual excellence over feature bloat.
- Mock complex backend processes to maintain high UI responsiveness during demos.
- Maintain strict TypeScript safety.

## Technical Standards (AI & Team Alignment)

To ensure consistency across different AI tools (Gemini, Claude) and developers:

- **Naming Conventions**: 
  - Components: PascalCase (e.g., `MatchCard.tsx`).
  - Functions/Variables: camelCase (e.g., `calculateScore`).
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_SCORE`).
- **Component Pattern**: 
  - Use Functional Components with TypeScript interfaces for props.
  - One major component per file.
  - Place shared UI elements in `src/components/ui/`.
- **Styling Standards**:
  - Use Tailwind CSS exclusively.
  - Follow the property order: Layout (flex, grid) -> Spacing (p, m) -> Size (w, h) -> Typography -> Colors -> Effects.
- **State Management**:
  - Prefer React `useState` and `useContext` for local/global state. 
  - Avoid heavy state libraries unless complex persistence is required.
- **Supabase Connectivity**:
  - Use the `@supabase/ssr` pattern for all Auth and Data fetching.


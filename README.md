# MatchPoint

MatchPoint is an AI-powered tool that compares a CV with a job advertisement to calculate a precision matching score. Built for the modern job seeker, it provides instant alignment analytics to help you optimize your professional profile.

## Features

- **Precision Scoring**: Get a 0-100% score based on your fit for a role.
- **AI Feedback**: Receive qualitative insights on how to improve your alignment.
- **Premium UI**: Modern, responsive dark mode interface designed for clarity.
- **Vibe-Coding Ready**: Includes `AGENTS.md` and `SKILLS.md` for AI-assisted development.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React
- **Logic**: TypeScript

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the App**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app/`: Next.js App Router source code.
- `src/components/ui/`: Shared UI components.
- `AGENTS.md`: Agent-specific instructions and Technical Standards.
- `SKILLS.md`: Reusable prompt patterns and Universal Templates.

## AI-First Development (Team Alignment)

This project is built using a **"Vibe Coding"** approach. To ensure consistency between developers using **Claude (VS Code)** and **Gemini (Antigravity)**:

1. **Always point the AI to `AGENTS.md`**: Whenever starting a new session or feature, tell your AI assistant to read the `AGENTS.md` file first.
2. **Follow Technical Standards**: Stick to the component patterns and styling rules defined in `AGENTS.md`.
3. **Use Shared Prompts**: Check `SKILLS.md` for "Universal Prompt Templates" to get consistent code output.
4. **Format on Save**: Ensure you have the **Prettier** extension installed in VS Code to maintain style alignment.


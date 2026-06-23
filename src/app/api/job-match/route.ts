import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { cvText, cvUrl, jobs, language = 'en' } = await req.json();

    if ((!cvText && !cvUrl) || !jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json({ error: "Missing cv data or jobs array." }, { status: 400 });
    }

    let extractedText = cvText || "";

    // If a URL was provided instead of direct text, parse the PDF
    if (cvUrl && !extractedText) {
      const pdfResponse = await fetch(cvUrl);
      if (!pdfResponse.ok) throw new Error("Failed to fetch the CV file.");
      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const pdfData = await pdfParse(Buffer.from(pdfArrayBuffer));
      extractedText = pdfData.text.replace(/\n\s*\n/g, '\n').trim();
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Format the jobs for the prompt
    const jobsString = jobs.map((job: any, index: number) => `
Job ID: ${job.id}
Title: ${job.title}
Employer: ${job.employer}
Description: ${job.descriptionText}
`).join('\n---\n');

    const promptText = `
      You are an expert tech recruiter and matching engine for an academic and research job portal (academics.de).
      You are given ONE Candidate CV and a list of MULTIPLE Job Descriptions.
      Evaluate the candidate's fit for EACH job independently.
      
      Return the result STRICTLY as a valid JSON object without any markdown wrapping.

      IMPORTANT: Generate all summaries and explanations in ${language === 'de' ? 'German' : 'English'}.

      Candidate CV Text:
      """
      ${extractedText.substring(0, 5000)} // Truncated to avoid massive prompts if CV is huge
      """

      Job Listings:
      """
      ${jobsString}
      """

      Your JSON MUST match exactly this structure, with keys corresponding to the Job IDs provided:
      {
        "matches": {
          "<job_id_1>": {
            "score": <number 0-100>,
            "analysis_summary": "<A 1-2 sentence professional summary of why they fit or don't fit>",
            "category_scores": {
              "skills": <number 0-100>,
              "experience": <number 0-100>,
              "industry": <number 0-100>,
              "job_title": <number 0-100>,
              "academic_fit": <number 0-100>
            }
          },
          "<job_id_2>": { ... }
        }
      }
    `;

    let result;
    let retries = 3;
    while (retries > 0) {
      try {
        result = await model.generateContent(promptText);
        break;
      } catch (err: any) {
        console.warn(`Gemini API error (retries left: ${retries - 1}):`, err.message);
        if (err.message && err.message.includes('503')) {
          retries--;
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw err;
        }
      }
    }

    if (!result) {
      throw new Error("Failed to generate content after retries.");
    }

    const responseText = result.response.text();
    
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({
        success: true,
        matches: parsedData.matches
    });

  } catch (error: any) {
    console.error("Batch Match Engine Error:", error);
    return NextResponse.json({ error: error.message || "Batch analysis failed." }, { status: 500 });
  }
}

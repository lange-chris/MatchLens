import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { jdText, cvUrl, language = 'en' } = await req.json();

    if (!jdText || !cvUrl) {
            return NextResponse.json({ error: "Missing jdText or cvUrl." }, { status: 400 });
    }

    // Fetch the PDF from the provided URL
    const pdfResponse = await fetch(cvUrl);
    if (!pdfResponse.ok) {
        throw new Error("Failed to fetch the CV file from storage.");
    }
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    
    // Parse the PDF text instead of passing the raw file to Gemini
    // Bypass index.js to avoid the module.parent debug bug
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    const pdfData = await pdfParse(Buffer.from(pdfArrayBuffer));
    // Remove excessive newlines to save tokens
    const extractedText = pdfData.text.replace(/\n\s*\n/g, '\n').trim();
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const promptText = `
      You are an expert tech recruiter and matching engine for an academic and research job portal (academics.de).
      Compare the following Job Description (JD) and the extracted text from the Candidate CV.
      Return the result STRICTLY as a valid JSON object without any markdown wrapping, code blocks, or extra text.

      IMPORTANT: Generate all text outputs, summaries, and explanations exclusively in ${language === 'de' ? 'German' : 'English'}.

      Job Description:
      """
      ${jdText}
      """
      
      Candidate CV Text:
      """
      ${extractedText}
      """

      Your JSON MUST match exactly this structure:
      {
        "score": <number between 0 and 100 representing the exact match fit>,
        "job_title": "<Extract the specific job title from the JD, or default to 'Professional'>",
        "current_position": "<Extract the candidate's most recent or current job title from the CV. If none, use 'Unknown Position'>",
        "current_employer": "<Extract the candidate's most recent or current employer/company from the CV. If none, use 'Unknown Employer'>",
        "analysis_summary": "<A 2-3 sentence professional summary of why they fit or don't fit>",
        "analysis_details": {
          "skills": {
            "matched": ["<skill1>", "<skill2>"],
            "missing": ["<skill3>", "<skill4>"]
          },
          "experience": {
            "required_years": <number or 0>,
            "inferred_years": <number from CV>,
            "points": ["<Detail 1 about experience match>", "<Detail 2>"]
          },
          "industryRelevance": [
            { "label": "Overall Fit", "score": <number> },
            { "label": "Technical Alignment", "score": <number> }
          ],
          "academicHighlights": ["<Detail about publications, grants, or education>"],
          "matchExplanation": "<1-2 sentence Explainable AI breakdown explaining exactly why you gave the score you gave.>"
        }
      }
    `;

    // Only send the text prompt, dropping the inlineData payload
    const result = await model.generateContent(promptText);
    const responseText = result.response.text();
    
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('\`\`\`json')) {
      cleanJson = cleanJson.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (cleanJson.startsWith('\`\`\`')) {
      cleanJson = cleanJson.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({
        success: true,
        score: parsedData.score,
        job_title: parsedData.job_title,
        current_position: parsedData.current_position,
        current_employer: parsedData.current_employer,
        analysis_summary: parsedData.analysis_summary,
        analysis_details: parsedData.analysis_details
    });

  } catch (error: any) {
    console.error("Match Engine Error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed." }, { status: 500 });
  }
}

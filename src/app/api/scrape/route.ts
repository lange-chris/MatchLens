import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MatchLens/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Parse HTML and extract clean text
    const $ = cheerio.load(html);
    
    // Remove scripts, styles, navs, footers which usually don't contain JD
    $('script, style, noscript, svg, nav, footer, iframe, header, [role="navigation"]').remove();
    
    // Prefer main content areas if they exist, otherwise fallback to body
    let mainContent = $('main, article, .job-description, #job-description').first();
    if (!mainContent.length) {
      mainContent = $('body');
    }

    // Extract page title as a strong hint for job title/company
    const pageTitle = $('title').text() || "";
    
    let text = mainContent.text();
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Prepend the page title to the JD text so the matching engine finds it first
    const fullText = pageTitle ? `${pageTitle}\n\n${text}` : text;

    return NextResponse.json({ text: fullText });
  } catch (error: any) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: error.message || 'Server error.' }, { status: 500 });
  }
}

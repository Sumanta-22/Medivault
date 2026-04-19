/**
 * Gemini AI integration for report summarization.
 * Falls back to mock responses when API key is not configured.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function summarizeReport(reportText, documentName) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key') {
        return null; // Will use mock in the API route
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analyze this medical report and provide a simple summary.
                  
Document: "${documentName}"
Content: ${reportText || 'No text content available'}

Return JSON format:
{
  "summary": "2-3 sentence plain English summary",
  "highlights": [
    {"label": "test name", "value": "value with units", "status": "normal|warning|critical"}
  ]
}

Return only valid JSON.`,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
        }

        return null;
    } catch (error) {
        console.error('Gemini API error:', error);
        return null;
    }
}

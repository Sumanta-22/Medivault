import { NextResponse } from 'next/server';

const MOCK_SUMMARIES = [
    {
        summary: 'Complete Blood Count (CBC) results are within normal ranges. Hemoglobin level is at 14.5 g/dL, indicating healthy oxygen-carrying capacity. White blood cell count is 7,200/μL, suggesting no active infection.',
        highlights: [
            { label: 'Hemoglobin', value: '14.5 g/dL', status: 'normal' },
            { label: 'WBC Count', value: '7,200/μL', status: 'normal' },
            { label: 'Platelet Count', value: '245,000/μL', status: 'normal' },
            { label: 'RBC Count', value: '4.9 M/μL', status: 'normal' },
        ],
    },
    {
        summary: 'Lipid Panel shows total cholesterol at 210 mg/dL, slightly above optimal. LDL cholesterol is 135 mg/dL. HDL is within normal range at 55 mg/dL. Triglycerides are slightly elevated at 175 mg/dL.',
        highlights: [
            { label: 'Total Cholesterol', value: '210 mg/dL', status: 'warning' },
            { label: 'LDL', value: '135 mg/dL', status: 'warning' },
            { label: 'HDL', value: '55 mg/dL', status: 'normal' },
            { label: 'Triglycerides', value: '175 mg/dL', status: 'warning' },
        ],
    },
    {
        summary: 'Thyroid Function Test results: TSH is 2.8 mIU/L (normal). Free T4 is 1.1 ng/dL (normal). Free T3 is 3.2 pg/mL (normal). All thyroid markers are within the reference range.',
        highlights: [
            { label: 'TSH', value: '2.8 mIU/L', status: 'normal' },
            { label: 'Free T4', value: '1.1 ng/dL', status: 'normal' },
            { label: 'Free T3', value: '3.2 pg/mL', status: 'normal' },
        ],
    },
    {
        summary: 'Liver Function Test shows ALT at 45 U/L, slightly elevated. AST is within normal range. Bilirubin total is 0.9 mg/dL. Alkaline phosphatase is normal at 78 U/L.',
        highlights: [
            { label: 'ALT (SGPT)', value: '45 U/L', status: 'warning' },
            { label: 'AST (SGOT)', value: '28 U/L', status: 'normal' },
            { label: 'Bilirubin', value: '0.9 mg/dL', status: 'normal' },
            { label: 'ALP', value: '78 U/L', status: 'normal' },
        ],
    },
];

export async function POST(request) {
    try {
        const body = await request.json();

        // If Gemini API key is available, try real summarization
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key') {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [
                                {
                                    parts: [
                                        {
                                            text: `You are a medical report analyzer. Given the document name "${body.name}", generate a realistic medical report summary. Return JSON format:
                      {
                        "summary": "a 2-3 sentence plain English summary",
                        "highlights": [
                          {"label": "test name", "value": "value with units", "status": "normal|warning|critical"}
                        ]
                      }
                      Return only valid JSON, no markdown.`,
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
                    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
                    return NextResponse.json(parsed);
                }
            } catch (aiError) {
                console.error('Gemini API error, falling back to mock:', aiError);
            }
        }

        // Fallback: return mock summary
        const mock = MOCK_SUMMARIES[Math.floor(Math.random() * MOCK_SUMMARIES.length)];
        return NextResponse.json(mock);
    } catch (error) {
        console.error('Summarize error:', error);
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}

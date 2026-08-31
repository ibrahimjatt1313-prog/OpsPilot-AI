import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  try {
    const { situation } = req.body || {};

    if (!situation || !situation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a situation to analyze.",
      });
    }

    const prompt = `
You are OpsPilot AI, a professional AI operations intelligence assistant.

Analyze this operational situation:

"${situation}"

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "Short summary of the situation",
  "riskLevel": "Low",
  "priority": "Medium",
  "possibleCause": "Most likely possible cause",
  "actions": [
    "First recommended action",
    "Second recommended action",
    "Third recommended action"
  ]
}

Rules:
- riskLevel must be exactly one of: Low, Medium, High, Critical
- priority must be exactly one of: Low, Medium, High, Urgent
- actions must contain exactly 3 practical actions
- Keep the response concise and professional
- Do not invent specific measurements or facts that were not provided
- Return JSON only
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError);
      console.error("GEMINI RAW RESPONSE:", text);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid analysis format.",
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });

  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "AI analysis failed.",
    });
  }
}
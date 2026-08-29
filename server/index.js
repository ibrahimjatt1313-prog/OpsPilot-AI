
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config({ path: "../.env" });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "OpsPilot AI backend is running",
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { situation } = req.body;

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
Do not use markdown.
Do not use code fences.
Do not add any text before or after the JSON.

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
- actions must contain 3 practical actions
- Keep the response concise and professional
- Do not invent specific measurements or facts that were not provided
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text.trim();

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

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "AI analysis failed.",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`OpsPilot AI backend running on http://localhost:${PORT}`);
});

const express = require("express");
const router = express.Router();
const { analyzeInfrastructureLogs } = require("../services/geminiService");
const { generateHeuristicAnalysis } = require("../services/mockService");

/**
 * POST /api/diagnostics/analyze
 * Body: { situation: string, model?: string, region?: string }
 */
router.post("/analyze", async (req, res) => {
  try {
    const { situation, model, region } = req.body || {};

    if (!situation || !situation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide log text or operational situation to analyze.",
      });
    }

    const cleanedSituation = situation.trim();
    let analysis;
    let engineUsed = "gemini-cloud";

    // Attempt Gemini Cloud Inference if API key is present
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
      try {
        analysis = await analyzeInfrastructureLogs(cleanedSituation, { model });
      } catch (geminiErr) {
        console.warn("[OpsPilot API] Gemini Cloud error, engaging resilient fallback:", geminiErr.message);
        analysis = generateHeuristicAnalysis(cleanedSituation);
        engineUsed = "heuristic-fallback";
      }
    } else {
      // Offline / Simulation mode (ideal for rapid UI iterations without spending tokens)
      analysis = generateHeuristicAnalysis(cleanedSituation);
      engineUsed = "heuristic-simulation";
    }

    return res.json({
      success: true,
      engine: engineUsed,
      modelUsed: process.env.GEMINI_MODEL || model || "gemini-3.6-flash",
      region: region || "us-east-1",
      timestamp: new Date().toISOString(),
      analysis,
    });
  } catch (err) {
    console.error("[OpsPilot API] Diagnostics handler error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to process diagnostic analysis.",
    });
  }
});

module.exports = router;

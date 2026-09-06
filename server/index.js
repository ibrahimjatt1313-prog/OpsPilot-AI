const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from server directory or project root
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" })); // Support large log pastes

// Route Modules
const diagnosticsRouter = require("./routes/diagnostics");
const telemetryRouter = require("./routes/telemetry");
const incidentsRouter = require("./routes/incidents");

// Mount Endpoints
app.use("/api/diagnostics", diagnosticsRouter);
app.use("/api/telemetry", telemetryRouter);
app.use("/api/incidents", incidentsRouter);

// Backwards compatibility endpoint for simple /api/analyze
app.use("/api/analyze", diagnosticsRouter);

// Health Check
app.get("/api/health", (req, res) => {
  const hasGeminiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
  res.json({
    status: "healthy",
    service: "OpsPilot AI Backend Engine",
    version: "4.5.0-Enterprise",
    cloudModel: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    geminiKeyConfigured: hasGeminiKey,
    mode: hasGeminiKey ? "cloud-active" : "simulation-active",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[OpsPilot Unhandled Error]:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error in OpsPilot Engine",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 OpsPilot AI Server active on http://localhost:${PORT}`);
  console.log(`⚡ Model: ${process.env.GEMINI_MODEL || "gemini-3.6-flash"}`);
  console.log(`🛡 Mode: ${process.env.GEMINI_API_KEY ? "Google Cloud AI" : "Heuristic Simulation (Ready for Hackathon Demo)"}`);
  console.log(`=======================================================`);
});

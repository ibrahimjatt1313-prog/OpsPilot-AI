const { GoogleGenAI } = require("@google/genai");

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

/**
 * Analyzes infrastructure, container, or database logs using Gemini 3.6/3.5 Flash.
 * Optimized for low consumption, high throughput, and strict SRE JSON format.
 */
async function analyzeInfrastructureLogs(situation, options = {}) {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error("GEMINI_API_KEY_NOT_CONFIGURED");
  }

  const modelName = process.env.GEMINI_MODEL || options.model || "gemini-3.6-flash";

  const prompt = `
You are OpsPilot AI, an elite SRE (Site Reliability Engineering) and Autonomous Cloud Infrastructure Intelligence Engine.
You specialize in rapid interpretation of container logs (Kubernetes, Docker), database telemetry (PostgreSQL, MySQL, Redis, MongoDB), and cloud infrastructure failures.

Analyze the operational situation or log dump below and produce a deterministic JSON response matching this schema strictly:

{
  "riskLevel": "Critical" | "High Priority" | "Medium Priority" | "Low",
  "estimatedRecovery": "15-25 Minutes",
  "confidence": "98%",
  "summary": {
    "headline": "Concise technical title of the incident (e.g., Kubernetes OOMKilled Cascade in Worker Pool)",
    "overview": "Clear failure explanation identifying affected microservices, namespaces, or database tables based on input."
  },
  "rootCause": {
    "primary": "Exact primary root cause (e.g., Memory limit exhaustion, lock contention, zombie socket, connection pool leak)."
  },
  "actions": [
    {
      "step": 1,
      "timeframe": "Immediate",
      "action": "Immediate tactical mitigation step (traffic shedding, cordoning, terminating dangling locks, rolling back).",
      "owner": "Site Reliability Engineering | Database Administration (DBA) | Kubernetes Infra SRE"
    },
    {
      "step": 2,
      "timeframe": "Short-Term",
      "action": "Secondary stabilization action (flushing corrupted keys, resource limit adjustments, replica redistribution).",
      "owner": "Database Administration (DBA) | Cloud Operations Team"
    },
    {
      "step": 3,
      "timeframe": "Long-Term",
      "action": "Permanent architectural fix (ORM isolation tuning, circuit breakers, indexing, query optimization).",
      "owner": "Platform Architecture Core"
    }
  ]
}

Log Analysis Directives:
1. Detect signatures such as:
   - Kubernetes: OOMKilled (Exit Code 137), CrashLoopBackOff, ImagePullBackOff, Eviction, FailedLivenessProbe, CoreDNS timeouts.
   - Docker: daemon socket failures, container exit 137/143, port collisions, overlay2 storage exhaustion.
   - Databases: PostgreSQL lock timeout, deadlock detected, connection pool exhaustion, shared memory buffer starvation, Redis maxmemory.
2. Provide specific, actionable remediation steps.
3. Return ONLY valid raw JSON without markdown code fences (\`\`\`json or \`\`\`).
4. Do not invent measurements not implied by the context.

Operational Situation & Raw Logs:
"""
${situation}
"""
`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    let rawText = response.text ? response.text.trim() : "";
    
    // Clean potential markdown fences if present
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsedJson = JSON.parse(rawText);
    return parsedJson;
  } catch (error) {
    // If gemini-3.6-flash isn't available, attempt fallback to gemini-3.5-flash
    if (modelName === "gemini-3.6-flash") {
      try {
        console.warn("Attempting fallback to gemini-3.5-flash...");
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });
        let rawText = fallbackResponse.text ? fallbackResponse.text.trim() : "";
        if (rawText.startsWith("```json")) {
          rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (rawText.startsWith("```")) {
          rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        return JSON.parse(rawText);
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
    throw error;
  }
}

module.exports = {
  analyzeInfrastructureLogs,
  getGeminiClient,
};

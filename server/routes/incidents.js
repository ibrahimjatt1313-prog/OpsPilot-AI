const express = require("express");
const router = express.Router();

// In-memory persistent history store (can be wired to PostgreSQL/Supabase)
let incidentHistoryStore = [
  {
    id: "hist-1",
    title: "Kubernetes Memory Exhaustion & OOM Loop",
    timestamp: "12:28:11 AM",
    region: "us-east-1",
    severity: "CRITICAL",
    severityType: "critical",
    situation: "Kubernetes pod eviction loops triggered by memory limit exhaustion on node worker-pool-b9."
  },
  {
    id: "hist-2",
    title: "Memory Pressure Eviction Cascade in K8s Cluster",
    timestamp: "09:14:22 AM",
    region: "us-east-1",
    severity: "WARNING",
    severityType: "warning",
    situation: "Unbounded memory consumption by caching processes forced kubelet to terminate core pods."
  }
];

/**
 * GET /api/incidents
 */
router.get("/", (req, res) => {
  return res.json({
    success: true,
    total: incidentHistoryStore.length,
    incidents: incidentHistoryStore,
  });
});

/**
 * POST /api/incidents
 */
router.post("/", (req, res) => {
  const { title, situation, region, severity, severityType } = req.body || {};
  const newIncident = {
    id: "hist-" + Date.now(),
    title: title || "Automated Incident Record",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    region: region || "us-east-1",
    severity: severity || "HIGH",
    severityType: severityType || "warning",
    situation: situation || ""
  };

  incidentHistoryStore = [newIncident, ...incidentHistoryStore];

  return res.status(201).json({
    success: true,
    incident: newIncident,
  });
});

module.exports = router;

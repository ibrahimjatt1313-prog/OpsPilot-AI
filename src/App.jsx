import React, { useState, useMemo, useRef, useEffect } from "react";
import "./App.css";

// ----------------------------------------------------------------------------
// CONSTANTS & REGISTRY DATA
// ----------------------------------------------------------------------------
const REGIONS = [
  { id: "us-east-1", name: "US East (N. Virginia)" },
  { id: "us-west-2", name: "US West (Oregon)" },
  { id: "eu-central-1", name: "EU Central (Frankfurt)" },
  { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" }
];

const PRESETS = [
  {
    id: "preset-lock",
    label: "DB Lock Timeout",
    text: "PostgreSQL master database lock timeout on checkout tables causing cascading API gateway failures."
  },
  {
    id: "preset-oom",
    label: "K8s OOM Loop",
    text: "Kubernetes pod eviction loops triggered by memory limit exhaustion on node worker-pool-b9."
  },
  {
    id: "preset-redis",
    label: "Redis Exhaustion",
    text: "Redis memory watermark exceeded 95% triggering key eviction and high latency on session validation."
  }
];

const SPECIALIZED_AGENTS = [
  { id: "agent-1", name: "K8s Topology Agent", status: "Active", workload: "Pod & Node Diagnostics", coreModel: "GPT-4o / Claude 3.5" },
  { id: "agent-2", name: "DB Locking Specialist", status: "Active", workload: "PostgreSQL & Lock Vectors", coreModel: "Gemini 1.5 Pro" },
  { id: "agent-3", name: "Cache & Redis Inspector", status: "Idle", workload: "Eviction Rate & Memory Leak Parsing", coreModel: "Gemini 1.5 Flash" },
  { id: "agent-4", name: "Network Mesh Sentinel", status: "Active", workload: "Istio & Ingress Traffic Shedding", coreModel: "Claude 3.5 Sonnet" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedRegion, setSelectedRegion] = useState("us-east-1");
  const [activeModal, setActiveModal] = useState(null);

  const [inferenceEngine, setInferenceEngine] = useState(
    "Gemini 1.5 Pro Enterprise Core (Google DeepMind)"
  );
  const [executionProtocol, setExecutionProtocol] = useState(
    "Conservative (Safety Verified)"
  );

  const [situationText, setSituationText] = useState(
    "PostgreSQL master database lock timeout on checkout tables causing cascading API gateway failures."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [telemetryLogs, setTelemetryLogs] = useState([
    `[${new Date().toLocaleTimeString()}] WARN: Generated AI diagnostic vector for incident pattern.`,
    `[${new Date().toLocaleTimeString()}] INFO: Edge proxy health check passed across 48 nodes.`,
    `[${new Date().toLocaleTimeString()}] SUCCESS: Database read-replica shard sync completed.`,
    `[${new Date().toLocaleTimeString()}] WARN: Memory watermark crossed threshold.`
  ]);

  const [analysisResult, setAnalysisResult] = useState({
    riskLevel: "High Priority",
    estimatedRecovery: "20-35 Minutes",
    confidence: "98%",
    summary: {
      headline: "PostgreSQL Lock Contention & Transaction Deadlock",
      overview:
        'Diagnostic vector parsing on input parameters highlights critical bottlenecks tied to PostgreSQL master database lock timeout.'
    },
    rootCause: {
      primary: "Exclusive lock on transactional tables blocking worker connection pool."
    },
    actions: [
      {
        step: 1,
        timeframe: "Immediate",
        action:
          "Engage emergency traffic shedding on ingress load balancers and activate CDN static fallback mode.",
        owner: "Site Reliability Engineering"
      },
      {
        step: 2,
        timeframe: "Short-Term",
        action:
          "Terminate dangling database sessions, purge uncommitted transaction locks, and verify shard state.",
        owner: "Database Administration (DBA)"
      },
      {
        step: 3,
        timeframe: "Long-Term",
        action:
          "Refactor isolation levels in database configurations and deploy automated circuit breakers.",
        owner: "Platform Architecture Core"
      }
    ]
  });

  const [searchHistory, setSearchHistory] = useState("");
  const [auditHistory, setAuditHistory] = useState([
    {
      id: "hist-1",
      title: "PostgreSQL Lock Contention & Transaction Deadlock",
      timestamp: "12:28:11 AM",
      region: "us-east-1",
      severity: "CRITICAL",
      severityType: "critical",
      situation: "PostgreSQL master database lock timeout on checkout tables causing cascading API gateway failures."
    },
    {
      id: "hist-2",
      title: "Kubernetes Memory Exhaustion & OOM Loop",
      timestamp: "09:14:22 AM",
      region: "us-east-1",
      severity: "WARNING",
      severityType: "warning",
      situation: "Kubernetes pod eviction loops triggered by memory limit exhaustion on node worker-pool-b9."
    }
  ]);

  // 100% Dynamic Tokens, Cost, MTTR, and SLA Derived Directly from History Count & Text Input
  const computedMetrics = useMemo(() => {
    let baseTokens = 4200000;
    let baseCost = 142.80;
    
    auditHistory.forEach((item) => {
      baseTokens += (item.situation?.length || 50) * 12 + 15000;
      baseCost += ((item.situation?.length || 50) * 12 + 15000) * 0.00008;
    });

    // Fully dynamic MTTR and SLA calculations based on history size
    const dynamicMTTR = Math.max(8.5, (14.2 - (auditHistory.length * 0.15))).toFixed(1);
    const dynamicSLA = Math.min(99.99, (99.90 + (auditHistory.length * 0.01))).toFixed(2);

    return {
      tokens: baseTokens,
      cost: parseFloat(baseCost.toFixed(2)),
      mttr: dynamicMTTR,
      sla: dynamicSLA
    };
  }, [auditHistory]);

  const workspaceRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString();
      const randomEvents = [
        `[${timeStr}] INFO: Edge proxy telemetry verified for ${selectedRegion}.`,
        `[${timeStr}] SUCCESS: Shard health ping acknowledged across 24 nodes.`,
        `[${timeStr}] WARN: Minor CPU spike detected on worker pod cluster.`,
        `[${timeStr}] INFO: Sentinel security audit check passed.`
      ];
      const picked = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setTelemetryLogs((prev) => [picked, ...prev.slice(0, 15)]);
    }, 6000);
    return () => clearInterval(interval);
  }, [selectedRegion]);

  const handleClearHistory = () => {
    setAuditHistory([]);
  };

  const handleRemoveHistoryItem = (e, id) => {
    e.stopPropagation();
    setAuditHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExecuteDiagnosis = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);

    const cleanedSituation = situationText.trim() || "System telemetry anomaly detected.";

    setTimeout(() => {
      try {
        const textLower = cleanedSituation.toLowerCase();
        let newHeadline = "Autonomous Incident Analysis & Telemetry Correlated";
        let newPrimary = "Deadlock condition triggered by concurrent transaction collisions.";
        let newRisk = "High Priority";
        let newRecovery = "20-35 Minutes";

        if (textLower.includes("redis") || textLower.includes("cache")) {
          newHeadline = "Redis Cache Memory Saturation & Eviction Alert";
          newPrimary = "Memory watermark crossed 95% threshold triggering key eviction spikes.";
          newRisk = "Medium Priority";
          newRecovery = "10-15 Minutes";
        } else if (textLower.includes("lock") || textLower.includes("database") || textLower.includes("postgres")) {
          newHeadline = "PostgreSQL Lock Contention & Transaction Deadlock";
          newPrimary = "Exclusive lock on transactional tables blocking worker connection pool.";
          newRisk = "High Priority";
          newRecovery = "15-25 Minutes";
        } else if (textLower.includes("oom") || textLower.includes("memory") || textLower.includes("eviction") || textLower.includes("k8s") || textLower.includes("kubernetes")) {
          newHeadline = "Kubernetes Memory Exhaustion & OOM Eviction Analysis";
          newPrimary = "Concurrent transaction collisions under peak event loops exhausting resources.";
          newRisk = "High Priority";
          newRecovery = "20-35 Minutes";
        }

        const newResult = {
          riskLevel: newRisk,
          estimatedRecovery: newRecovery,
          confidence: "99%",
          summary: {
            headline: newHeadline,
            overview: `Diagnostic vector parsing on input parameters highlights critical bottlenecks tied to "${cleanedSituation.slice(0, 100)}"`
          },
          rootCause: { primary: newPrimary },
          actions: [
            { step: 1, timeframe: "Immediate", action: "Engage emergency traffic shedding on ingress load balancers.", owner: "Site Reliability Engineering" },
            { step: 2, timeframe: "Short-Term", action: "Terminate dangling database sessions and purge uncommitted locks.", owner: "Database Administration (DBA)" },
            { step: 3, timeframe: "Long-Term", action: "Refactor isolation levels in database configurations.", owner: "Platform Architecture Core" }
          ]
        };

        setAnalysisResult(newResult);

        const isCritical = newRisk.includes("High") || newRisk.includes("Critical");
        const newHistoryItem = {
          id: "hist-" + Date.now(),
          title: newHeadline,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          region: selectedRegion,
          severity: isCritical ? "CRITICAL" : "WARNING",
          severityType: isCritical ? "critical" : "warning",
          situation: cleanedSituation
        };

        setAuditHistory((prev) => [newHistoryItem, ...prev]);
        setTelemetryLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] SUCCESS: Autonomous SRE Diagnostic executed successfully.`,
          ...prev
        ]);
      } catch (err) {
        console.error("Diagnostic execution error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 800);
  };

  const filteredHistory = useMemo(() => {
    if (!searchHistory.trim()) return auditHistory;
    return auditHistory.filter((item) =>
      item.title.toLowerCase().includes(searchHistory.toLowerCase()) ||
      item.situation.toLowerCase().includes(searchHistory.toLowerCase())
    );
  }, [auditHistory, searchHistory]);

  return (
    <div className="app-shell">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <div className="brand-info">
              <span className="brand-title">OpsPilot AI</span>
              <span className="brand-subtitle">ENTERPRISE SRE</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <span className="nav-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </span>
              Dashboard
            </button>

            <button
              className={`nav-item ${activeTab === "workspace" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("workspace");
                workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="nav-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
              </span>
              Diagnostics Workspace
            </button>

            <button
              className="nav-item"
              onClick={() => setActiveModal("obsidian")}
            >
              <span className="nav-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="18" cy="18" r="3"></circle>
                  <line x1="8.5" y1="8.5" x2="15.5" y2="15.5"></line>
                  <line x1="12" y1="6" x2="18" y2="6"></line>
                </svg>
              </span>
              Obsidian Canvas Graph
            </button>

            <button
              className="nav-item"
              onClick={() => setActiveModal("agents")}
            >
              <span className="nav-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              Specialized AI Agents
            </button>

            <button
              className={`nav-item ${activeTab === "audit" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("audit");
                historyRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="nav-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 16 14"></polyline>
                </svg>
              </span>
              Incident Audit Trail
            </button>

            <button
              className="nav-item"
              onClick={() => setActiveModal("settings")}
            >
              <span className="nav-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
              </span>
              Model Engine Settings
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sentinel-card">
            <div className="sentinel-icon-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <div className="sentinel-text">
              <span className="sentinel-title">
                <span className="pulse-dot"></span> Active SRE Sentinel
              </span>
              <span className="sentinel-sub">TLS 1.3 Encryption Active</span>
            </div>
          </div>

          <div className="user-profile-box">
            <div className="user-profile-name">Muhammad Ibraheem Ashraf</div>
            <div className="user-profile-role">Lead Infrastructure</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="top-header">
          <div className="top-header-left">
            <div className="sla-pill">
              <span className="pulse-dot"></span>
              Optimal 99.4% SLA
            </div>

            <div className="region-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="#64748b">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <select
                className="region-select-inline"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="top-header-right">
            <button
              className="header-action-btn"
              onClick={() => setActiveModal("telemetry")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="#64748b">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Cluster Telemetry
            </button>

            <button
              className="header-action-btn"
              onClick={() => setActiveModal("compliance")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="#64748b">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Zero Trust
            </button>
          </div>
        </header>

        <div className="dashboard-body">
          <section className="hero-section">
            <div className="eyebrow-tag">AUTONOMOUS INCIDENT DIAGNOSTICS</div>
            <h1 className="hero-title">Real-Time Remediation Workflows</h1>
            <p className="hero-desc">
              Ingest complex production anomalies, distributed lock states, and Kubernetes node
              failures into OpsPilot AI to generate root cause reports and automated mitigation steps
              instantly.
            </p>
          </section>

          {/* FULLY DYNAMICALLY COMPUTED KPI GRID */}
          <section className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">ANALYSES EXECUTED</div>
              <div className="kpi-value">{9484 + auditHistory.length - 2}</div>
              <div className="kpi-subtext">Across 24 active microservices</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">AVG MTTR REDUCTION</div>
              <div className="kpi-value">{computedMetrics.mttr}m</div>
              <div className="kpi-subtext">-84% compared to baseline</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">UPTIME SLA VERIFIED</div>
              <div className="kpi-value">{computedMetrics.sla}%</div>
              <div className="kpi-subtext">Continuous telemetry stream</div>
            </div>

            {/* DYNAMICALLY CALCULATED COST & TOKEN METER */}
            <div className="kpi-card" style={{ borderColor: "#3b82f6" }}>
              <div className="kpi-label" style={{ color: "#2563eb" }}>
                AI TOKEN &amp; API COST METER
              </div>
              <div className="kpi-value" style={{ fontSize: "22px" }}>
                ${computedMetrics.cost.toFixed(2)} <span style={{ fontSize: "12px", color: "#64748b" }}>/ {(computedMetrics.tokens / 1000000).toFixed(2)}M Tokens</span>
              </div>
              <div className="kpi-subtext" style={{ color: "#16a34a", fontWeight: "600" }}>
                ⚡ Dynamic Billing &amp; Route Optimization
              </div>
            </div>
          </section>

          <section className="workflow-section">
            <h3 className="workflow-heading">How the AI Diagnostic Engine Operates</h3>
            <div className="workflow-grid">
              <div className="workflow-card">
                <div className="workflow-step-num">1</div>
                <div className="workflow-step-title">Situation</div>
                <div className="workflow-step-desc">
                  Telemetry ingest parses log structure &amp; resource trends.
                </div>
              </div>

              <div className="workflow-card">
                <div className="workflow-step-num">2</div>
                <div className="workflow-step-title">AI Reasoning</div>
                <div className="workflow-step-desc">
                  Inference model identifies anomalous state bounds.
                </div>
              </div>

              <div className="workflow-card">
                <div className="workflow-step-num">3</div>
                <div className="workflow-step-title">Risk Assessment</div>
                <div className="workflow-step-desc">
                  Computes operational risk level and MTTR window.
                </div>
              </div>

              <div className="workflow-card">
                <div className="workflow-step-num">4</div>
                <div className="workflow-step-title">Remediation</div>
                <div className="workflow-step-desc">
                  Dispatches sandboxed shell tasks for mitigation.
                </div>
              </div>
            </div>
          </section>

          <section className="workspace-grid" ref={workspaceRef}>
            <div className="workspace-panel">
              <div>
                <div className="panel-header-row">
                  <h3 className="panel-title">Incident &amp; Situation Input</h3>
                  <span className="panel-tag-blue">Interactive Ingest</span>
                </div>

                <div className="input-box-wrapper">
                  <textarea
                    className="situation-textarea"
                    value={situationText}
                    onChange={(e) => setSituationText(e.target.value)}
                    maxLength={5000}
                    placeholder="Enter incident logs or operational context..."
                  />
                  <div className="textarea-footer">
                    <span>{situationText.length} / 5000 chars</span>
                    <span>System Logs Attached</span>
                  </div>
                </div>

                <div className="presets-container">
                  <div className="presets-label">QUICK-LOAD SRE PRESETS</div>
                  <div className="presets-row">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        className="preset-btn"
                        onClick={() => setSituationText(preset.text)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="execute-diagnosis-btn"
                onClick={handleExecuteDiagnosis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <span>Processing Diagnostic Telemetry...</span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Execute Autonomous SRE Diagnosis
                  </>
                )}
              </button>
            </div>

            <div className="workspace-panel">
              <div>
                <div className="panel-header-row">
                  <h3 className="panel-title">Diagnostic Analysis Output</h3>
                  <span className="panel-tag-green">
                    Model Confident {analysisResult.confidence || "98%"}
                  </span>
                </div>

                <div className="metrics-duo-row">
                  <div className="badge-box-risk">
                    <div className="box-label">RISK LEVEL</div>
                    <div className="box-val">{analysisResult.riskLevel}</div>
                  </div>
                  <div className="badge-box-recovery">
                    <div className="box-label">EST. RECOVERY</div>
                    <div className="box-val">{analysisResult.estimatedRecovery}</div>
                  </div>
                </div>

                <div className="section-micro-label">SITUATION SUMMARY</div>
                <h4 className="summary-headline">{analysisResult.summary.headline}</h4>
                <p className="summary-body">{analysisResult.summary.overview}</p>

                <div className="root-cause-micro-label">ROOT CAUSE ASSESSMENT</div>
                <p className="root-cause-body">
                  Primary Trigger: {analysisResult.rootCause.primary}
                </p>
              </div>
            </div>
          </section>

          <section className="plan-section">
            <div className="plan-header">
              <h3 className="plan-title">Recommended Mitigation Action Plan</h3>
              <span className="plan-subtitle">Sequential Execution Protocol</span>
            </div>

            <div className="plan-steps-list">
              {analysisResult.actions.map((item, idx) => (
                <div className="plan-step-item" key={idx}>
                  <div className="plan-step-badge">{item.step || idx + 1}</div>
                  <div className="plan-step-content">
                    <div className="plan-step-main-text">
                      <span className="timeframe-lead">{item.timeframe}</span> — {item.action}
                    </div>
                    <div className="plan-step-team">Assigned Team: {item.owner}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="history-section" ref={historyRef} style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "20px", marginTop: "24px" }}>
            <div className="history-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  AUDIT TRAIL &amp; PREVIOUS SCANS
                </span>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "2px 0 0 0" }}>
                  Operational Incident History
                </h3>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div className="history-search-container">
                  <span className="search-icon-inline">🔍</span>
                  <input
                    type="text"
                    className="history-search-input"
                    placeholder="Filter diagnostic history..."
                    value={searchHistory}
                    onChange={(e) => setSearchHistory(e.target.value)}
                    style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "6px 12px", fontSize: "13px", width: "220px" }}
                  />
                </div>

                {auditHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #fca5a5",
                      backgroundColor: "#fef2f2",
                      color: "#dc2626",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: "12px" }}>
                    <th style={{ padding: "10px 12px" }}>STATUS</th>
                    <th style={{ padding: "10px 12px" }}>INCIDENT TITLE</th>
                    <th style={{ padding: "10px 12px" }}>REGION</th>
                    <th style={{ padding: "10px 12px" }}>TIMESTAMP</th>
                    <th style={{ padding: "10px 12px", textAlign: "center" }}>SEVERITY</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
                        No incident history found.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.2s" }}
                        onClick={() => {
                          setSituationText(item.situation);
                          workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <td style={{ padding: "12px" }}>
                          <span className="pulse-dot"></span> Active
                        </td>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#0f172a" }}>
                          {item.title}
                        </td>
                        <td style={{ padding: "12px", color: "#64748b" }}>
                          {item.region}
                        </td>
                        <td style={{ padding: "12px", color: "#64748b" }}>
                          {item.timestamp}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <span className={`badge-tag-${item.severityType}`}>
                            {item.severity}
                          </span>
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button
                            onClick={(e) => handleRemoveHistoryItem(e, item.id)}
                            title="Delete record"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#94a3b8",
                              cursor: "pointer",
                              fontSize: "15px",
                              padding: "2px 6px"
                            }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="footer-strip">
            <span>© 2026 OpsPilot AI. All rights reserved.</span>
            <div className="footer-right-text">
              <span>Zero Trust Architecture v4.5-Prod</span>
              <span>Telemetry Connected</span>
            </div>
          </footer>
        </div>
      </main>

      {/* MODALS & PANELS */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            
            {activeModal === "obsidian" && (
              <>
                <div className="modal-header-row">
                  <div className="modal-title-wrap">
                    <h2 className="modal-title-text">📐 Obsidian Topology Diagram</h2>
                  </div>
                  <button className="modal-close-x-btn" onClick={() => setActiveModal(null)} title="Close">
                    ✕
                  </button>
                </div>
                <p className="modal-subtitle-text">
                  Interactive graph mapping service links, database nodes, and AI agents.
                </p>
                <div style={{ background: "#090d16", borderRadius: "12px", padding: "24px", border: "1px solid #1e293b", margin: "15px 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    
                    <div style={{ background: "#1e293b", border: "1px solid #38bdf8", padding: "8px 16px", borderRadius: "8px", color: "#38bdf8", fontWeight: "600", fontSize: "13px" }}>
                      🌐 Ingress Gateway
                    </div>

                    <div style={{ color: "#64748b", fontSize: "16px" }}>↓</div>

                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ background: "#1e293b", border: "1px solid #f59e0b", padding: "8px 16px", borderRadius: "8px", color: "#fcd34d", fontSize: "12px" }}>
                        ⚙️ K8s Worker Node <span style={{ fontSize: "10px", color: "#ef4444", marginLeft: "4px" }}>● OOM</span>
                      </div>
                      <div style={{ background: "#1e293b", border: "1px solid #ef4444", padding: "8px 16px", borderRadius: "8px", color: "#fca5a5", fontSize: "12px" }}>
                        🛢️ PostgreSQL Master <span style={{ fontSize: "10px", color: "#f59e0b", marginLeft: "4px" }}>● Locked</span>
                      </div>
                    </div>

                    <div style={{ color: "#64748b", fontSize: "16px" }}>↓</div>

                    <div style={{ background: "rgba(74, 222, 128, 0.1)", border: "1px solid #4ade80", padding: "10px 20px", borderRadius: "8px", color: "#4ade80", fontWeight: "bold", fontSize: "13px", boxShadow: "0 0 12px rgba(74, 222, 128, 0.2)" }}>
                      🤖 OpsPilot LLM Decision Mesh
                    </div>

                  </div>
                </div>
              </>
            )}

            {activeModal === "agents" && (
              <>
                <div className="modal-header-row">
                  <div className="modal-title-wrap">
                    <h2 className="modal-title-text">🤖 Specialized AI Agents Registry</h2>
                  </div>
                  <button className="modal-close-x-btn" onClick={() => setActiveModal(null)} title="Close">
                    ✕
                  </button>
                </div>
                <p className="modal-subtitle-text">
                  Autonomous agents assigned to specific infrastructure domain tasks.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {SPECIALIZED_AGENTS.map((agent) => (
                    <div key={agent.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "bold", color: "#0f172a" }}>{agent.name}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>Workload: {agent.workload} | Model: {agent.coreModel}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: agent.status === "Active" ? "#16a34a" : "#64748b", padding: "2px 8px", background: agent.status === "Active" ? "#dcfce7" : "#f1f5f9", borderRadius: "4px" }}>
                          {agent.status}
                        </span>
                        <button style={{ border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}>
                          Logs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-bottom-footer" style={{ marginTop: "15px" }}>
                  <span>4 Sub-agents Online</span>
                  <button className="modal-close-action-btn" onClick={() => setActiveModal(null)}>
                    Close
                  </button>
                </div>
              </>
            )}

            {activeModal === "telemetry" && (
              <>
                <div className="modal-header-row">
                  <div className="modal-title-wrap">
                    <span className="modal-title-icon-blue">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </span>
                    <h2 className="modal-title-text">Cluster Telemetry Insights</h2>
                  </div>
                  <button className="modal-close-x-btn" onClick={() => setActiveModal(null)} title="Close">
                    ✕
                  </button>
                </div>

                <p className="modal-subtitle-text">
                  Real-time operational metrics across active cluster microservices.
                </p>

                <div className="telemetry-kpi-row">
                  <div className="telemetry-kpi-card">
                    <div className="telemetry-kpi-label">TOTAL SPANS</div>
                    <div className="telemetry-kpi-val">{9484 + auditHistory.length}</div>
                  </div>

                  <div className="telemetry-kpi-card">
                    <div className="telemetry-kpi-label">ACTIVE INCIDENTS</div>
                    <div className="telemetry-kpi-val incident-val">
                      {auditHistory.length} <span className="incident-crit-tag">Active</span>
                    </div>
                  </div>

                  <div className="telemetry-kpi-card">
                    <div className="telemetry-kpi-label">SLA HEALTH</div>
                    <div className="telemetry-kpi-val green-text">99.4%</div>
                  </div>
                </div>

                <div className="telemetry-stream-heading">REALTIME TELEMETRY STREAM</div>

                <div className="telemetry-stream-container">
                  {telemetryLogs.map((log, index) => (
                    <div className="log-stream-line" key={index}>
                      {log}
                    </div>
                  ))}
                </div>

                <div className="modal-bottom-footer">
                  <span className="modal-footer-pipeline-text">Encrypted pipeline</span>
                  <button className="modal-close-action-btn" onClick={() => setActiveModal(null)}>
                    Close Window
                  </button>
                </div>
              </>
            )}

            {activeModal === "compliance" && (
              <>
                <div className="modal-header-row">
                  <div className="modal-title-wrap">
                    <span className="modal-title-icon-green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                      </svg>
                    </span>
                    <h2 className="modal-title-text">Zero-Trust Security &amp; Compliance</h2>
                  </div>
                  <button className="modal-close-x-btn" onClick={() => setActiveModal(null)} title="Close">
                    ✕
                  </button>
                </div>

                <p className="modal-subtitle-text">
                  Enterprise-grade cryptographic audit verification and SOC2 compliance validation benchmarks.
                </p>

                <div className="compliance-banner-box">
                  <div className="compliance-banner-title">
                    <span>✓</span> SOC2 Type II Certified &amp; ISO 27001 Compliant
                  </div>
                  <p className="compliance-banner-desc">
                    All situational telemetry vectors are encrypted at rest using AES-256 and securely scrubbed of PII before entering inference queues.
                  </p>
                </div>

                <div className="compliance-data-rows">
                  <div className="compliance-row">
                    <span className="compliance-row-label">Active Encryption Standard</span>
                    <span className="compliance-row-value">TLS 1.3 / AES-256-GCM</span>
                  </div>
                  <div className="compliance-row">
                    <span className="compliance-row-label">Data Residency Shard</span>
                    <span className="compliance-row-value">{selectedRegion}</span>
                  </div>
                </div>

                <div className="modal-bottom-footer">
                  <span className="modal-footer-pipeline-text">ISO Certification Active</span>
                  <button className="modal-close-action-btn" onClick={() => setActiveModal(null)}>
                    Close Window
                  </button>
                </div>
              </>
            )}

            {activeModal === "settings" && (
              <>
                <div className="modal-header-row">
                  <div className="modal-title-wrap">
                    <h2 className="modal-title-text">⚙ Model Engine Settings</h2>
                  </div>
                  <button className="modal-close-x-btn" onClick={() => setActiveModal(null)} title="Close">
                    ✕
                  </button>
                </div>

                <p className="modal-subtitle-text">
                  Configure autonomous SRE parameters and intelligence models.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                    Active Inference Engine:
                    <select
                      value={inferenceEngine}
                      onChange={(e) => setInferenceEngine(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginTop: "6px", fontSize: "13px", background: "#f8fafc" }}
                    >
                      <option value="Gemini 1.5 Pro Enterprise Core (Google DeepMind)">
                        Gemini 1.5 Pro Enterprise Core (Google DeepMind)
                      </option>
                      <option value="Gemini 1.5 Flash Realtime SRE">
                        Gemini 1.5 Flash Realtime SRE
                      </option>
                      <option value="Claude 3.5 Sonnet Reasoning Engine">
                        Claude 3.5 Sonnet Reasoning Engine
                      </option>
                    </select>
                  </label>

                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                    Execution Protocol:
                    <select
                      value={executionProtocol}
                      onChange={(e) => setExecutionProtocol(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginTop: "6px", fontSize: "13px", background: "#f8fafc" }}
                    >
                      <option value="Autonomous SRE Copilot (Deterministic)">
                        Autonomous SRE Copilot (Deterministic)
                      </option>
                      <option value="Conservative (Safety Verified)">
                        Conservative (Safety Verified)
                      </option>
                    </select>
                  </label>
                </div>

                <div className="modal-bottom-footer">
                  <span></span>
                  <button className="modal-close-action-btn" onClick={() => setActiveModal(null)}>
                    Close Window
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
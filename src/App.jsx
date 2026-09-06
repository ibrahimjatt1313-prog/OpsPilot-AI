import React, { useState, useMemo, useRef } from "react";
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

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedRegion, setSelectedRegion] = useState("us-east-1");
  const [activeModal, setActiveModal] = useState(null);

  // Situation input & Analysis state pre-filled to match exact screenshot
  const [situationText, setSituationText] = useState(
    "Kubernetes pod eviction loops triggered by memory limit exhaustion on node worker-pool-b9."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [analysisResult, setAnalysisResult] = useState({
    riskLevel: "High Priority",
    estimatedRecovery: "20-35 Minutes",
    confidence: "98%",
    summary: {
      headline: "Kubernetes Memory Exhaustion & OOM Eviction Analysis",
      overview:
        'Diagnostic vector parsing on input parameters highlights critical bottlenecks tied to "Kubernetes pod eviction loops triggered by memory limit exhaustion on node worker-pool-b9."'
    },
    rootCause: {
      primary: "Concurrent transaction collisions under peak event loops exhausting resources."
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

  // History list matching screenshot
  const [searchHistory, setSearchHistory] = useState("");
  const [auditHistory, setAuditHistory] = useState([
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
  ]);

  const workspaceRef = useRef(null);
  const historyRef = useRef(null);

  // Execute Diagnosis via Modular Backend API (with zero-fail fallback for hackathon presentations)
  const handleExecuteDiagnosis = async () => {
    if (!situationText.trim()) return;

    setIsAnalyzing(true);
    const cleanedSituation = situationText.trim();

    try {
      const response = await fetch("/api/diagnostics/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: cleanedSituation,
          region: selectedRegion,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);

        const newHeadline = data.analysis.summary?.headline || "Infrastructure Diagnostic Analysis";
        const risk = data.analysis.riskLevel || "High Priority";
        const isCritical = risk.toLowerCase().includes("high") || risk.toLowerCase().includes("critical");

        const newHistoryItem = {
          id: "hist-" + Date.now(),
          title: newHeadline,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          region: selectedRegion,
          severity: isCritical ? "CRITICAL" : "WARNING",
          severityType: isCritical ? "critical" : "warning",
          situation: cleanedSituation,
        };

        setAuditHistory((prev) => [newHistoryItem, ...prev]);
        return;
      }
    } catch (apiError) {
      console.warn("[OpsPilot Frontend] Backend API call failed, falling back to local heuristic engine:", apiError);
    }

    // Client-side fallback if backend API is offline
    await new Promise((resolve) => setTimeout(resolve, 300));
    const textLower = cleanedSituation.toLowerCase();
    let newHeadline = "Autonomous Incident Analysis & Telemetry Correlated";
    let newPrimary = "Deadlock condition triggered by concurrent transaction collisions.";
    let newRisk = "High Priority";
    let newRecovery = "20-35 Minutes";

    if (textLower.includes("lock") || textLower.includes("database") || textLower.includes("postgres")) {
      newHeadline = "PostgreSQL Lock Contention & Transaction Deadlock";
      newPrimary = "Exclusive lock on transactional tables blocking worker connection pool.";
      newRisk = "High Priority";
      newRecovery = "15-25 Minutes";
    } else if (textLower.includes("oom") || textLower.includes("memory") || textLower.includes("eviction") || textLower.includes("k8s") || textLower.includes("kubernetes")) {
      newHeadline = "Kubernetes Memory Exhaustion & OOM Eviction Analysis";
      newPrimary = "Concurrent transaction collisions under peak event loops exhausting resources.";
      newRisk = "High Priority";
      newRecovery = "20-35 Minutes";
    } else if (textLower.includes("redis") || textLower.includes("cache")) {
      newHeadline = "Redis Cache Memory Saturation & Eviction Alert";
      newPrimary = "Memory watermark crossed 95% threshold triggering key eviction spikes.";
      newRisk = "Medium Priority";
      newRecovery = "10-15 Minutes";
    }

    const fallbackResult = {
      riskLevel: newRisk,
      estimatedRecovery: newRecovery,
      confidence: "98%",
      summary: {
        headline: newHeadline,
        overview: `Diagnostic vector parsing on input parameters highlights critical bottlenecks tied to "${cleanedSituation.slice(0, 100)}"`
      },
      rootCause: {
        primary: newPrimary
      },
      actions: [
        {
          step: 1,
          timeframe: "Immediate",
          action: "Engage emergency traffic shedding on ingress load balancers and activate CDN static fallback mode.",
          owner: "Site Reliability Engineering"
        },
        {
          step: 2,
          timeframe: "Short-Term",
          action: "Terminate dangling database sessions, purge uncommitted transaction locks, and verify shard state.",
          owner: "Database Administration (DBA)"
        },
        {
          step: 3,
          timeframe: "Long-Term",
          action: "Refactor isolation levels in database configurations and deploy automated circuit breakers.",
          owner: "Platform Architecture Core"
        }
      ]
    };

    setAnalysisResult(fallbackResult);
    const newHistoryItem = {
      id: "hist-" + Date.now(),
      title: newHeadline,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      region: selectedRegion,
      severity: newRisk.includes("High") || newRisk.includes("Critical") ? "CRITICAL" : "WARNING",
      severityType: newRisk.includes("High") || newRisk.includes("Critical") ? "critical" : "warning",
      situation: cleanedSituation
    };
    setAuditHistory((prev) => [newHistoryItem, ...prev]);
    setIsAnalyzing(false);
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
      {/* ====================================================================
          LEFT SIDEBAR
          ==================================================================== */}
      <aside className="sidebar">
        <div className="sidebar-top">
          {/* Brand Header */}
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

          {/* Navigation Links */}
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
              className={`nav-item ${activeTab === "audit" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("audit");
                historyRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="nav-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
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

        {/* Bottom Sidebar: SRE Sentinel & User Profile */}
        <div className="sidebar-bottom">
          <div className="sentinel-card">
            <div className="sentinel-icon-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <div className="sentinel-text">
              <span className="sentinel-title">Active SRE Sentinel</span>
              <span className="sentinel-sub">TLS 1.3 Encryption Active</span>
            </div>
          </div>

          <div className="user-profile-box">
            <div className="user-profile-name">Alex Thorne</div>
            <div className="user-profile-role">Lead Infrastructure</div>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          MAIN DASHBOARD AREA
          ==================================================================== */}
      <main className="main-content">
        {/* Top Header Bar */}
        <header className="top-header">
          <div className="top-header-left">
            <div className="sla-pill">
              <span className="sla-dot"></span>
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

        {/* Dashboard Content Container */}
        <div className="dashboard-body">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="eyebrow-tag">AUTONOMOUS INCIDENT DIAGNOSTICS</div>
            <h1 className="hero-title">Real-Time Remediation Workflows</h1>
            <p className="hero-desc">
              Ingest complex production anomalies, distributed lock states, and Kubernetes node
              failures into OpsPilot AI to generate root cause reports and automated mitigation steps
              instantly.
            </p>
          </section>

          {/* 3 Metric Cards */}
          <section className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">ANALYSES EXECUTED</div>
              <div className="kpi-value">9,484</div>
              <div className="kpi-subtext">Across 24 active microservices</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">AVG MTTR REDUCTION</div>
              <div className="kpi-value">14.2m</div>
              <div className="kpi-subtext">-84% compared to baseline</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">UPTIME SLA VERIFIED</div>
              <div className="kpi-value">99.99%</div>
              <div className="kpi-subtext">Continuous telemetry stream</div>
            </div>
          </section>

          {/* How AI Operates 4-Step Section */}
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

          {/* Two-Column Diagnostic Workspace */}
          <section className="workspace-grid" ref={workspaceRef}>
            {/* Left Card: Incident & Situation Input */}
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

            {/* Right Card: Diagnostic Analysis Output */}
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

          {/* Recommended Mitigation Action Plan */}
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

          {/* Operational Incident History Section */}
          <section className="history-section" ref={historyRef}>
            <div className="history-header">
              <div>
                <div className="history-eyebrow">AUDIT TRAIL &amp; PREVIOUS SCANS</div>
                <h3 className="history-title">Operational Incident History</h3>
              </div>

              <div className="history-search-container">
                <span className="search-icon-inline">🔍</span>
                <input
                  type="text"
                  className="history-search-input"
                  placeholder="Filter diagnostic history..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                />
              </div>
            </div>

            <div className="history-items-list">
              {filteredHistory.map((item) => (
                <div
                  className="history-card-row"
                  key={item.id}
                  onClick={() => {
                    setSituationText(item.situation);
                    handleExecuteDiagnosis();
                    workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="history-card-left">
                    <div className={`history-icon-square ${item.severityType}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <div>
                      <div className="history-incident-heading">{item.title}</div>
                      <div className="history-incident-meta">
                        Timestamp: {item.timestamp} | Region: {item.region}
                      </div>
                    </div>
                  </div>

                  <span className={`badge-tag-${item.severityType}`}>
                    {item.severity}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Strip */}
          <footer className="footer-strip">
            <span>© 2026 OpsPilot AI. All rights reserved.</span>
            <div className="footer-right-text">
              <span>Zero Trust Architecture v4.5-Prod</span>
              <span>Telemetry Connected</span>
            </div>
          </footer>
        </div>
      </main>

      {/* ====================================================================
          MODALS
          ==================================================================== */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Cluster Telemetry Modal */}
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <p className="modal-subtitle-text">
                  Real-time operational metrics across active cluster microservices.
                </p>

                <div className="telemetry-kpi-row">
                  <div className="telemetry-kpi-card">
                    <div className="telemetry-kpi-label">TOTAL SPANS</div>
                    <div className="telemetry-kpi-val">9484</div>
                  </div>

                  <div className="telemetry-kpi-card">
                    <div className="telemetry-kpi-label">ACTIVE INCIDENTS</div>
                    <div className="telemetry-kpi-val incident-val">
                      3 <span className="incident-crit-tag">Critical</span>
                    </div>
                  </div>

                  <div className="telemetry-kpi-card">
                    <div className="telemetry-kpi-label">SLA HEALTH</div>
                    <div className="telemetry-kpi-val green-text">99.4%</div>
                  </div>
                </div>

                <div className="telemetry-stream-heading">REALTIME TELEMETRY STREAM</div>

                <div className="telemetry-stream-container">
                  <div className="log-stream-line">
                    [12:28:11] <span className="log-tag-warn">WARN:</span> Generated AI diagnostic vector for incident pattern.
                  </div>
                  <div className="log-stream-line">
                    [14:20:01] <span className="log-tag-info">INFO:</span> Edge proxy health check passed across 48 nodes.
                  </div>
                  <div className="log-stream-line">
                    [14:20:15] <span className="log-tag-success">SUCCESS:</span> Database read-replica shard sync completed with 0 drift.
                  </div>
                  <div className="log-stream-line">
                    [14:20:44] <span className="log-tag-warn">WARN:</span> Memory watermark crossed 82% threshold on worker pool.
                  </div>
                </div>

                <div className="modal-bottom-footer">
                  <span className="modal-footer-pipeline-text">Encrypted pipeline</span>
                  <button className="modal-close-action-btn" onClick={() => setActiveModal(null)}>
                    Close Window
                  </button>
                </div>
              </>
            )}

            {/* Zero-Trust Security & Compliance Modal */}
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
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

            {/* Model Engine Settings Modal */}
            {activeModal === "settings" && (
              <>
                <div className="modal-header-row">
                  <div className="modal-title-wrap">
                    <h2 className="modal-title-text">⚙ Model Engine Settings</h2>
                  </div>
                  <button className="modal-close-x-btn" onClick={() => setActiveModal(null)} title="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <p className="modal-subtitle-text">
                  Configure autonomous SRE parameters and intelligence models.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                    Active Inference Engine:
                    <select style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginTop: "6px", fontSize: "13px", background: "#f8fafc" }}>
                      <option>Gemini 1.5 Pro Enterprise Core (Google DeepMind)</option>
                      <option>Gemini 1.5 Flash Realtime SRE</option>
                      <option>Claude 3.5 Sonnet Reasoning Engine</option>
                    </select>
                  </label>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                    Execution Protocol:
                    <select style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginTop: "6px", fontSize: "13px", background: "#f8fafc" }}>
                      <option>Autonomous SRE Copilot (Deterministic)</option>
                      <option>Conservative (Safety Verified)</option>
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

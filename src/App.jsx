import { useState } from "react";
import "./App.css";

function App() {
  const [situation, setSituation] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("opspilot-history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const analyzeSituation = async () => {
    if (!situation.trim()) {
      setError("Please describe the operational situation first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          situation: situation.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "AI analysis failed.");
      }

      setAnalysis(data.analysis);

      setHistory((previous) => {
        const newHistory = [
          {
            id: Date.now(),
            situation: situation.trim(),
            analysis: data.analysis,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...previous,
        ];

        localStorage.setItem(
          "opspilot-history",
          JSON.stringify(newHistory)
        );

        return newHistory;
      });
    } catch (err) {
      console.error(err);
      setError(
        "AI analysis failed. Please make sure the backend/API is available."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSituation("");
    setAnalysis(null);
    setError("");
  };

  const clearHistory = () => {
    localStorage.removeItem("opspilot-history");
    setHistory([]);
  };

  const riskClass = analysis?.riskLevel?.toLowerCase() || "";
  const priorityClass = analysis?.priority?.toLowerCase() || "";

  const useExample = (text) => {
    setSituation(text);
    setError("");
  };

  return (
    <div className="app-shell">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-logo">O</div>

          <div>
            <h2>OpsPilot AI</h2>
            <span>Intelligent Operations</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button className="nav-item active">
            <span className="nav-icon">⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document
                .querySelector(".workspace")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="nav-icon">✦</span>
            New Analysis
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document
                .querySelector(".history-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="nav-icon">◷</span>
            History
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document
                .querySelector(".examples-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="nav-icon">▤</span>
            Examples
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document
                .querySelector(".pipeline")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="nav-icon">ⓘ</span>
            How It Works
          </button>

          <button className="nav-item">
            <span className="nav-icon">◫</span>
            Insights
          </button>

          <button className="nav-item">
            <span className="nav-icon">⚙</span>
            Settings
          </button>

        </nav>

        <div className="sidebar-promo">
          <div className="promo-glow"></div>

          <span className="promo-label">AI OPERATIONS</span>

          <h3>
            Smarter operations.
            <br />
            Faster decisions.
          </h3>

          <p>
            Turn operational challenges into actionable intelligence.
          </p>

          <button
            onClick={() =>
              document
                .querySelector(".workspace")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Analysis →
          </button>
        </div>

        <div className="team-card">
          <div className="team-avatar">OP</div>

          <div>
            <strong>Ops Team</strong>
            <span>Administrator</span>
          </div>

          <span className="team-arrow">⌄</span>
        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="dashboard">

        {/* TOP BAR */}
        <header className="topbar">

          <div className="online-status">
            <span className="online-dot"></span>
            AI System Online
          </div>

          <div className="top-actions">

            <button className="icon-button" title="Theme">
              ☼
            </button>

            <button className="icon-button notification" title="Notifications">
              ♧
              <span>3</span>
            </button>

            <button className="export-button">
              ⇩ Export Report
            </button>

          </div>

        </header>

        <div className="dashboard-content">

          {/* ================= HERO ================= */}
          <section className="hero-dashboard">

            <div className="hero-copy">

              <div className="hero-badge">
                <span></span>
                AI OPERATIONS INTELLIGENCE
              </div>

              <h1>
                Turn operational problems
                <br />
                into{" "}
                <span>actionable decisions.</span>
              </h1>

              <p>
                Describe a real-world operational situation and OpsPilot AI
                will analyze the problem, identify potential risks, and
                recommend the next best actions.
              </p>

              <div className="hero-steps">
                <div>
                  <b>01</b>
                  <span>Describe</span>
                </div>

                <i>→</i>

                <div>
                  <b>02</b>
                  <span>Analyze</span>
                </div>

                <i>→</i>

                <div>
                  <b>03</b>
                  <span>Act</span>
                </div>
              </div>

            </div>

            <div className="hero-visual">

              <div className="orbit orbit-one"></div>
              <div className="orbit orbit-two"></div>

              <div className="brain-glow">◉</div>

              <div className="brain-core">
                <div className="brain-lines">AI</div>
              </div>

              <div className="floating-card card-chart">
                ↗
              </div>

              <div className="floating-card card-check">
                ✓
              </div>

              <div className="floating-card card-shield">
                ◇
              </div>

              <div className="floating-card card-users">
                ●●
              </div>

            </div>

          </section>

          {/* ================= WORKSPACE ================= */}
          <section className="workspace">

            {/* INPUT */}
            <div className="panel input-panel">

              <div className="panel-heading">

                <div className="heading-left">
                  <div className="step-number blue">1</div>

                  <div>
                    <h2>Describe Operational Situation</h2>
                    <p>Provide details about what is happening.</p>
                  </div>
                </div>

                <span className="panel-tag input-tag">INPUT</span>

              </div>

              <div className="textarea-wrapper">

                <textarea
                  value={situation}
                  onChange={(e) => {
                    setSituation(e.target.value);
                    setError("");
                  }}
                  maxLength={2000}
                  placeholder="Describe the operational issue, incident, or situation you are facing..."
                />

                <span className="character-count">
                  {situation.length} / 2000
                </span>

              </div>

              <div className="examples-section">

                <span className="examples-label">
                  QUICK EXAMPLES
                </span>

                <div className="example-buttons">

                  <button
                    onClick={() =>
                      useExample(
                        "The production server is running slowly and several users are experiencing timeout errors."
                      )
                    }
                  >
                    Server slowdown
                  </button>

                  <button
                    onClick={() =>
                      useExample(
                        "A production machine suddenly stopped and the operator reports an unusual noise from the motor."
                      )
                    }
                  >
                    Machine failure
                  </button>

                  <button
                    onClick={() =>
                      useExample(
                        "A database is becoming increasingly slow and customer requests are taking much longer than normal."
                      )
                    }
                  >
                    Database issue
                  </button>

                </div>

              </div>

              <div className="input-actions">

                <button
                  className="analyze-button"
                  onClick={analyzeSituation}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze with AI
                      <span>✦</span>
                    </>
                  )}
                </button>

                <button
                  className="clear-button"
                  onClick={clearAll}
                  disabled={loading}
                >
                  ⌫ &nbsp; Clear
                </button>

              </div>

              {error && (
                <div className="error-box">
                  ⚠ {error}
                </div>
              )}

            </div>

            {/* OUTPUT */}
            <div className="panel result-panel">

              <div className="panel-heading">

                <div className="heading-left">
                  <div className="step-number green">2</div>

                  <div>
                    <h2>AI Analysis Results</h2>
                    <p>AI-powered assessment and recommended actions.</p>
                  </div>
                </div>

                <span className="panel-tag output-tag">OUTPUT</span>

              </div>

              {!analysis && !loading && (
                <div className="result-empty">

                  <div className="result-icon">
                    ⌕
                  </div>

                  <h3>Your analysis results will appear here</h3>

                  <p>
                    Get started by describing an operational situation.
                  </p>

                </div>
              )}

              {loading && (
                <div className="result-empty">

                  <div className="big-loader"></div>

                  <h3>AI is analyzing the situation</h3>

                  <p>
                    Evaluating risk, possible causes and recommended actions...
                  </p>

                </div>
              )}

              {analysis && !loading && (
                <div className="analysis-result">

                  <div className="risk-grid">

                    <div className={`metric-card risk-${riskClass}`}>
                      <span>RISK LEVEL</span>
                      <strong>{analysis.riskLevel}</strong>
                    </div>

                    <div className={`metric-card priority-${priorityClass}`}>
                      <span>PRIORITY</span>
                      <strong>{analysis.priority}</strong>
                    </div>

                  </div>

                  <div className="analysis-box">
                    <span>SITUATION SUMMARY</span>
                    <p>{analysis.summary}</p>
                  </div>

                  <div className="analysis-box">
                    <span>POSSIBLE CAUSE</span>
                    <p>{analysis.possibleCause}</p>
                  </div>

                  <div className="analysis-box">

                    <span>RECOMMENDED ACTIONS</span>

                    <div className="actions-list">

                      {analysis.actions?.map((action, index) => (
                        <div className="action-row" key={index}>
                          <div>{index + 1}</div>
                          <p>{action}</p>
                        </div>
                      ))}

                    </div>

                  </div>

                </div>
              )}

            </div>

          </section>

          {/* ================= PIPELINE ================= */}
          <section className="pipeline">

            <div className="section-header">
              <div>
                <span>OPSPILOT INTELLIGENCE</span>
                <h2>How the AI works</h2>
              </div>
            </div>

            <div className="pipeline-flow">

              <div className="pipeline-step">
                <div className="pipeline-icon blue-icon">◈</div>

                <div>
                  <small>01</small>
                  <h3>Situation</h3>
                  <p>Capture operational context</p>
                </div>
              </div>

              <div className="pipeline-arrow">→</div>

              <div className="pipeline-step">
                <div className="pipeline-icon purple-icon">✦</div>

                <div>
                  <small>02</small>
                  <h3>AI Reasoning</h3>
                  <p>Analyze patterns and context</p>
                </div>
              </div>

              <div className="pipeline-arrow">→</div>

              <div className="pipeline-step">
                <div className="pipeline-icon orange-icon">◇</div>

                <div>
                  <small>03</small>
                  <h3>Risk Assessment</h3>
                  <p>Evaluate impact and likelihood</p>
                </div>
              </div>

              <div className="pipeline-arrow">→</div>

              <div className="pipeline-step">
                <div className="pipeline-icon green-icon">◎</div>

                <div>
                  <small>04</small>
                  <h3>Recommended Action</h3>
                  <p>Provide actionable recommendations</p>
                </div>
              </div>

            </div>

          </section>

          {/* ================= LOWER GRID ================= */}
          <section className="lower-grid">

            {/* RECENT */}
            <div className="recent-panel">

              <div className="section-heading">

                <div>
                  <h2>Recent Analyses</h2>
                  <p>Your latest operational analyses</p>
                </div>

                {history.length > 0 && (
                  <button onClick={clearHistory}>
                    Clear History
                  </button>
                )}

              </div>

              {history.length === 0 ? (

                <div className="no-history">
                  <div>◷</div>
                  <h3>No recent analyses</h3>
                  <p>
                    Run your first AI analysis to see it here.
                  </p>
                </div>

              ) : (

                <div className="history-list">

                  {history.slice(0, 5).map((item, index) => (

                    <div className="history-row" key={item.id}>

                      <div
                        className={`history-status ${
                          item.analysis?.riskLevel?.toLowerCase() || ""
                        }`}
                      >
                        !
                      </div>

                      <div className="history-content">

                        <strong>
                          {item.analysis?.summary ||
                            "Operational analysis completed"}
                        </strong>

                        <p>{item.situation}</p>

                      </div>

                      <div className="history-right">

                        <span
                          className={`risk-pill ${
                            item.analysis?.riskLevel?.toLowerCase() || ""
                          }`}
                        >
                          {item.analysis?.riskLevel || "Unknown"} Risk
                        </span>

                        <small>{item.time}</small>

                      </div>

                      <span className="row-arrow">›</span>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* OVERVIEW */}
            <div className="overview-panel">

              <div className="section-heading">
                <div>
                  <h2>Operations Overview</h2>
                  <p>Current activity snapshot</p>
                </div>
              </div>

              <div className="overview-grid">

                <div className="overview-card">
                  <span>Analyses Run</span>
                  <strong>{history.length}</strong>
                  <small>All time</small>
                </div>

                <div className="overview-card red">
                  <span>High Risks</span>
                  <strong>
                    {
                      history.filter(
                        (x) =>
                          x.analysis?.riskLevel?.toLowerCase() === "high" ||
                          x.analysis?.riskLevel?.toLowerCase() === "critical"
                      ).length
                    }
                  </strong>
                  <small>Detected</small>
                </div>

                <div className="overview-card green">
                  <span>Recommendations</span>
                  <strong>
                    {history.reduce(
                      (total, item) =>
                        total + (item.analysis?.actions?.length || 0),
                      0
                    )}
                  </strong>
                  <small>Generated</small>
                </div>

                <div className="overview-card blue">
                  <span>AI Engine</span>
                  <strong>ON</strong>
                  <small>Gemini powered</small>
                </div>

              </div>

              <div className="risk-overview">

                <div>
                  <span className="risk-title">RISK DISTRIBUTION</span>
                  <h3>Operational Risk</h3>
                </div>

                <div className="risk-bars">

                  <div>
                    <span>High</span>
                    <div className="bar">
                      <i className="high-bar"></i>
                    </div>
                  </div>

                  <div>
                    <span>Medium</span>
                    <div className="bar">
                      <i className="medium-bar"></i>
                    </div>
                  </div>

                  <div>
                    <span>Low</span>
                    <div className="bar">
                      <i className="low-bar"></i>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>

        <footer className="dashboard-footer">
          <span>© 2026 OpsPilot AI. All rights reserved.</span>
          <span>AI Infra Summit Hackathon 2026</span>
          <span>Powered by Gemini AI</span>
        </footer>

      </main>

    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";

function App() {
  const [situation, setSituation] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem("opspilot-history");
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Could not load history:", error);
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
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          situation,
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
            time: new Date().toLocaleTimeString(),
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
        "AI analysis failed. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const riskClass = analysis?.riskLevel
    ? analysis.riskLevel.toLowerCase()
    : "";

  const priorityClass = analysis?.priority
    ? analysis.priority.toLowerCase()
    : "";

  const clearAll = () => {
    setSituation("");
    setAnalysis(null);
    setError("");
  };

  const clearHistory = () => {
    localStorage.removeItem("opspilot-history");
    setHistory([]);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">O</div>

          <div>
            <h2>OpsPilot AI</h2>
            <span>Intelligent Operations Assistant</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI System Online
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="badge">AI OPERATIONS INTELLIGENCE</div>

          <h1>
            Turn operational problems
            <br />
            into <span>actionable decisions.</span>
          </h1>

          <p>
            Describe a real-world operational situation and OpsPilot AI will
            analyze the problem, identify potential risks, and recommend the
            next best actions.
          </p>
        </section>

        <section className="workspace">
          <div className="input-card">
            <div className="card-header">
              <div>
                <h3>Operational Situation</h3>
                <p>Describe what is happening right now.</p>
              </div>

              <span className="input-label">INPUT</span>
            </div>

            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Example: A production machine suddenly stopped and the operator reports an unusual noise from the motor..."
            />

            <div className="examples">
              <span>Try an example:</span>

              <button
                type="button"
                onClick={() =>
                  setSituation(
                    "The production server is running slowly and several users are experiencing timeout errors."
                  )
                }
              >
                Server slowdown
              </button>

              <button
                type="button"
                onClick={() =>
                  setSituation(
                    "A production machine suddenly stopped and the operator reports an unusual noise from the motor."
                  )
                }
              >
                Machine failure
              </button>

              <button
                type="button"
                onClick={() =>
                  setSituation(
                    "A database is becoming increasingly slow and customer requests are taking much longer than normal."
                  )
                }
              >
                Database issue
              </button>
            </div>

            <div className="button-row">
              <button
                className="analyze-button"
                onClick={analyzeSituation}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze with AI →"}
              </button>

              <button
                className="clear-button"
                onClick={clearAll}
                disabled={loading}
              >
                Clear
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="result-card">
            <div className="card-header">
              <div>
                <h3>AI Analysis</h3>
                <p>Intelligent assessment and recommended response.</p>
              </div>

              <span className="output-label">OUTPUT</span>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="loader"></div>

                <h4>Analyzing situation...</h4>

                <p>
                  OpsPilot is evaluating the situation and generating
                  recommendations.
                </p>
              </div>
            ) : analysis ? (
              <div className="analysis-content">
                <div className="status-cards">
                  <div className={`status-card risk-${riskClass}`}>
                    <span>RISK LEVEL</span>
                    <strong>{analysis.riskLevel}</strong>
                  </div>

                  <div className={`status-card priority-${priorityClass}`}>
                    <span>PRIORITY</span>
                    <strong>{analysis.priority}</strong>
                  </div>
                </div>

                <div className="analysis-section">
                  <div className="section-title">SITUATION SUMMARY</div>
                  <p>{analysis.summary}</p>
                </div>

                <div className="analysis-section">
                  <div className="section-title">POSSIBLE CAUSE</div>
                  <p>{analysis.possibleCause}</p>
                </div>

                <div className="analysis-section">
                  <div className="section-title">
                    RECOMMENDED ACTIONS
                  </div>

                  <div className="actions-list">
                    {analysis.actions?.map((action, index) => (
                      <div className="action-item" key={index}>
                        <span>{index + 1}</span>
                        <p>{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✦</div>

                <h4>Waiting for analysis</h4>

                <p>
                  Submit an operational situation to receive an AI-powered
                  assessment.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="pipeline">
          <div className="pipeline-title">
            OPSPILOT INTELLIGENCE PIPELINE
          </div>

          <div className="pipeline-flow">
            <div className="pipeline-item">
              <strong>01</strong>
              Situation
            </div>

            <div className="arrow">→</div>

            <div className="pipeline-item">
              <strong>02</strong>
              AI Reasoning
            </div>

            <div className="arrow">→</div>

            <div className="pipeline-item">
              <strong>03</strong>
              Risk Assessment
            </div>

            <div className="arrow">→</div>

            <div className="pipeline-item">
              <strong>04</strong>
              Recommended Action
            </div>
          </div>
        </section>

        <section className="history-section">
          <div className="history-header">
            <div>
              <div className="pipeline-title">ANALYSIS HISTORY</div>
              <h3>Recent Operations</h3>
            </div>

            <div className="history-controls">
              <span>{history.length} analyses</span>

              {history.length > 0 && (
                <button
                  type="button"
                  className="history-clear"
                  onClick={clearHistory}
                >
                  Clear History
                </button>
              )}
            </div>
          </div>

          {history.length === 0 ? (
            <div className="history-empty">
              No previous analyses yet. Run an analysis to create history.
            </div>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div className="history-item" key={item.id}>
                  <div className="history-number">
                    {index + 1}
                  </div>

                  <div className="history-info">
                    <strong>
                      {item.analysis?.summary || "Analysis completed"}
                    </strong>

                    <p>{item.situation}</p>
                  </div>

                  <div className="history-meta">
                    <span>
                      {item.analysis?.riskLevel || "Unknown"}
                    </span>

                    <small>{item.time}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>OpsPilot AI • AI Infra Summit Hackathon 2026</span>
        <span>Powered by Gemini AI</span>
      </footer>
    </div>
  );
}

export default App;

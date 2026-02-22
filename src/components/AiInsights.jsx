import React, { useEffect, useRef, useState } from "react";
import "../styles/aiinsights.css";
import aiInsightsData from "../API/AI_Insights.json";

/* ======================================================
   CONFIG – ADD YOUR GEMINI API KEY HERE
   ====================================================== */

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/* ======================================================
   Animated Counter Hook
   ====================================================== */

const useCounter = (end, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
};

/* ======================================================
   Metric Card
   ====================================================== */

const MetricCard = ({ title, value, sub, accent }) => {
  const animatedValue = useCounter(value);

  return (
    <div className={`ai-metric-card ${accent}`}>
      <span className="metric-title">{title}</span>
      <h2 className="metric-value">{animatedValue}</h2>
      <span className="metric-sub">{sub}</span>
    </div>
  );
};

/* ======================================================
   Sparkline Chart
   ====================================================== */

const Sparkline = () => {
  const points =
    "0,40 20,35 40,38 60,28 80,30 100,20 120,22 140,18 160,25";

  return (
    <svg viewBox="0 0 160 50" className="sparkline">
      <polyline
        fill="none"
        stroke="url(#grad1)"
        strokeWidth="3"
        points={points}
      />
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="160" y2="0">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ======================================================
   Insight Card
   ====================================================== */

const InsightCard = ({ title, level, confidence }) => (
  <div className={`insight-card ${level}`}>
    <div>
      <strong>{title}</strong>
      <p>Confidence {confidence}%</p>
    </div>
    <button className="btn-ghost">View</button>
  </div>
);

/* ======================================================
   Gemini Chat Component
   ====================================================== */

const GeminiChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello 👋 I am your AI Root Cause Assistant. Ask me about anomalies, risks or performance insights."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
You are an Enterprise AI Root Cause Assistant.
Provide structured output:

1. Root Cause
2. Impact
3. Risk Level
4. Recommended Actions

User Query:
${userText}
`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini.";

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: aiText }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠ Error connecting to Gemini API."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>AI Root Cause Assistant (Gemini)</h3>
      </div>

      <div className="ai-chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant typing">
            Gemini is analyzing...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="ai-chat-input">
        <input
          type="text"
          placeholder="Ask about anomalies, OCR spikes, performance..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

/* ======================================================
   MAIN PAGE
   ====================================================== */

const AiInsights = () => {
  const { metrics: metricsData, aiPredictionsAndTrends, aiGeneratedInsights, smartRecommendations } = aiInsightsData.result;

  const metrics = [
    { 
      title: "AI Analysis Runs", 
      value: metricsData.aiAnalysisRuns.total, 
      sub: `+${metricsData.aiAnalysisRuns.todayIncrease} today`, 
      accent: "blue" 
    },
    { 
      title: "Detected Anomalies", 
      value: metricsData.detectedAnomalies.total, 
      sub: `${metricsData.detectedAnomalies.highSeverity} high severity`, 
      accent: "red" 
    },
    { 
      title: "Predicted Risks", 
      value: metricsData.predictedRisks.total, 
      sub: `Next 7 days`, 
      accent: "yellow" 
    },
    { 
      title: "Auto-Resolved Alerts", 
      value: metricsData.autoResolvedAlerts.total, 
      sub: metricsData.autoResolvedAlerts.accuracy + " accuracy", 
      accent: "green" 
    }
  ];

  return (
    <div className="aiinsights-page">
      {/* Header */}
      <div className="ai-top-row">
        <div>
          <h2>AI Insights</h2>
          <p>AI powered anomaly intelligence & smart remediation</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="ai-metrics">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="ai-grid">
        <div className="ai-main">
          <GeminiChat />
        </div>

        <div className="ai-side">
          {/* Predictions */}
          <div className="side-card">
            <h4>AI Predictions & Trends</h4>
            <Sparkline />
            <p className="trend-value">{aiPredictionsAndTrends.direction === 'up' ? '↑' : '↓'} {aiPredictionsAndTrends.trendPercentage}% {aiPredictionsAndTrends.forecastWindow.replace('_', ' ')}</p>
          </div>

          {/* Insights */}
          <div className="side-card">
            <h4>AI Generated Insights</h4>
            {aiGeneratedInsights.map((insight, idx) => {
              const confidenceLevel = insight.confidence >= 85 ? 'high' : insight.confidence >= 70 ? 'medium' : 'low';
              return (
                <InsightCard
                  key={idx}
                  title={insight.title}
                  level={confidenceLevel}
                  confidence={insight.confidence}
                />
              );
            })}
          </div>

          {/* Smart Recommendations */}
          <div className="side-card">
            <h4>Smart Recommendations</h4>
            {smartRecommendations.map((rec, idx) => (
              <div key={idx} className="recommend-item">{rec}</div>
            ))}
          </div>

          {/* Actions */}
          <div className="side-card actions">
            <button className="btn-primary">Open Incident</button>
            <button className="btn-outline">Run Auto-Remediate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
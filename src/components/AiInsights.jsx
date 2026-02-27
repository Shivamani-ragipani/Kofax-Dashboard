import React, { useEffect, useRef, useState } from "react";
import "../styles/aiinsights.css";
import aiInsightsData from "../API/AI_Insights.json";

/* ================================
   Gemini Configuration
================================ */

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const GEMINI_ENDPOINT =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

/* ================================
   Animated Counter Hook
================================ */

const useCounter = (end, duration = 900) => {

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


/* ================================
   Metric Card
================================ */

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


/* ================================
   Sparkline
================================ */

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


/* ================================
   Insight Card
================================ */

const InsightCard = ({ title, level, confidence }) => (

  <div className={`insight-card ${level}`}>

    <div>

      <strong>{title}</strong>
      <p>Confidence {confidence}%</p>

    </div>

    <button className="btn-ghost">
      View
    </button>

  </div>

);


/* ================================
   Gemini API Service
================================ */

const callGemini = async (messages) => {

  const latestUserMessage =
    messages.filter(m => m.role === "user").slice(-1)[0]?.content;

  const response = await fetch(GEMINI_ENDPOINT, {

    method: "POST",

    headers: {

      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY

    },

    body: JSON.stringify({

      contents: [

        {
          parts: [
            {
              text: `
You are an Enterprise AI Root Cause Assistant.

Respond professionally.

Structure output:

1. Root Cause
2. Impact
3. Risk Level
4. Recommended Actions

User Question:

${latestUserMessage}
`
            }
          ]
        }

      ]

    })

  });

  const data = await response.json();

  return data?.candidates?.[0]?.content?.parts?.[0]?.text
    || "No response generated.";

};


/* ================================
   Gemini Chat Component
================================ */

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

  const chatRef = useRef(null);


/* Auto Scroll */

  useEffect(() => {

    chatRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);


/* Send Message */

  const sendMessage = async () => {

    if (!input.trim() || loading) return;

    const newMessages = [

      ...messages,

      {
        role: "user",
        content: input
      }

    ];

    setMessages(newMessages);

    setInput("");

    setLoading(true);

    try {

      const aiReply =
        await callGemini(newMessages);

      setMessages(prev => [

        ...prev,

        {
          role: "assistant",
          content: aiReply
        }

      ]);

    }

    catch {

      setMessages(prev => [

        ...prev,

        {
          role: "assistant",
          content:
            "⚠ AI service temporarily unavailable."
        }

      ]);

    }

    setLoading(false);

  };


/* UI */

  return (

    <div className="ai-chat-container">

      <div className="ai-chat-header">

        <h3>AI Root Cause Assistant</h3>

      </div>


      <div className="ai-chat-messages">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`chat-message ${msg.role}`}
          >
            {msg.content}
          </div>

        ))}


        {loading && (

          <div className="chat-message assistant typing">
            Gemini analyzing...
          </div>

        )}

        <div ref={chatRef} />

      </div>


      <div className="ai-chat-input">

        <input
          type="text"
          placeholder="Ask about anomalies, OCR spikes, failures..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button onClick={sendMessage}>

          {loading ? "..." : "Send"}

        </button>

      </div>

    </div>

  );

};


/* ================================
   Main Page
================================ */

const AiInsights = () => {

  const {
    metrics: metricsData,
    aiPredictionsAndTrends,
    aiGeneratedInsights,
    smartRecommendations
  } = aiInsightsData.result;


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
      sub: "Next 7 days",
      accent: "yellow"
    },

    {
      title: "Auto-Resolved Alerts",
      value: metricsData.autoResolvedAlerts.total,
      sub: metricsData.autoResolvedAlerts.accuracy,
      accent: "green"
    }

  ];


  return (

    <div className="aiinsights-page">


      <div className="ai-top-row">

        <div>

          <h2>AI Insights</h2>

          <p>
            AI powered anomaly intelligence &
            smart remediation
          </p>

        </div>

      </div>


      <div className="ai-metrics">

        {metrics.map((m,i)=>(
          <MetricCard key={i} {...m}/>
        ))}

      </div>


      <div className="ai-grid">

        <div className="ai-main">

          <GeminiChat/>

        </div>


        <div className="ai-side">


          <div className="side-card">

            <h4>AI Predictions & Trends</h4>

            <Sparkline/>

            <p className="trend-value">

              {aiPredictionsAndTrends.direction === "up" ? "↑":"↓"}

              {" "}

              {aiPredictionsAndTrends.trendPercentage}%

              {" "}

              {aiPredictionsAndTrends.forecastWindow.replace("_"," ")}

            </p>

          </div>


          <div className="side-card">

            <h4>AI Generated Insights</h4>

            {aiGeneratedInsights.map((i,x)=>{

              const lvl =
              i.confidence>85?"high":
              i.confidence>70?"medium":"low";

              return(

                <InsightCard
                key={x}
                title={i.title}
                level={lvl}
                confidence={i.confidence}
                />

              )

            })}

          </div>


          <div className="side-card">

            <h4>Smart Recommendations</h4>

            {smartRecommendations.map((r,i)=>(
              <div
              key={i}
              className="recommend-item">
                {r}
              </div>
            ))}

          </div>


          <div className="side-card actions">

            <button className="btn-primary">
              Open Incident
            </button>

            <button className="btn-outline">
              Run Auto-Remediate
            </button>

          </div>


        </div>

      </div>

    </div>

  );

};


export default AiInsights;
import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import graphData from "../API/Graph-data.json";
import "../styles/charts.css";

const COLORS = [
  "#22d3ee", // Cyan - Alight
  "#8b5cf6", // Purple - Apex (Penson)
  "#22c55e", // Green - David Lerner
  "#f97316", // Orange - Hilltop
  "#ef4444", // Red - JPMC
  "#ec4899", // Pink - Leede Jones Gable
  "#06b6d4", // Teal - NBIN (Inform)
  "#fbbf24", // Yellow - Oppenheimer
  "#14b8a6", // Emerald - Raymond James (Inform)
  "#a78bfa", // Light Purple - WorldSource (Inform)
];

export default function ChartsSection() {
  const [summary, setSummary] = useState(null);
  const [clients, setClients] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // table | bar | pie
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLineChartCollapsed, setIsLineChartCollapsed] = useState(false);
  const [isPieChartCollapsed, setIsPieChartCollapsed] = useState(false);

  useEffect(() => {
    const data = graphData?.data;
    if (!data) return;

    setSummary(data.summary);
    setClients(data.clients);
  }, []);

  /* =========================
     GLOBAL SUCCESS VS ERROR PIE
  ========================== */
  const overallPieData = useMemo(() => {
    if (!summary) return [];
    return [
      { name: "Success", value: summary.totalSuccess },
      { name: "Error", value: summary.totalError },
    ];
  }, [summary]);

  /* =========================
     LINE DATA
  ========================== */
  const lineChartData = useMemo(() => {
    return clients.map((client) => ({
      name: client.clientName,
      Success: client.success,
      Error: client.error,
    }));
  }, [clients]);

  /* =========================
     BAR DATA
  ========================== */
  const barChartData = useMemo(() => {
    return clients;
  }, [clients]);

  /* =========================
     CLIENT DISTRIBUTION PIE
  ========================== */
  const clientPieData = useMemo(() => {
    return clients
      .filter((c) => c.totalFiles > 0)
      .map((client, index) => {
        // Find original index in clients array
        const originalIndex = clients.findIndex(
          (c) => c.clientName === client.clientName,
        );
        return {
          name: client.clientName,
          value: client.totalFiles,
          originalIndex: originalIndex,
        };
      });
  }, [clients]);

  const totalFiles = useMemo(() => {
    return clients.reduce((sum, c) => sum + c.totalFiles, 0);
  }, [clients]);

  const topClient = useMemo(() => {
    if (!clients.length) return null;
    return [...clients].sort((a, b) => b.totalFiles - a.totalFiles)[0];
  }, [clients]);

  if (!summary) return null;

  return (
    <div className="charts-section">
      {/* ================= LINE CHART ================= */}
      <div className="chart-card large">
        <div className="chart-header">
          <h3 className="chart-title">Client Success vs Error Overview</h3>
          <button
            className="collapse-btn"
            onClick={() => setIsLineChartCollapsed(!isLineChartCollapsed)}
            title={isLineChartCollapsed ? "Expand" : "Collapse"}
          >
            {isLineChartCollapsed ? "▼" : "▲"}
          </button>
        </div>

        {!isLineChartCollapsed && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Success"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Error"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ================= OVERALL PIE ================= */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Overall Processing Distribution</h3>
          <button
            className="collapse-btn"
            onClick={() => setIsPieChartCollapsed(!isPieChartCollapsed)}
            title={isPieChartCollapsed ? "Expand" : "Collapse"}
          >
            {isPieChartCollapsed ? "▼" : "▲"}
          </button>
        </div>

        {!isPieChartCollapsed && (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={overallPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#22d3ee" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-labels">
              <div>Success Rate: {summary.successRate}%</div>
              <div>Error Rate: {summary.errorRate}%</div>
            </div>
          </>
        )}
      </div>

      {/* ================= DYNAMIC VIEW SECTION ================= */}
      <div className="chart-card large">
        <div className="chart-header">
          <h3 className="chart-title">Client Processing Metrics</h3>

          <div className="header-controls">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="view-selector"
            >
              <option value="table">Table</option>
              <option value="bar">Bar Graph</option>
              <option value="pie">Pie Chart</option>
            </select>

            <button
              className="collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? "▼" : "▲"}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            {/* ================= TABLE VIEW ================= */}
            {viewMode === "table" && (
              <div className="feature-table-container">
                <table className="feature-usage-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Total Files</th>
                      <th>Success</th>
                      <th>Error</th>
                      <th>Success %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, index) => {
                      const successRate =
                        client.totalFiles > 0
                          ? (
                              (client.success / client.totalFiles) *
                              100
                            ).toFixed(1)
                          : 0;

                      return (
                        <tr key={index}>
                          <td>{client.clientName}</td>
                          <td>{client.totalFiles.toLocaleString()}</td>
                          <td>{client.success.toLocaleString()}</td>
                          <td>{client.error.toLocaleString()}</td>
                          <td>{successRate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ================= BAR VIEW ================= */}
            {viewMode === "bar" && (
              <>
                <div className="chart-kpis">
                  <div className="kpi-box">
                    <span className="kpi-label">Total Files</span>
                    <span className="kpi-value">
                      {totalFiles.toLocaleString()}
                    </span>
                  </div>

                  {topClient && (
                    <div className="kpi-box">
                      <span className="kpi-label">Top Client</span>
                      <span className="kpi-value">{topClient.clientName}</span>
                    </div>
                  )}
                </div>

                {/* Client Color Legend */}
                <div className="client-legend">
                  {clients.map((client, index) => (
                    <div key={index} className="legend-item-client">
                      <span
                        className="legend-color-box"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></span>
                      <span className="legend-text">{client.clientName}</span>
                    </div>
                  ))}
                </div>

                <ResponsiveContainer width="100%" height={500}>
                  <BarChart
                    data={barChartData}
                    margin={{ bottom: 100, left: 10, right: 10, top: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis
                      dataKey="clientName"
                      stroke="rgba(255,255,255,0.6)"
                      angle={-35}
                      textAnchor="end"
                      height={90}
                      interval={0}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip />
                    <Bar dataKey="totalFiles" radius={[8, 8, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}

            {/* ================= CLIENT PIE VIEW ================= */}
            {viewMode === "pie" && (
              <>
                {/* Client Color Legend */}
                <div className="client-legend">
                  {clientPieData.map((client, index) => (
                    <div key={index} className="legend-item-client">
                      <span
                        className="legend-color-box"
                        style={{
                          backgroundColor:
                            COLORS[client.originalIndex % COLORS.length],
                        }}
                      ></span>
                      <span className="legend-text">{client.name}</span>
                    </div>
                  ))}
                </div>

                <ResponsiveContainer width="100%" height={380}>
                  <PieChart>
                    <Pie
                      data={clientPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      dataKey="value"
                      label
                    >
                      {clientPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.originalIndex % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

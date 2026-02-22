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
  "#22d3ee",
  "#8b5cf6",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

export default function ChartsSection() {
  const [summary, setSummary] = useState(null);
  const [clients, setClients] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // table | bar | pie

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
      .map((client) => ({
        name: client.clientName,
        value: client.totalFiles,
      }));
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
        <h3 className="chart-title">Client Success vs Error Overview</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
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
      </div>

      {/* ================= OVERALL PIE ================= */}
      <div className="chart-card">
        <h3 className="chart-title">Overall Processing Distribution</h3>

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
      </div>

      {/* ================= DYNAMIC VIEW SECTION ================= */}
      <div className="chart-card large">

        <div className="chart-header">
          <h3 className="chart-title">Client Processing Metrics</h3>

          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="view-selector"
          >
            <option value="table">Table</option>
            <option value="bar">Bar Graph</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

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
                      ? ((client.success / client.totalFiles) * 100).toFixed(1)
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
                  <span className="kpi-value">
                    {topClient.clientName}
                  </span>
                </div>
              )}
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="clientName" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip />
                <Bar
                  dataKey="totalFiles"
                  radius={[8, 8, 0, 0]}
                  fill="url(#barGradient)"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* ================= CLIENT PIE VIEW ================= */}
        {viewMode === "pie" && (
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
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
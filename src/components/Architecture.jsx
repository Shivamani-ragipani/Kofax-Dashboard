import React, { useState, useEffect, useMemo } from "react";
import architectureData from "../API/Architecture.json";
import "../styles/architecture.css";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

function Architecture() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [environment, setEnvironment] = useState("Prod");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (architectureData.status === "success") {
      setClients(architectureData.data);
      if (architectureData.data.length > 0) {
        setSelectedClientId(architectureData.data[0].client.id);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedClientId]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) =>
      c.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const selectedClient = filteredClients.find(
    (c) => c.client.id === selectedClientId
  );

  useEffect(() => {
    if (filteredClients.length > 0 && !selectedClient) {
      setSelectedClientId(filteredClients[0].client.id);
    }
  }, [filteredClients, selectedClient]);

  if (!selectedClient) return null;

  const { client, architecture } = selectedClient;

  const images =
    architecture.diagramImages ||
    (architecture.diagramImageUrl
      ? [architecture.diagramImageUrl]
      : []);

  return (
    <div className="architecture-page">

      <div className="arch-topbar">
        <div className="arch-left-controls">
          <div className="select-client">
            <label>Select Client</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              {filteredClients.map((c) => (
                <option key={c.client.id} value={c.client.id}>
                  {c.client.name}
                </option>
              ))}
            </select>
          </div>

          
        </div>

        <div className="environment-switch">
          <span>Environment</span>
          {["Prod", "UAT", "Dev"].map((env) => (
            <button
              key={env}
              className={environment === env ? "env-btn active" : "env-btn"}
              onClick={() => setEnvironment(env)}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      <div className="arch-content">

        <div className="diagram-card">
          <div className="diagram-header">
            <h3>{client.name} – System Architecture</h3>
          </div>

          <div className="diagram-image-container">
            {images.length > 0 && (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={`${client.name} Architecture`}
                  className="diagram-image"
                />

                {images.length > 1 && (
                  <>
                    <button
                      className="slider-btn left"
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      className="slider-btn right"
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      <ChevronRight size={18} />
                    </button>

                    <div className="slider-indicators">
                      {images.map((_, index) => (
                        <span
                          key={index}
                          className={
                            index === currentImageIndex
                              ? "indicator active"
                              : "indicator"
                          }
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="details-card">
          <h3>Architecture Details</h3>

          <table className="arch-table">
            <tbody>
              <tr>
                <td>Team</td>
                <td>{client.team}</td>
              </tr>
              <tr>
                <td>Industry</td>
                <td>{client.industry}</td>
              </tr>
              <tr>
                <td>Deployment Type</td>
                <td>{architecture.deploymentType}</td>
              </tr>
              <tr>
                <td>Hosting Environment</td>
                <td>{architecture.hostingEnvironment}</td>
              </tr>
              <tr>
                <td>Database</td>
                <td>{architecture.database}</td>
              </tr>
              <tr>
                <td>Core Modules</td>
                <td>
                  <div className="badge-group">
                    {architecture.coreModules.map((item, index) => (
                      <span key={index} className="badge">
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Integrations</td>
                <td>
                  <div className="badge-group">
                    {architecture.integrations.map((item, index) => (
                      <span key={index} className="badge">
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Security</td>
                <td>
                  <div className="badge-group">
                    {architecture.security.map((item, index) => (
                      <span key={index} className="badge">
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="data-flow">
        <h3>Data Flow Summary</h3>
        <ol>
          {architecture.dataFlowSummary.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Architecture;
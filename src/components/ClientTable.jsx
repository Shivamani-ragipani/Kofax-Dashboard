import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import clientData from "../API/clientOverviews.json";
import "../styles/client-table.css";

export default function ClientTable() {
  const [clients, setClients] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const data = clientData?.result?.clientOverviews || [];
    setClients(data);
  }, []);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="table-card">
      <h3 className="table-title">Client Implementation Details</h3>

      <div className="table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th></th>
              <th>Client Name</th>
              <th>Type</th>
              <th>Citrix</th>
              <th>Barcode</th>
              <th>OCR</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client, index) => {
              const isOpen = expandedRow === index;

              return (
                <React.Fragment key={index}>
                  <tr
                    className={`clickable-row ${isOpen ? "row-active" : ""}`}
                    onClick={() => toggleRow(index)}
                  >
                    <td className="toggle-cell">
                      <ChevronDown
                        size={18}
                        className={`chevron-icon ${
                          isOpen ? "rotate" : ""
                        }`}
                      />
                    </td>

                    <td className="client-name">{client.clientName}</td>
                    <td>{client.type}</td>
                    <td>{client.citrix ? "Yes" : "No"}</td>
                    <td>{client.barcode ? "Yes" : client.barcode}</td>
                    <td>
                      {client.ocr === false
                        ? "No"
                        : client.ocr === true
                        ? "Yes"
                        : client.ocr}
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="expanded-row">
                      <td colSpan="6">
                        <div className="expanded-content">
                          <p className="client-description">
                            {client.description}
                          </p>

                          <div className="detail-grid">
                            <DetailBlock title="Ingestion" data={client.ingestion} />
                            <DetailBlock title="Batch Classes" data={client.batchClasses} />
                            <DetailBlock title="Modules" data={client.modules} />
                            <DetailBlock title="Lookups" data={client.lookups} />
                            <DetailBlock title="Export" data={client.export} />
                            <DetailBlock title="IWS Services" data={client.iwsServices} />
                          </div>

                          {client.specialNote && (
                            <div className="special-note">
                              {client.specialNote}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailBlock({ title, data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="detail-block">
      <h4>{title}</h4>
      <div className="tag-container">
        {data.map((item, index) => (
          <span key={index} className="detail-tag">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
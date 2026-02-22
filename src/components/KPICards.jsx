import React, { useState, useEffect } from "react";
import {
  Users,
  Database,
  Grid2x2,
  Activity,
  Building2,
  ScanLine,
  Barcode,
  Eye,
  Search,
  X,
} from "lucide-react";
import dashboardData from "../API/Count.json";
import "../styles/kpi-cards.css";

export default function KPICards() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const summary = dashboardData?.result?.summary;
    if (!summary) return;

    const dynamicCards = [
      {
        title: summary.totalClients.title,
        value: summary.totalClients.count,
        description: summary.totalClients.description,
        icon: Users,
        accent: "blue",
        details: summary.totalClients,
      },
      {
        title: summary.kofaxClients.title,
        value: summary.kofaxClients.count,
        description: summary.kofaxClients.description,
        icon: Database,
        accent: "green",
        details: summary.kofaxClients,
      },
      {
        title: summary.ttaClients.title,
        value: summary.ttaClients.count,
        description: summary.ttaClients.description,
        icon: Grid2x2,
        accent: "purple",
        details: summary.ttaClients,
      },
      {
        title: summary.clientTypeDistribution.internal.title,
        value: summary.clientTypeDistribution.internal.count,
        description: summary.clientTypeDistribution.internal.description,
        icon: Building2,
        accent: "orange",
        details: summary.clientTypeDistribution.internal,
      },
      {
        title: summary.citrixUsage.enabled.title,
        value: summary.citrixUsage.enabled.count,
        description: summary.citrixUsage.enabled.description,
        icon: Activity,
        accent: "cyan",
        details: summary.citrixUsage.enabled,
      },
      {
        title: summary.barcodeUsage.enabled.title,
        value: summary.barcodeUsage.enabled.count,
        description: "Clients using barcode feature",
        icon: Barcode,
        accent: "indigo",
        details: summary.barcodeUsage.enabled,
      },
      {
        title: summary.ocrUsage.enabledOrPartial.title,
        value: summary.ocrUsage.enabledOrPartial.count,
        description: "OCR enabled clients",
        icon: Eye,
        accent: "yellow",
        details: summary.ocrUsage.enabledOrPartial,
      },
      {
        title: summary.lookupUsage.databaseLookup.title,
        value: summary.lookupUsage.databaseLookup.count,
        description: "Clients using database lookup",
        icon: Search,
        accent: "red",
        details: summary.lookupUsage.databaseLookup,
      },
    ];

    setCards(dynamicCards);
  }, []);

  return (
    <>
      <div className="kpi-cards-container">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className={`kpi-card accent-${card.accent}`}
              onClick={() => setSelectedCard(card)}
            >
              <div className="kpi-card-header">
                <h3 className="kpi-title">{card.title.toUpperCase()}</h3>
                <Icon className="kpi-icon" size={22} />
              </div>

              <div className="kpi-value">{card.value}</div>
              <div className="kpi-subtext">{card.description}</div>
            </div>
          );
        })}
      </div>

      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedCard.title}</h2>
              <X
                className="close-icon"
                onClick={() => setSelectedCard(null)}
              />
            </div>

            <p className="modal-description">
              {selectedCard.details.description}
            </p>

            <div className="modal-count">
              Total Count: <strong>{selectedCard.value}</strong>
            </div>

            {selectedCard.details.clients &&
              selectedCard.details.clients.length > 0 && (
                <div className="client-list">
                  <h4>Client List</h4>
                  <ul>
                    {selectedCard.details.clients.map((client, idx) => (
                      <li key={idx}>{client}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}
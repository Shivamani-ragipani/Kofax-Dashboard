import React, { useState } from "react";
import data from "../API/Certificates.json";
import "../styles/certificates.css";

import {
  Shield,
  Clock,
  XCircle,
  CheckCircle,
  Search,
  Users,
  Activity,
  Calendar
} from "lucide-react";

const Certificates = () => {
  const { summary, filters, certificates, expiryTimeline } = data.results;

  const [team, setTeam] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const filteredCertificates = certificates.filter((c) => {
    const teamMatch = team === "All" || c.team === team;
    const statusMatch = status === "All" || c.status === status;

    const searchMatch =
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase());

    return teamMatch && statusMatch && searchMatch;
  });

  const getStatusClass = (status) => {
    if (status === "Healthy") return "cert-status healthy";
    if (status === "Expiring Soon") return "cert-status expiring";
    return "cert-status expired";
  };

  return (
    <div className="certificates-container">

      <h2 className="certificates-title">Certificate Monitor</h2>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="cert-summary-grid">

        <div className="cert-card blue">

          <div className="cert-card-header">

            <div>
              <div className="cert-card-title">Total Certificates</div>
              <div className="cert-card-value">{summary.totalCertificates}</div>
            </div>

            <Shield size={28} className="cert-card-icon blue" />

          </div>

        </div>


        <div className="cert-card orange">

          <div className="cert-card-header">

            <div>
              <div className="cert-card-title">Expiring Soon (30 days)</div>
              <div className="cert-card-value">{summary.expiringSoon}</div>
            </div>

            <Clock size={28} className="cert-card-icon orange" />

          </div>

        </div>


        <div className="cert-card red">

          <div className="cert-card-header">

            <div>
              <div className="cert-card-title">Expired Certificates</div>
              <div className="cert-card-value">{summary.expiredCertificates}</div>
            </div>

            <XCircle size={28} className="cert-card-icon red" />

          </div>

        </div>


        <div className="cert-card green">

          <div className="cert-card-header">

            <div>
              <div className="cert-card-title">Healthy Certificates</div>
              <div className="cert-card-value">{summary.healthyCertificates}</div>
            </div>

            <CheckCircle size={28} className="cert-card-icon green" />

          </div>

        </div>

      </div>


      {/* ================= FILTER BAR ================= */}

      <div className="cert-filter-section">

        <div className="cert-filter-row">

          <div className="cert-input-group">
            <Search size={16} />
            <input
              className="cert-search"
              placeholder="Search client or domain"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


          <div className="cert-input-group">
            <Users size={16} />
            <select
              className="cert-select"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            >
              {filters.teamOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>


          <div className="cert-input-group">
            <Activity size={16} />
            <select
              className="cert-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>All</option>
              {filters.statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>


          <div className="cert-input-group">
            <Calendar size={16} />
            <select className="cert-select">
              <option>Expiry Range</option>
              <option>7 days</option>
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
            </select>
          </div>

        </div>

      </div>


      {/* ================= CERTIFICATE TABLE ================= */}

      <div className="cert-table-wrapper">

        <h3 className="cert-table-title">All Certificates</h3>

        <table className="cert-table">

          <thead>

            <tr>
              <th>Client Name</th>
              <th>Domain / Site URL</th>
              <th>Product</th>
              <th>Certificate Provider</th>
              <th>Issued Date</th>
              <th>Expiry Date</th>
              <th>Days Remaining</th>
              <th>Status</th>
              <th>Renewal Owner</th>
              <th>Actions</th>
            </tr>

          </thead>


          <tbody>

            {filteredCertificates.map((c, i) => (

              <tr key={i}>

                <td>{c.clientName}</td>

                <td>{c.domain}</td>

                <td>{c.product}</td>

                <td>{c.certificateProvider}</td>

                <td>{c.issuedDate}</td>

                <td>{c.expiryDate}</td>

                <td>{c.daysRemaining}</td>

                <td>
                  <span className={getStatusClass(c.status)}>
                    {c.status}
                  </span>
                </td>

                <td>{c.renewalOwner}</td>

                <td className="cert-action">
                  Renew / View Details
                </td>

              </tr>

            ))}

          </tbody>

        </table>


        {/* ================= EXPIRY TIMELINE ================= */}

        <div className="cert-expiry-section">

          <h3 className="cert-expiry-title">
            Expiry Timeline (Next 90 Days)
          </h3>


          <div className="expiry-row">
            <span className="expiry-label">7 days</span>
            <div className="expiry-bar">
              <div
                className="expiry-fill red"
                style={{ width: `${expiryTimeline["7days"] * 10}px` }}
              />
            </div>
            <span className="expiry-count">{expiryTimeline["7days"]}</span>
          </div>


          <div className="expiry-row">
            <span className="expiry-label">30 days</span>
            <div className="expiry-bar">
              <div
                className="expiry-fill orange"
                style={{ width: `${expiryTimeline["30days"] * 10}px` }}
              />
            </div>
            <span className="expiry-count">{expiryTimeline["30days"]}</span>
          </div>


          <div className="expiry-row">
            <span className="expiry-label">60 days</span>
            <div className="expiry-bar">
              <div
                className="expiry-fill green"
                style={{ width: `${expiryTimeline["60days"] * 10}px` }}
              />
            </div>
            <span className="expiry-count">{expiryTimeline["60days"]}</span>
          </div>


          <div className="expiry-row">
            <span className="expiry-label">90 days</span>
            <div className="expiry-bar">
              <div
                className="expiry-fill blue"
                style={{ width: `${expiryTimeline["90days"] * 10}px` }}
              />
            </div>
            <span className="expiry-count">{expiryTimeline["90days"]}</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Certificates;
import React, { useState, useMemo } from "react";
import clientData from "../API/clinetinfo.json";
import "../styles/clientinfo.css";
import { Search, Download, X } from "lucide-react";

function ClientsInfo() {

  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedClient, setSelectedClient] = useState(null);

  const clients = useMemo(() => clientData.data, []);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {

      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProduct =
        productFilter === "All" ||
        c.product === productFilter;

      const matchesStatus =
        statusFilter === "All" ||
        c.status === statusFilter;

      return matchesSearch && matchesProduct && matchesStatus;

    });
  }, [clients, searchTerm, productFilter, statusFilter]);



  const exportCSV = () => {

    const headers = [
      "Client ID",
      "Client Name",
      "Product",
      "Status",
      "Business Person",
      "Email"
    ];

    const rows = filteredClients.map(c => [
      c.id,
      c.name,
      c.product,
      c.status,
      c.businessPerson.name,
      c.businessPerson.email
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");

    const link = document.createElement("a");

    link.href = encodeURI(csvContent);
    link.download = "clients-info.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  };



  return (

    <div className="clientsinfo-page">

      <div className="clientsinfo-topbar">

        <div className="search-box">

          <Search size={16} />

          <input
            placeholder="Search client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>



        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        >
          <option value="All">Product (All)</option>
          <option value="Kofax">Kofax</option>
        </select>



        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">Status (All)</option>
          <option value="Active">Active</option>
          <option value="Not Active">Not Active</option>
        </select>



        <button
          className="export-btn"
          onClick={exportCSV}
        >
          <Download size={16} />
          Export CSV
        </button>

      </div>



      <div className="clientsinfo-table-container">

        <table className="clientsinfo-table">

          <thead>

            <tr>

              <th>Client ID</th>
              <th>Client Name</th>
              <th>Product</th>
              <th>Status</th>
              <th>Business Person</th>
              <th>Email</th>
              <th>Actions</th>

            </tr>

          </thead>



          <tbody>

            {filteredClients.map(client => (

              <tr key={client.id}>

                <td>{client.id}</td>

                <td>{client.name}</td>

                <td>{client.product}</td>

                <td>

                  <span className={
                    client.status === "Active"
                      ? "status active"
                      : "status inactive"
                  }>
                    {client.status}
                  </span>

                </td>

                <td>{client.businessPerson.name}</td>

                <td>{client.businessPerson.email}</td>

                <td>

                  <button
                    className="view-btn"
                    onClick={() => setSelectedClient(client)}
                  >
                    View Details
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>



      <div className="clientsinfo-footer">

        <span>Rows per page: 10</span>

        <span>
          1-{filteredClients.length} of {clientData.totalCount}
        </span>

      </div>



      {/* Popup Modal */}

      {selectedClient && (

        <div className="modal-overlay">

          <div className="modal-box">

            <div className="modal-header">

              <h3>Client Details</h3>

              <X
                size={18}
                className="close-btn"
                onClick={() => setSelectedClient(null)}
              />

            </div>



            <table className="details-table">

              <tbody>

                <tr>
                  <td>Client ID</td>
                  <td>{selectedClient.id}</td>
                </tr>

                <tr>
                  <td>Client Name</td>
                  <td>{selectedClient.name}</td>
                </tr>

                <tr>
                  <td>Product</td>
                  <td>{selectedClient.product}</td>
                </tr>

                <tr>
                  <td>Status</td>
                  <td>{selectedClient.status}</td>
                </tr>

                <tr>
                  <td>Business Person</td>
                  <td>{selectedClient.businessPerson.name}</td>
                </tr>

                <tr>
                  <td>Email</td>
                  <td>{selectedClient.businessPerson.email}</td>
                </tr>

                <tr>
                  <td>Overview</td>
                  <td>{selectedClient.overview}</td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      )}


    </div>

  );

}

export default ClientsInfo;
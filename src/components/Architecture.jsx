import React, { useState, useEffect } from "react";
import architectureData from "../API/Architecture.json";
import "../styles/architecture.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Architecture() {

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [environment, setEnvironment] = useState("Prod");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  /* Load Clients */

  useEffect(() => {

    if (architectureData.status === "success") {

      setClients(architectureData.data);

      if (architectureData.data.length > 0) {
        setSelectedClientId(
          architectureData.data[0].client.id
        );
      }

    }

  }, []);


  /* Reset Slider */

  useEffect(() => {

    setCurrentImageIndex(0);

  }, [selectedClientId]);


  /* Selected Client */

  const selectedClient =
    clients.find(
      c => c.client.id === selectedClientId
    );


  if (!selectedClient) return null;


  const { client, architecture } = selectedClient;


  /* Images */

  const images =
    architecture.diagramImages
    ||
    (architecture.diagramImageUrl
      ? [architecture.diagramImageUrl]
      : []);


  return (

    <div className="architecture-page">


      {/* TOPBAR */}

      <div className="arch-topbar">

        <div className="arch-left-controls">

          <div className="select-client">

            <label>Select Client</label>

            <select
              value={selectedClientId}
              onChange={(e) =>
                setSelectedClientId(e.target.value)
              }
            >

              {clients.map(c => (

                <option
                  key={c.client.id}
                  value={c.client.id}
                >

                  {c.client.name}

                </option>

              ))}

            </select>

          </div>

        </div>


        {/* Environment */}

        <div className="environment-switch">

          <span>Environment</span>

          {["Prod","UAT","Dev"].map(env => (

            <button
              key={env}
              className={
                environment === env
                ? "env-btn active"
                : "env-btn"
              }
              onClick={() => setEnvironment(env)}
            >

              {env}

            </button>

          ))}

        </div>

      </div>



      {/* MAIN CONTENT */}

      <div className="arch-content">


        {/* DIAGRAM */}

        <div className="diagram-card">

          <div className="diagram-header">

            <h3>
              {client.name} – System Architecture
            </h3>

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
                        setCurrentImageIndex(prev =>
                          prev === 0
                          ? images.length - 1
                          : prev - 1
                        )
                      }
                    >
                      <ChevronLeft size={18}/>
                    </button>


                    <button
                      className="slider-btn right"
                      onClick={() =>
                        setCurrentImageIndex(prev =>
                          prev === images.length - 1
                          ? 0
                          : prev + 1
                        )
                      }
                    >
                      <ChevronRight size={18}/>
                    </button>


                    <div className="slider-indicators">

                      {images.map((_,i)=>(
                        <span
                          key={i}
                          className={
                            i===currentImageIndex
                            ? "indicator active"
                            : "indicator"
                          }
                          onClick={() =>
                            setCurrentImageIndex(i)
                          }
                        />
                      ))}

                    </div>

                  </>

                )}

              </>

            )}

          </div>

        </div>



        {/* DETAILS */}

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

                    {architecture.coreModules.map((m,i)=>(
                      <span
                        key={i}
                        className="badge"
                      >
                        {m}
                      </span>
                    ))}

                  </div>

                </td>

              </tr>


              <tr>
                <td>Integrations</td>
                <td>

                  <div className="badge-group">

                    {architecture.integrations.map((m,i)=>(
                      <span
                        key={i}
                        className="badge"
                      >
                        {m}
                      </span>
                    ))}

                  </div>

                </td>

              </tr>


              <tr>
                <td>Security</td>
                <td>

                  <div className="badge-group">

                    {architecture.security.map((m,i)=>(
                      <span
                        key={i}
                        className="badge"
                      >
                        {m}
                      </span>
                    ))}

                  </div>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>



      {/* DATA FLOW */}

      <div className="data-flow">

        <h3>Data Flow Summary</h3>

        <ol>

          {architecture.dataFlowSummary.map((s,i)=>(
            <li key={i}>{s}</li>
          ))}

        </ol>

      </div>


    </div>

  );

}

export default Architecture;
import React, { useState, useEffect } from "react";
import axios from "axios";

const Leads = ({ form_id }) => {
  const [leadsByStages, setLeadsByStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leads grouped by stages
  const fetchLeadsByStages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/form/leads-by-stages?form_id=${form_id}` // Pass form_id as a query parameter
      );
      console.log("Leads fetched successfully:", response.data);
      setLeadsByStages(response.data);
    } catch (error) {
      console.error("Error fetching leads by stages:", error);
      setError("Failed to fetch leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsByStages();
  }, [form_id]); // Re-fetch when form_id changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Leads by Pipeline Stages</h1>
      {leadsByStages.length === 0 ? (
        <p style={styles.noLeads}>No leads found for this form.</p>
      ) : (
        <div style={styles.stagesContainer}>
          {leadsByStages.map((group) => (
            <div key={group.stage} style={styles.stageCard}>
              <h2 style={styles.stageHeading}>{group.stage}</h2>
              <ul style={styles.leadsList}>
                {group.leads.map((lead) => (
                  <li key={lead._id} style={styles.leadItem}>
                    <div style={styles.leadDetails}>
                      <p>
                        <strong>Form ID:</strong> {lead.form_id}
                      </p>
                      <p>
                        <strong>User Email:</strong> {lead.user_email}
                      </p>
                      <p>
                        <strong>Data:</strong>{" "}
                        <pre style={styles.dataPre}>
                          {JSON.stringify(lead.data, null, 2)}
                        </pre>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leads;

// Styles for the component
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  noLeads: {
    textAlign: "center",
    color: "#666",
  },
  stagesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  stageCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  stageHeading: {
    fontSize: "1.5rem",
    color: "#007bff",
    marginBottom: "10px",
  },
  leadsList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  leadItem: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  leadDetails: {
    fontSize: "0.9rem",
    color: "#555",
  },
  dataPre: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "4px",
    overflowX: "auto",
  },
};
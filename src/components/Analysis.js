import React, { useEffect, useState } from "react";
import axios from "axios";

const Analysis = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/analysis/summary");
        setSummary(response.data.summary);
      } catch (error) {
        console.error("Error fetching summary:", error);
        setError("Failed to load summary.");
      }
    };

    fetchSummary();
  }, []);

  if (error) return <p>{error}</p>;
  if (!summary) return <p>Loading summary...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Excel Summary</h2>
      <p><strong>Total Rows:</strong> {summary.totalRows}</p>

      {summary.columnStats && summary.columnStats.length > 0 ? (
        <>
          <h3>Column-wise Stats:</h3>
          <ul>
            {summary.columnStats.map((col, idx) => (
              <li key={idx}>{col.column}: {col.filled} filled entries</li>
            ))}
          </ul>
        </>
      ) : (
        <p>No column stats available.</p>
      )}
    </div>
  );
};

export default Analysis;

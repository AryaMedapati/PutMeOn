import React, { useState, useContext, UserContext, useEffect } from "react";
import "../styles/PutMeOnStats.css";
import localstorage from "localstorage-slim";

const PStat = () => {
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState({ trackMap: {}, artistMap: {} });
  const [username, setUsername] = useState("");
  const { email } = useContext(UserContext);

  useEffect(() => {
    if (email) {
      setUsername(email);
    } else {
      const storedUsername = localstorage.get("user");
      console.log(storedUsername);
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [email]);

  const isValidDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    return regex.test(date);
  };

  const fetchReport = async () => {
    if (!isValidDate(date)) {
      setErrorMessage("Incorrect format, please enter date in MM/DD/YYYY");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/generateReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username || localstorage.get("user"),
          time: date,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        console.error("Error fetching report:", response.statusText);
        setErrorMessage("Failed to fetch the report. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gv-container">
      <h2>Listening Report</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter date (MM/DD/YYYY)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
        <button onClick={fetchReport} className="generate-button">
          Generate Report
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {isLoading ? (
        <p>Loading report...</p>
      ) : (
        <div className="report-container">
          <h3>Track Report</h3>
          {Object.keys(reportData.trackMap).length > 0 ? (
            Object.entries(reportData.trackMap).map(([trackId, { count }]) => (
              <div key={trackId} className="report-item">
                <p>
                  <strong>Track ID:</strong> {trackId}
                </p>
                <p>
                  <strong>Play Count:</strong> {count}
                </p>
              </div>
            ))
          ) : (
            <p>No track data available.</p>
          )}

          <h3>Artist Report</h3>
          {Object.keys(reportData.artistMap).length > 0 ? (
            Object.entries(reportData.artistMap).map(
              ([artistId, { count }]) => (
                <div key={artistId} className="report-item">
                  <p>
                    <strong>Artist ID:</strong> {artistId}
                  </p>
                  <p>
                    <strong>Play Count:</strong> {count}
                  </p>
                </div>
              )
            )
          ) : (
            <p>No artist data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PStat;

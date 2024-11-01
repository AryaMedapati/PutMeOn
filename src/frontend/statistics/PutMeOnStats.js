import React, { useState, useContext, useEffect } from "react";
import { jsPDF } from "jspdf";
import "../styles/PutMeOnStats.css";
import { UserContext } from "../UserContext";
import localstorage from "localstorage-slim";

const PStat = () => {
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState({
    totalTime: 0,
    trackMap: [],
    artistMap: [],
    artistListenTime: [],
  });
  const [username, setUsername] = useState("");
  const { email } = useContext(UserContext);

  useEffect(() => {
    if (email) {
      setUsername(email);
    } else {
      const storedUsername = localstorage.get("user");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [email]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Listening Report", 20, 20);
    doc.setFontSize(12);

    doc.text(`Total Time Listened: ${reportData.totalTime} minutes`, 20, 30);

    doc.line(20, 35, 190, 35);
    doc.text("Top Songs by Play Count:", 20, 40);

    let y = 50;
    reportData.trackMap.forEach(({ trackId, count, track_name }) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.text(`Track: ${track_name} - Play Count: ${count}`, 20, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 5;
    doc.text("Top Artists by Play Count:", 20, y);
    y += 10;

    reportData.artistMap.forEach(({ artistId, count, name }) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.text(`Artist: ${name} - Play Count: ${count}`, 20, y);
      y += 10;
    });

    doc.line(20, y, 190, y);
    y += 5;
    doc.text("Top Artists by Listening Time:", 20, y);
    y += 10;

    reportData.artistListenTime.forEach(({ artistId, minutes, name }) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.text(`Artist: ${name} - Minutes Listened: ${minutes}`, 20, y);
      y += 10;
    });

    const formattedDate = date.replace(/-/g, "_");
    doc.save(`listening_report_${formattedDate}.pdf`);
  };

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
        console.log(data);
      } else {
        setErrorMessage("Failed to fetch the report. Please try again later.");
      }
    } catch (error) {
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
          <h3>Total Time Listened: {reportData.totalTime} minutes</h3>

          <div className="stat-item">
            <h3>Top Songs by Play Count</h3>
            {Object.keys(reportData.trackMap).length > 0 ? (
              reportData.trackMap.map(({ trackId, track_name, count }) => (
                <div key={trackId} className="report-item">
                  <p>
                    <strong>{track_name}</strong>
                  </p>
                  <p>Play Count: {count}</p>
                </div>
              ))
            ) : (
              <p>No track data available.</p>
            )}
          </div>

          <div className="stat-item">
            <h3>Top Artists by Play Count</h3>
            {Object.keys(reportData.artistMap).length > 0 ? (
              reportData.artistMap.map(({ artistId, name, count }) => (
                <div key={artistId} className="report-item">
                  <p>
                    <strong>{name}</strong>
                  </p>
                  <p>Play Count: {count}</p>
                </div>
              ))
            ) : (
              <p>No artist data available.</p>
            )}
          </div>

          <div className="stat-item">
            <h3>Top Artists by Listening Time</h3>
            {Object.keys(reportData.artistListenTime).length > 0 ? (
              reportData.artistListenTime.map(({ artistId, name, minutes }) => (
                <div key={artistId} className="report-item">
                  <p>
                    <strong>{name}</strong>
                  </p>
                  <p>Minutes Listened: {minutes}</p>
                </div>
              ))
            ) : (
              <p>No artist listening time data available.</p>
            )}
          </div>
          <button onClick={generatePDF} className="download-button">
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PStat;

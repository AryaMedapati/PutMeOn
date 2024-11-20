import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TH = () => {
  const [tracks, setTracks] = useState([]);
  const [trackTimeline, setTrackTimeline] = useState("Last 4 Weeks");

  const fetchTopTracks = async (timeline) => {
    const url = "http://localhost:3001";
    const response = await fetch(`${url}/topTracks?timeline=${timeline}`);
    const data = await response.json();
    setTracks(data.data);
  };

  useEffect(() => {
    const timeline = "short_term";
    fetchTopTracks(timeline);
  }, []);

  const handleButtonClick = (action) => {
    const mapper = {
      short_term: "Last 4 Weeks",
      medium_term: "Last 6 Months",
      long_term: "Last 12 Months",
    };
    setTrackTimeline(mapper[action]);
    fetchTopTracks(action);
  };

  const groupTracksByPopularity = (tracks) => {
    const ranges = {
      "0-10": [],
      "11-20": [],
      "21-30": [],
      "31-40": [],
      "41-50": [],
      "51-60": [],
      "61-70": [],
      "71-80": [],
      "81-90": [],
      "91-100": [],
    };

    tracks.forEach((track) => {
      const popularity = track.popularity;
      if (popularity <= 10) ranges["0-10"].push(track);
      else if (popularity <= 20) ranges["11-20"].push(track);
      else if (popularity <= 30) ranges["21-30"].push(track);
      else if (popularity <= 40) ranges["31-40"].push(track);
      else if (popularity <= 50) ranges["41-50"].push(track);
      else if (popularity <= 60) ranges["51-60"].push(track);
      else if (popularity <= 70) ranges["61-70"].push(track);
      else if (popularity <= 80) ranges["71-80"].push(track);
      else if (popularity <= 90) ranges["81-90"].push(track);
      else ranges["91-100"].push(track);
    });

    return ranges;
  };

  const groupedTracks = groupTracksByPopularity(tracks);
  const labels = Object.keys(groupedTracks);
  const dataCounts = labels.map((range) => groupedTracks[range].length);

  const tooltipCallbacks = {
    label: (context) => {
      const range = context.label;
      const tracksInRange = groupedTracks[range];
      const trackNames = tracksInRange.map((track) => track.name).join(", "); 
      return `${range}: ${trackNames}`; 
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Number of Tracks",
        data: dataCounts,
        backgroundColor: "#1DB954", 
        borderColor: "#1DB954",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: tooltipCallbacks,
        custom: (tooltip) => {
          if (!tooltip.opacity) {
            return;
          }

          // Custom styling for tooltip
          const tooltipEl = tooltip.el;
          if (!tooltipEl) return;

          tooltipEl.style.opacity = 1;
          tooltipEl.style.pointerEvents = "auto";
          tooltipEl.style.maxWidth = "300px"; 
          tooltipEl.style.maxHeight = "200px"; 
          tooltipEl.style.overflowY = "auto"; 
          tooltipEl.style.wordWrap = "break-word";  
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Popularity Range",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Tracks",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Track Popularity Histogram</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleButtonClick("short_term")}
          style={{
            padding: "10px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Last 4 Weeks
        </button>
        <button
          onClick={() => handleButtonClick("medium_term")}
          style={{
            padding: "10px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Last 6 Months
        </button>
        <button
          onClick={() => handleButtonClick("long_term")}
          style={{
            padding: "10px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Last 12 Months
        </button>
      </div>

      {tracks.length > 0 ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p>Loading histogram...</p>
      )}
    </div>
  );
};

export default TH;

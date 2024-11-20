import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary components of Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const GV = () => {
  const [genres, setGenres] = useState([]);
  const [genreTimeline, setGenreTimeline] = useState("Last 4 Weeks");

  // Fetch genre data and process it
  const fetchTopArtists = async (timeline) => {
    const url = "http://localhost:3001"; 
    const response = await fetch(`${url}/topArtists?timeline=${timeline}`);
    const data = await response.json();
    const genreCounts = getGenreCounts(data.data);
    const rankedGenres = rankGenres(genreCounts);
    setGenres(rankedGenres);
  };

  const getGenreCounts = (data) => {
    let genreCounts = {};
    data.forEach((entry) => {
      entry.genres.forEach((genre) => {
        if (genreCounts[genre]) {
          genreCounts[genre]++;
        } else {
          genreCounts[genre] = 1;
        }
      });
    });
    return genreCounts;
  };

  const rankGenres = (genreCounts) => {
    let genreArray = Object.entries(genreCounts);
    genreArray.sort((a, b) => b[1] - a[1]);
    let rankedGenres = [];
    let rank = 1;

    genreArray.forEach((item, index) => {
      if (index === 0) {
        rankedGenres.push({ genre: item[0], count: item[1], rank });
      } else {
        if (item[1] === genreArray[index - 1][1]) {
          rankedGenres.push({ genre: item[0], count: item[1], rank });
        } else {
          rank = index + 1;
          rankedGenres.push({ genre: item[0], count: item[1], rank });
        }
      }
    });

    return rankedGenres;
  };

  useEffect(() => {
    const timeline = "short_term"; // default timeline
    fetchTopArtists(timeline);
  }, []);

  const handleButtonClick = (action) => {
    const mapper = {
      short_term: "Last 4 Weeks",
      medium_term: "Last 6 Months",
      long_term: "Last 12 Months",
    };
    setGenreTimeline(mapper[action]);
    fetchTopArtists(action);
  };

  // Prepare data for Pie Chart
  const pieChartData = {
    labels: genres.map((item) => item.genre), // genre names as labels
    datasets: [
      {
        data: genres.map((item) => item.count), // genre counts as data points
        backgroundColor: [
          "#FF6F61", // Example colors for the segments
          "#FFB74D",
          "#81C784",
          "#64B5F6",
          "#9575CD",
          "#FFEB3B",
          "#4CAF50",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Genre Pie Chart</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleButtonClick("short_term")}
          style={{ padding: "10px", backgroundColor: "#1DB954", color: "white", border: "none", borderRadius: "5px" }}
        >
          Last 4 Weeks
        </button>
        <button
          onClick={() => handleButtonClick("medium_term")}
          style={{ padding: "10px", backgroundColor: "#1DB954", color: "white", border: "none", borderRadius: "5px" }}
        >
          Last 6 Months
        </button>
        <button
          onClick={() => handleButtonClick("long_term")}
          style={{ padding: "10px", backgroundColor: "#1DB954", color: "white", border: "none", borderRadius: "5px" }}
        >
          Last 12 Months
        </button>
      </div>

      {genres.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default GV;

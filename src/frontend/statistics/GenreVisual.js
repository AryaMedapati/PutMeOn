import React, { useState, useEffect } from "react";
import { Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const GV = () => {
  const [genres, setGenres] = useState([]);
  const [genreTimeline, setGenreTimeline] = useState("Last 4 Weeks");

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
    const timeline = "short_term";
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

  const pieChartData = {
    labels: genres.map((item) => item.genre),
    datasets: [
      {
        data: genres.map((item) => item.count),
        backgroundColor: [
          "#FF6F61",
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

  const radarData = {
    labels: genres.map((item) => item.genre),
    datasets: [
      {
        label: `Top Genres (${genreTimeline})`,
        data: genres.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };
  console.log(radarData);

  const radarOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return `${context.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: Math.max(...genres.map((item) => item[1])) + 1,
        ticks: {
          stepSize: 1,
          showLabelBackdrop: false,
          backdropPadding: 2,
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

      <div style={{ marginTop: "30px" }}>
        <h3>{genreTimeline}</h3>
        {genres.length > 0 ? (
          <>
            <div style={{ marginBottom: "50px" }}>
              <h2>Top Genres Pie Chart</h2>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
            <div>
              <h2>Top Genres Radar Chart</h2>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default GV;

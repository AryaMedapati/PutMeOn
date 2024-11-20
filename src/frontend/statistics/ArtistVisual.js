import React, { useState, useEffect } from "react";
import { Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip,
  Legend
);

const TH = () => {
  const [artists, setArtists] = useState([]);
  const [artistTimeline, setArtistTimeline] = useState("Last 4 Weeks");

  const fetchTopArtists = async (timeline) => {
    const url = "http://localhost:3001";
    const response = await fetch(`${url}/topArtists?timeline=${timeline}`);
    const data = await response.json();
    setArtists(data.data);
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
    setArtistTimeline(mapper[action]);
    fetchTopArtists(action);
  };

  const groupArtistsByPopularity = (artists) => {
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

    artists.forEach((artist) => {
      const popularity = artist.popularity;
      if (popularity <= 10) ranges["0-10"].push(artist);
      else if (popularity <= 20) ranges["11-20"].push(artist);
      else if (popularity <= 30) ranges["21-30"].push(artist);
      else if (popularity <= 40) ranges["31-40"].push(artist);
      else if (popularity <= 50) ranges["41-50"].push(artist);
      else if (popularity <= 60) ranges["51-60"].push(artist);
      else if (popularity <= 70) ranges["61-70"].push(artist);
      else if (popularity <= 80) ranges["71-80"].push(artist);
      else if (popularity <= 90) ranges["81-90"].push(artist);
      else ranges["91-100"].push(artist);
    });

    return ranges;
  };

  const groupedArtists = groupArtistsByPopularity(artists);
  const labels = Object.keys(groupedArtists);
  const dataCounts = labels.map((range) => groupedArtists[range].length);

  const tooltipCallbacks = {
    label: (context) => {
      const range = context.label;
      const artistsInRange = groupedArtists[range];
      const artistNames = artistsInRange
        .map((artist) => artist.name)
        .join(", ");
      return `${range}: ${artistNames}`;
    },
  };

  const tooltipCallbackScatter = {
    label: (context) => {
      const { x, y, name } = context.raw;
      return `${name}: Popularity ${x}, Followers ${y}`;
    },
  };

  const histogramData = {
    labels: labels,
    datasets: [
      {
        label: "Number of Artists",
        data: dataCounts,
        backgroundColor: "#1DB954",
        borderColor: "#1DB954",
        borderWidth: 1,
      },
    ],
  };
  console.log(histogramData);

  const histogramOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: tooltipCallbacks,
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
          text: "Number of Artists",
        },
        beginAtZero: true,
      },
    },
  };

  const scatterData = {
    datasets: [
      {
        label: "Artists",
        data: artists.map((artist) => ({
          x: artist.popularity,
          y: artist.followers.total,
          name: artist.name,
        })),
        backgroundColor: "#1DB954",
        pointBorderColor: "#1DB954",
        pointBorderWidth: 1,
      },
    ],
  };
  console.log(scatterData);

  const scatterOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: tooltipCallbackScatter,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Popularity",
        },
        ticks: {
          stepSize: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "Followers",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Artist Insights</h2>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          onClick={() => handleButtonClick("short_term")}
          style={{
            padding: "10px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "5px",
            margin: "5px",
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
            margin: "5px",
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
            margin: "5px",
          }}
        >
          Last 12 Months
        </button>
      </div>
      <div style={{ marginTop: "30px" }}>
        <h3>{artistTimeline}</h3>
        {artists.length > 0 ? (
          <>
            <div style={{ marginBottom: "50px" }}>
              <h2>Artist Popularity Histogram</h2>
              <Bar data={histogramData} options={histogramOptions} />
            </div>
            <div>
              <h2>Artist Popularity vs. Followers</h2>
              <Scatter data={scatterData} options={scatterOptions} />
            </div>
          </>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default TH;

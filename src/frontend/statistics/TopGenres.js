import React, { useEffect, useState } from "react";
import { AiFillSpotify } from "react-icons/ai";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [genreTimeline, setGenreTimeline] = useState("Last 4 Weeks");

  const fetchTopArtists = async (timeline) => {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(`${url}/topArtists?timeline=${timeline}`);
    const data = await response.json();
    // setArtists(data.data);
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

  const buttonStyle = {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#1DB954",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#1aa34a",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <h1 style={{ padding: "20px", textAlign: "center" }}>
        Your Top Genres from the {genreTimeline}
      </h1>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <button
          onClick={() => handleButtonClick("short_term")}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Last 4 Weeks
        </button>
        <button
          onClick={() => handleButtonClick("medium_term")}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Last 6 Months
        </button>
        <button
          onClick={() => handleButtonClick("long_term")}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Last 12 Months
        </button>
      </div>
      {genres.length > 0 ? (
        <div style={{ padding: "0 20px" }}>
          <ul
            style={{ listStyleType: "none", padding: 0, paddingBottom: "60px" }}
          >
            {genres.map((item, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: "#f7f7f7",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  padding: "20px",
                  marginBottom: "15px",
                  transition: "transform 0.2s ease",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1.1rem",
                  color: "#333",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div style={{ fontWeight: "bold", color: "#ff6f61" }}>
                  Rank {item.rank}
                </div>
                <div style={{ fontWeight: "bold" }}>{item.genre}</div>
                <div style={{ color: "#888" }}>Count: {item.count}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#888" }}>
          No top genres available.
        </p>
      )}
    </div>
  );
};

export default Genres;

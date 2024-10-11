import React, { useState, useEffect } from "react";

const GV = () => {
  const [chartUrl, setChartUrl] = useState("");

  const fetchVisual = async (timeline) => {
    const url = "http://localhost:3001"; 
    const response = await fetch(`${url}/genrePie?timeline=${timeline}`);

    if (response.ok) {
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setChartUrl(imageUrl);
      console.log(chartUrl)
    } else {
      console.error("Error fetching pie chart:", response.statusText);
    }
  };

  useEffect(() => {
    const timeline = "medium_term"; 
    fetchVisual(timeline);
  }, []);

  return (
    <div>
      <h2>Genre Pie Chart</h2>
      {chartUrl ? (
        <img src={chartUrl} alt="Genre Pie Chart" />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default GV;

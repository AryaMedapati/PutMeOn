import React, { useState, useEffect } from "react";

const AH = () => {
    const [chartUrl, setChartUrl] = useState("");

    const fetchHistogram = async (timeline) => {
        const url = "http://localhost:3001"; 
        const response = await fetch(`${url}/artistChart?timeline=${timeline}`);

        if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setChartUrl(imageUrl);
        } else {
            console.error("Error fetching histogram:", response.statusText);
        }
    };

    useEffect(() => {
        const timeline = "medium_term";
        fetchHistogram(timeline);
    }, []);

    return (
        <div>
            <h2>Artist Popularity Histogram</h2>
            {chartUrl ? (
                <img src={chartUrl} alt="Artist Popularity Histogram" />
            ) : (
                <p>Loading histogram...</p>
            )}
        </div>
    );
};

export default AH;
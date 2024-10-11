import React, { useState, useEffect } from "react";

const TH = () => {
    const [chartUrl, setChartUrl] = useState("");

    const fetchHistogram = async (timeline) => {
        const url = "http://localhost:3000"; // Adjust to your backend URL
        const response = await fetch(`${url}/trackChart?timeline=${timeline}`);

        if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setChartUrl(imageUrl);
        } else {
            console.error("Error fetching histogram:", response.statusText);
        }
    };

    useEffect(() => {
        const timeline = "medium_term"; // Set your default timeline
        fetchHistogram(timeline);
    }, []);

    return (
        <div>
            <h2>Track Popularity Histogram</h2>
            {chartUrl ? (
                <img src={chartUrl} alt="Track Popularity Histogram" />
            ) : (
                <p>Loading histogram...</p>
            )}
        </div>
    );
};

export default TH;
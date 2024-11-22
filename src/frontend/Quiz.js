import React, { useEffect, useState } from "react";
const Quiz = () => {
  const [items, setItems] = useState("");
  const [trivia, setTrivia] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:3001/fetchTopSongs");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const songs = await response.json();
        const randomSongIndex = Math.floor(Math.random() * songs.length);
        const randomSong = songs[randomSongIndex];
        const formattedSong = `${randomSong["Track Name"]} - by ${randomSong["Artist Name(s)"]}`;

        setItems([formattedSong]);
        const artistName = formattedSong.split(" - by ")[1];
        console.log("Artist Name:", artistName);
        console.log(items);
        const artistResponse = await fetch(
          "http://localhost:3001/fetchArtistID",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ artistName }),
          }
        );
        const data = await artistResponse.json();
        console.log(data);
        const id = await data.message;

        const pollInformation = await fetch("http://localhost:3001/getArtist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            songID: id,
          }),
        });

        const triviaQuestions = await pollInformation.json();
        setTrivia(triviaQuestions.trivia);

        if (!artistResponse.ok) {
          throw new Error("Failed to fetch artist ID");
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    if (trivia.length > 0) {
      const [question, correctAnswer, ...incorrectAnswers] =
        trivia[currentQuestionIndex];
      const options = [correctAnswer, ...incorrectAnswers];
      const shuffled = options.sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    }
  }, [currentQuestionIndex, trivia]);

  // Handle user answer
  const handleAnswer = (selectedOption) => {
    const correctAnswer = trivia[currentQuestionIndex][1];
    if (selectedOption === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < trivia.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      alert(`Quiz complete! Your score is ${score + 1}/${trivia.length}`);
    }
  };

  if (trivia.length === 0) {
    return <div>Loading trivia...</div>;
  }

  const [question] = trivia[currentQuestionIndex];

  return (
    <div>
      <h1>Music Trivia</h1>
      <p>{question}</p>
      {shuffledOptions.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option)}>
          {option}
        </button>
      ))}
      <p>Score: {score}</p>
    </div>
  );
};

export default Quiz;

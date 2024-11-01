import React, { useState, useEffect } from "react";
import { Button, Card } from "@blueprintjs/core";

function FriendProfile({ friend, onBack }) {
  const [pfp, setPfp] = useState("https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon");
  const [bio, setBio] = useState("this is a test bio !");
  const [genres, setSelectedGenres] = useState(["genre1", "genre2", "genre3"]);
  const [songs, setSelectedSongs] = useState(["song1", "song2", "song3"]);
  const [artists, setSelectedArtists] = useState(["artist1", "artist2", "artist3"]);
  const [privacySettings, setPrivacySettings] = useState({topGenres:true, topSongs:true, topAlbums:true});
  const [isPrivate, setIsPrivate] = useState(false);

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       if (friend) {
//         const response = await fetch("http://localhost:3001/fetchUserInfo", {
//           method: "GET",
//           headers: {
//             'Content-Type': 'application/json',
//             username: friend,
//           },
//         });
//         const data = await response.json();
//         setPfp(data.pfp);
//         setBio(data.bio);
//         setSelectedGenres(data.topGenres);
//         setSelectedSongs(data.topSongs);
//         setSelectedArtists(data.topArtists);
//         setPrivacySettings(data.privacySettings);
//         setIsPrivate(data.isPrivate);
//       }
//     };
//     fetchProfileData();
//   }, [friend]);

  return (
    <Card style={{ padding: "20px" }}>
      <Button icon="arrow-left" onClick={onBack}>
        Back to Friends List
      </Button>
      <h2>{friend}</h2>
      {isPrivate ? (
        <p>This profile is private. Some information may be restricted.</p>
      ) : (
        <>
          <img src={pfp} alt={`${friend}'s profile`} style={{ width: "100px", borderRadius: "50%" }} />
          <p>{bio}</p>
          {privacySettings.topGenres && (
            <div>
              <h3>Top Genres</h3>
              <ul>
                {genres.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
            </div>
          )}
          {privacySettings.topSongs && (
            <div>
              <h3>Top Songs</h3>
              <ul>
                {songs.map((song, index) => (
                  <li key={index}>{song}</li>
                ))}
              </ul>
            </div>
          )}
          {privacySettings.topAlbums && (
            <div>
              <h3>Top Albums</h3>
              <ul>
                {artists.map((artist, index) => (
                  <li key={index}>{artist}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default FriendProfile;
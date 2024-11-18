import React, { useEffect } from "react";

function TransferToken() {
  useEffect(() => {
    // Get the access token from URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    // If token is present, update iframe in the main window
    if (token && window.opener) {
      // Redirect the main window's iframe to capture the token
      window.opener.document.querySelector("iframe").src = `${window.location.origin}/transferToken?access_token=${token}`;
      // Close the popup window
      window.close();
    }
  }, []);

  return <div>Processing Spotify Authentication...</div>;
}

export default TransferToken;

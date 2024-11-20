import React, { createContext, useState, useEffect } from "react";
import ls from "localstorage-slim";

export const UserContext = createContext({
  username: null,
  email: null,
  setUsername: () => {},
  setEmail: () => {},
});

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(() => ls.get("user") || null);

  return (
    <UserContext.Provider value={{ username, setUsername, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

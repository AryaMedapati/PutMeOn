import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);

  return (
    <UserContext.Provider value={{ username, setUsername, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};
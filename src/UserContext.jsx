import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  const updateUserName = (name) => {
    setUserName(name);
    localStorage.setItem("userName", name);
  };

  return (
    <UserContext.Provider value={{ userName, updateUserName }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

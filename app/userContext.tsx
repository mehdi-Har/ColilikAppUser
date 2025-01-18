import React, { createContext, useState, useContext, ReactNode } from "react";

interface UserContextProps {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ imageUri, setImageUri }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

import axiosInstance from "@/lib/axios-instance";
import { createContext, useContext, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
}

interface UserContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = ({ firstName, lastName }: User) => {
    setUser({ firstName, lastName });
  };

  const logout = () => {
    axiosInstance
      .post("/auth/basic/signout", "", { withCredentials: true })
      .then((response) => {
        if (response.status === 204) {
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

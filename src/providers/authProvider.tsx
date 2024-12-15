import axiosInstance from "@/lib/axios-instance";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "./userProvider";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authReady, setAuthReady] = useState(false);
  const { login, logout } = useUser();
  const refreshToken = () => {
    return axios
      .post(import.meta.env.VITE_API_BASE_URL + "/auth/refresh", null, {
        withCredentials: true,
      })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data.accessToken;
      })
      .catch(() => {
        console.log("Invalid refresh token");
        return null;
      });
  };

  useEffect(() => {
    const authenticateOnMount = async () => {
      const accessToken = await refreshToken();

      if (accessToken) {
        axiosInstance
          .get("/auth/user")
          .then((response) => {
            login({
              firstName: response.data.firstName,
              lastName: response.data.lastName,
            });
          })
          .catch(() => {
            logout();
          });
      }

      setAuthReady(true);
    };

    authenticateOnMount();
  }, []);

  if (!authReady) return null;
  return children;
};

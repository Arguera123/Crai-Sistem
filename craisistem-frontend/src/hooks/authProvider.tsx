import { createContext, useContext } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useWhoAmI } from "../hooks/useWhoAmI";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, isError } = useWhoAmI();
  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.clear();

    navigate("/login");
  };

  if (token && isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user: isError || !token ? null : user, logout: logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

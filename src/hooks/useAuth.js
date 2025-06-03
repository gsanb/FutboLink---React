// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    isLoading: true,
    token: null
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          throw new Error("Token expirado");
        }

        const roles = decoded.authorities || [];
        const role = roles[0]?.replace("ROLE_", "");

        setAuthState({
          isAuthenticated: true,
          role,
          isLoading: false,
          token
        });
      } catch (error) {
        console.error("Error decodificando token:", error);
        localStorage.removeItem("token");
        setAuthState({
          isAuthenticated: false,
          role: null,
          isLoading: false,
          token: null
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        role: null,
        isLoading: false,
        token: null
      });
    }
  }, []);

  return authState;
}

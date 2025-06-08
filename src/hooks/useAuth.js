import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    isLoading: true,
    token: null,
    userId: null, // <- nuevo
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Token decodificado:", decoded); // <--- 🔍 MIRA AQUÍ
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          throw new Error("Token expirado");
        }

        const roles = decoded.authorities || [];
        const role = roles[0]?.replace("ROLE_", "");
        const userId = decoded.id || decoded.user_id || decoded.sub; // depende cómo se haya generado el token

        setAuthState({
          isAuthenticated: true,
          role,
          isLoading: false,
          token,
          userId
        });
      } catch (error) {
        console.error("Error decodificando token:", error);
        localStorage.removeItem("token");
        setAuthState({
          isAuthenticated: false,
          role: null,
          isLoading: false,
          token: null,
          userId: null
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        role: null,
        isLoading: false,
        token: null,
        userId: null
      });
    }
  }, []);

  return authState;
}

import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth"; // Hook personalizado de autenticación

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const { token } = useAuth();

  const fetchNotifications = async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      if (error.response?.status === 401) {
        setNotifications([]);
      }
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:8080/api/notifications/mark-as-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications([]); // Limpiar después de marcar como leídas
    } catch (error) {
      console.error("Error al marcar notificaciones como leídas:", error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // primera carga

    const interval = setInterval(fetchNotifications, 30000); // cada 30 segundos se consulta para ver si existe una notificacion

    return () => clearInterval(interval);
  }, [token]);

  return {
    notifications,
    refreshNotifications: fetchNotifications,
    markAllAsRead,
  };
}

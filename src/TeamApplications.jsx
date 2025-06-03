import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./hooks/useAuth";  // asegúrate de tener el hook ajustado

export default function TeamApplications() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Asume que `user.role` está presente

  useEffect(() => {
   

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/applications/team", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(res.data);
      } catch (error) {
        console.error("Error al obtener las aplicaciones:", error);
      }
    };

    fetchApplications();
  }, [isAuthenticated, user, navigate]);

  const updateStatus = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/api/applications/${id}/${action}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: action.toUpperCase() } : app
        )
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitudes Recibidas</h1>

      {applications.length === 0 ? (
        <p>No tienes postulaciones por ahora.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="card bg-base-200 shadow-md p-4">
              <h2 className="text-xl font-semibold">
                Jugador: {app.player?.user?.username}
              </h2>
              <p className="mb-2">Mensaje: {app.message}</p>
              <p className="mb-2">Estado: {app.status}</p>

              {app.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => updateStatus(app.id, "accept")}
                  >
                    Aceptar
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => updateStatus(app.id, "reject")}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./hooks/useAuth";
import Layout from "./components/Layout";

export default function TeamApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Verificar autenticación y rol
    if (!authLoading && (!isAuthenticated || role !== "TEAM")) {
      navigate("/unauthorized");
      return;
    }

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
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && role === "TEAM") {
      fetchApplications();
    }
  }, [isAuthenticated, role, authLoading, navigate]);

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

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Solicitudes Recibidas</h1>

        {applications.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No tienes postulaciones por ahora.</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="card bg-base-200 shadow-md p-4 cursor-pointer hover:bg-base-300 transition"
                onClick={() => navigate(`/playerProfile/${app.id}`)}
              >
                <h2 className="text-xl font-semibold">
                  Jugador: {app.player?.user?.username || "Nombre no disponible"}
                </h2>
                <p className="mb-2">Mensaje: {app.message || "Sin mensaje"}</p>
                <p className="mb-2">
                  Estado: <span className={`badge ${
                    app.status === "ACCEPTED" ? "badge-success" :
                    app.status === "REJECTED" ? "badge-error" : "badge-warning"
                  }`}>
                    {app.status}
                  </span>
                </p>

                {app.status === "PENDING" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(app.id, "accept");
                      }}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(app.id, "reject");
                      }}
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
    </Layout>
  );
}
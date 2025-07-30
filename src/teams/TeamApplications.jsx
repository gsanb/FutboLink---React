import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import { Mail, User, Check, X, MessageSquare, Clock, AlertCircle } from "lucide-react";
import { API_URL } from '../config';


export default function TeamApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || role !== "TEAM")) {
      navigate("/unauthorized");
      return;
    }

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("${API_URL}/api/applications/team", {
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
      await axios.put(`${API_URL}/api/applications/${id}/${action}`, null, {
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
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Solicitudes Recibidas
            </h1>
          </div>

          {applications.length === 0 ? (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-medium mb-2">No hay solicitudes pendientes</h2>
                <p className="text-gray-500 mb-4">Los jugadores que soliciten unirse a tu equipo aparecerán aquí</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/playerProfile/${app.playerId}`)}
                >
                  <div className="card-body p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="card-title text-lg flex items-center gap-2">
                          <User className="w-5 h-5" />
                          {app.playerUsername || "Jugador"}
                        </h2>
                        <div className="mt-2">
                          <p className="text-gray-600 flex items-start gap-2">
                            <span className="mt-0.5">
                              <MessageSquare className="w-4 h-4" />
                            </span>
                            {app.message || "Sin mensaje personalizado"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="badge badge-lg gap-1.5 px-3 py-2.5">
                        {app.status === "PENDING" && <Clock className="w-4 h-4" />}
                        {app.status === "ACCEPTED" && <Check className="w-4 h-4" />}
                        {app.status === "REJECTED" && <X className="w-4 h-4" />}
                        {app.status}
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      {app.status === "PENDING" && (
                        <>
                          <button
                            className="btn btn-success btn-sm gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(app.id, "accept");
                            }}
                          >
                            <Check className="w-4 h-4" />
                            Aceptar
                          </button>
                          <button
                            className="btn btn-error btn-sm gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(app.id, "reject");
                            }}
                          >
                            <X className="w-4 h-4" />
                            Rechazar
                          </button>
                        </>
                      )}
                      {app.status === "ACCEPTED" && (
                        <button
                          className="btn btn-primary btn-sm gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/chat/${app.id}`);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Abrir chat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
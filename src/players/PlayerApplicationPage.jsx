import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import { Mail, User, Check, X, Clock, AlertCircle, MessageSquare } from "lucide-react";
import { API_URL } from '../config';


export default function PlayerApplicationsPage() {
  const authState = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //Si el usuario no está autenticado o no es un jugador, redirigimos a la página de "Unauthorized"
  useEffect(() => {
    if (!authState.isLoading && (!authState.isAuthenticated || authState.role !== "PLAYER")) {
      navigate("/unauthorized");
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/applications/player`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error cargando postulaciones:", err);
        setError("Error al cargar postulaciones");
      }
    };
    // Solo hacemos la petición si el usuario está autenticado y es un jugador
    if (authState.isAuthenticated && authState.role === "PLAYER") {
      fetchApplications();
    }
  }, [authState, navigate]);

  if (authState.isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Layout>
    );
  }
// Si el usuario no está autenticado o no es un jugador, mostramos un mensaje de advertencia
  if (!authState.isAuthenticated || authState.role !== "PLAYER") {
    return (
      <Layout>
        <div className="alert alert-warning max-w-xl mx-auto mt-8">
          <span>Solo los jugadores pueden ver sus postulaciones.</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-error max-w-xl mx-auto mt-8">
          <X className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </div>
      </Layout>
    );
  }
  // Función para renderizar el badge de estado
  const statusBadge = (status) => {
    const baseStyles = "badge badge-lg gap-1.5 px-3 py-2.5";
    switch (status) {
      case "PENDING":
        return <div className={`${baseStyles} badge-warning`}><Clock className="w-4 h-4" />Pendiente</div>;
      case "ACCEPTED":
        return <div className={`${baseStyles} badge-success`}><Check className="w-4 h-4" />Aceptada</div>;
      case "REJECTED":
        return <div className={`${baseStyles} badge-error`}><X className="w-4 h-4" />Rechazada</div>;
      default:
        return <div className={`${baseStyles} badge-ghost`}>Desconocido</div>;
    }
  };
  // Si no hay postulaciones, mostramos un mensaje. Si hay, las listamos
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mis Postulaciones
            </h1>
          </div>

          {applications.length === 0 ? (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-medium mb-2">No tienes postulaciones activas</h2>
                <p className="text-gray-500 mb-4">Tus solicitudes a equipos aparecerán aquí</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="card-body p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="card-title text-lg flex items-center gap-2">
                          <User className="w-5 h-5" />
                          {app.teamName || "Equipo"}
                        </h2>
                        <div className="mt-2">
                          <p className="text-gray-600 flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 mt-0.5" />
                            {app.message || "Sin mensaje personalizado"}
                          </p>
                        </div>
                      </div>
                      {statusBadge(app.status)}
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

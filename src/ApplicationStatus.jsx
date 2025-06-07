import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./hooks/useAuth";
import Layout from "./components/Layout";

export default function ApplicationStatusPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading: authLoading, token } = useAuth();
  
  const [team, setTeam] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del equipo (público)
        const teamRes = await axios.get(`http://localhost:8080/api/teams/${teamId}`);
        setTeam(teamRes.data);

        // Solo intentar obtener el estado si está autenticado como jugador
        if (isAuthenticated && role === "PLAYER" && token) {
          try {
            const statusRes = await axios.get(
              `http://localhost:8080/api/applications/status/${teamId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );
            setStatus(statusRes.data);
          } catch (err) {
            if (err.response?.status === 403) {
              setStatus("NO_PERMISSION");
            } else {
              setStatus("NO_APPLICATION");
            }
          }
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar la información");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [teamId, isAuthenticated, role, token, authLoading]);

  const applyToTeam = async (teamId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/applications/apply/${teamId}`,
        "Me gustaría unirme a su equipo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain"
          }
        }
      );
      setStatus("PENDING");
    } catch (err) {
      console.error("Error aplicando al equipo:", err);
      setError("Error al enviar la aplicación");
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

  if (error) {
    return (
      <Layout>
        <div className="alert alert-error max-w-xl mx-auto mt-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-8 bg-base-200">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Estado de tu solicitud</h1>
          
          {team && (
            <div className="card bg-base-100 shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-2">{team.name}</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">Ubicación:</p>
                  <p>{team.location}</p>
                </div>
                <div>
                  <p className="font-semibold">Categoría:</p>
                  <p>{team.category}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Descripción:</p>
                <p>{team.description || "No hay descripción disponible"}</p>
              </div>
            </div>
          )}

          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Estado de tu postulación</h2>
            
            {status === "PENDING" && (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Tu solicitud está pendiente de revisión</span>
              </div>
            )}
            
            {status === "ACCEPTED" && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>¡Felicidades! Tu solicitud ha sido aceptada</span>
              </div>
            )}
            
            {status === "REJECTED" && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tu solicitud ha sido rechazada</span>
              </div>
            )}
            
            {status === "NO_APPLICATION" && role === "PLAYER" && (
              <div>
                <p className="mb-4">No has aplicado a este equipo aún</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => applyToTeam(teamId)}
                >
                  Aplicar ahora
                </button>
              </div>
            )}
            
            {status === "NO_PERMISSION" && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>No tienes permiso para ver esta información</span>
              </div>
            )}
            
            {!isAuthenticated && (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Inicia sesión como jugador para ver el estado de tus aplicaciones</span>
                <button 
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => navigate('/login', { state: { from: `/team/${teamId}/status` } })}
                >
                  Iniciar sesión
                </button>
              </div>
            )}
            
            {isAuthenticated && role !== "PLAYER" && (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Solo los jugadores pueden ver el estado de sus aplicaciones</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
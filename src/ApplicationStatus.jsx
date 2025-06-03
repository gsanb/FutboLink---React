import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ApplicationStatusPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    isLoading: true,
    token: null
  });

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        
        if (decoded.exp < now) {
          localStorage.removeItem("token");
          throw new Error("Token expirado");
        }

        const roles = decoded.authorities || [];
        const role = roles[0]?.replace("ROLE_", "");
        
        setAuthState({
          isAuthenticated: true,
          role: role,
          isLoading: false,
          token: token
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del equipo (público)
        const teamRes = await axios.get(`http://localhost:8080/api/teams/${teamId}`);
        setTeam(teamRes.data);

        // Solo intentar obtener el estado si está autenticado como jugador
        if (authState.isAuthenticated && authState.role === "PLAYER" && authState.token) {
          try {
            const statusRes = await axios.get(
              `http://localhost:8080/api/applications/status/${teamId}`,
              {
                headers: {
                  Authorization: `Bearer ${authState.token}`,
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

    if (!authState.isLoading) {
      fetchData();
    }
  }, [teamId, authState]);

  if (loading || authState.isLoading) {
    return <div className="p-8">Cargando...</div>;
  }

  if (error) {
    return <div className="p-8 text-error">{error}</div>;
  }

  return (
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
              <span>Tu solicitud está pendiente de revisión</span>
            </div>
          )}
          
          {status === "ACCEPTED" && (
            <div className="alert alert-success">
              <span>¡Felicidades! Tu solicitud ha sido aceptada</span>
            </div>
          )}
          
          {status === "REJECTED" && (
            <div className="alert alert-error">
              <span>Tu solicitud ha sido rechazada</span>
            </div>
          )}
          
          {status === "NO_APPLICATION" && authState.role === "PLAYER" && (
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
              <span>No tienes permiso para ver esta información</span>
            </div>
          )}
          
          {!authState.isAuthenticated && (
            <div className="alert alert-info">
              <span>Inicia sesión como jugador para ver el estado de tus aplicaciones</span>
            </div>
          )}
          
          {authState.isAuthenticated && authState.role !== "PLAYER" && (
            <div className="alert alert-warning">
              <span>Solo los jugadores pueden ver el estado de sus aplicaciones</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function applyToTeam(teamId) {
    try {
      await axios.post(
        `http://localhost:8080/api/applications/apply/${teamId}`,
        "Me gustaría unirme a su equipo",
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "text/plain"
          }
        }
      );
      setStatus("PENDING");
    } catch (err) {
      console.error("Error aplicando al equipo:", err);
      setError("Error al enviar la aplicación");
    }
  }
}
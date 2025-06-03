import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Instalar con: npm install jwt-decode

document.documentElement.setAttribute("data-theme", "lemonade");

export default function Offers() {
  const [teams, setTeams] = useState([]);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    isLoading: true
  });

  useEffect(() => {
    // Verificar autenticación y obtener rol
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          role: null,
          isLoading: false
        });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const roles = decoded.authorities || [];
        const role = roles[0]?.replace("ROLE_", ""); // Convertir "ROLE_PLAYER" a "PLAYER"
        
        setAuthState({
          isAuthenticated: true,
          role: role,
          isLoading: false
        });
      } catch (error) {
        console.error("Error decodificando token:", error);
        setAuthState({
          isAuthenticated: false,
          role: null,
          isLoading: false
        });
      }
    };

    checkAuth();

    // Obtener equipos
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/teams");
        setTeams(res.data);
      } catch (err) {
        console.error("Error al obtener equipos:", err);
      }
    };

    fetchTeams();
  }, []);

  const applyToTeam = async (teamId) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Debes iniciar sesión como jugador para aplicar");
      return;
    }

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
      alert("¡Solicitud enviada con éxito!");
    } catch (err) {
      alert(err.response?.data?.message || "Error al procesar tu solicitud");
    }
  };

  if (authState.isLoading) {
    return <div className="min-h-screen p-8 bg-base-200">Cargando...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-base-200">
      <h1 className="text-3xl font-bold mb-6 text-center">Ofertas de Equipos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            {team.logoPath && (
              <figure className="px-4 pt-4">
                <img
                  src={`http://localhost:8080${team.logoPath}`}
                  alt={`Logo de ${team.name}`}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
            )}
            <div className="card-body">
              <h2 className="card-title">{team.name}</h2>
              <div className="badge badge-outline">{team.category}</div>
              <p className="text-sm text-gray-500">{team.location}</p>
              {team.description && <p className="mt-2 text-gray-700">{team.description}</p>}
              
              {/* Botón solo visible para jugadores autenticados */}
              {authState.isAuthenticated && authState.role === "PLAYER" && (
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => applyToTeam(team.id)}
                  >
                    Unirse al equipo
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
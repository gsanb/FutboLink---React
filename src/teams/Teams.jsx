import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Search, MapPin, Layers, Users, ChevronRight } from "lucide-react";
import { API_URL } from '../config';


export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    isLoading: true
  });
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  useEffect(() => {
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
        const role = roles[0]?.replace("ROLE_", "");
        
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

    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/teams`);
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
        `${API_URL}/api/applications/apply/${teamId}`,
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
    return (
      <Layout publicRoute>
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Layout>
    );
  }

  const filteredTeams = teams.filter((team) => {
    const matchesName = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation ? team.location === selectedLocation : true;
    const matchesDivision = selectedDivision ? team.category === selectedDivision : true;
    return matchesName && matchesLocation && matchesDivision;
  });

  return (
    <Layout publicRoute>
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Explora Nuestros Equipos
          </h1>
          <p className="text-lg text-gray-600">
            Encuentra el equipo perfecto para unirte o competir
          </p>
        </div>

        {/* Filtros y contenido */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Panel de filtros */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="card bg-base-100 shadow-md p-4 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filtros de búsqueda
              </h2>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre del equipo</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar equipos..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Ubicación
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">Todas las ubicaciones</option>
                  {[...new Set(teams.map((t) => t.location))].map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    División/Categoría
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                >
                  <option value="">Todas las divisiones</option>
                  {[...new Set(teams.map((t) => t.category))].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lista de equipos */}
          <div className="flex-1">
            {filteredTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <figure className="relative h-48 overflow-hidden">
                      {team.logoPath ? (
                        <img
                          src={`http://localhost:8080${team.logoPath}`}
                          alt={`Logo de ${team.name}`}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Users className="w-16 h-16 text-primary/50" />
                        </div>
                      )}
                    </figure>
                    <div className="card-body p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="card-title text-lg font-bold">{team.name}</h2>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="badge badge-primary badge-outline">
                              {team.category}
                            </span>
                            <span className="badge badge-secondary badge-outline flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {team.location}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                      </div>
                      
                      {team.description && (
                        <p className="mt-3 text-gray-600 line-clamp-2">
                          {team.description}
                        </p>
                      )}

                      {authState.isAuthenticated && authState.role === "PLAYER" && (
                        <div className="card-actions justify-end mt-4">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              applyToTeam(team.id);
                            }}
                          >
                            Unirse al equipo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center max-w-md">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No se encontraron equipos
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar tus filtros de búsqueda o crea un nuevo equipo si eres capitán
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
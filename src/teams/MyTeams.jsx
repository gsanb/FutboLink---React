import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import { Users, PlusCircle, Edit, Trash2, MapPin, Award, AlertTriangle } from "lucide-react";

export default function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, role, isLoading: authLoading, isLoading } = useAuth();
  const navigate = useNavigate();

  //Si no eres rol team, te dirige a la pagina de no autorizado
    useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (role !== "TEAM") {
        navigate("/unauthorized");
      }
    }
  }, [isAuthenticated, role, isLoading, navigate]);
//Si cumples con el rol de team, se cargan los equipos del usuario
  useEffect(() => {
    if (!authLoading && isAuthenticated && role === "TEAM") {
      const fetchTeams = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("http://localhost:8080/api/teams/my-teams", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTeams(res.data);
        } catch (err) {
          console.error("Error al obtener tus equipos:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchTeams();
    }
  }, [authLoading, isAuthenticated, role]);

  const handleDelete = async (teamId) => {
    if (!confirm("¿Estás seguro de eliminar este equipo? Esta acción no se puede deshacer.")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(teams.filter(team => team.id !== teamId));
      alert("Equipo eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el equipo: " + (err.response?.data?.message || "Inténtalo de nuevo más tarde"));
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
//Si no estas autenticado o no tienes el rol de team, se muestra un mensaje de acceso restringido
  if (!isAuthenticated || role !== "TEAM") {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto mt-12">
          <div className="alert alert-error shadow-lg">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Acceso restringido</h3>
              <div className="text-sm">Debes tener una cuenta de Equipo registrada para acceder a esta sección</div>
              <div className="mt-2">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Iniciar sesión como Equipo
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  // Si todo está correcto, se renderiza la lista de equipos
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Mis Equipos
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona todos tus equipos registrados
              </p>
            </div>
            <button 
              className="btn btn-primary gap-2"
              onClick={() => navigate('/createteam')}
            >
              <PlusCircle className="w-5 h-5" />
              Crear Nuevo Equipo
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto">
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div 
                  key={team.id} 
                  className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 group"
                >
                  <figure className="relative h-48 overflow-hidden">
                    {team.logoPath ? (
                      <img
                        src={`http://localhost:8080${team.logoPath}`}
                        alt={`Logo de ${team.name}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Users className="w-16 h-16 text-primary/50" />
                      </div>
                    )}
                  </figure>
                  
                  <div className="card-body p-5">
                    <h2 className="card-title text-lg font-bold">{team.name}</h2>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="badge badge-outline badge-primary flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {team.category}
                      </div>
                      <div className="badge badge-outline badge-secondary flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {team.location}
                      </div>
                    </div>
                    
                    {team.description && (
                      <p className="mt-3 text-gray-600 line-clamp-2">
                        {team.description}
                      </p>
                    )}
                    
                    <div className="card-actions justify-end mt-4">
                      <button
                        className="btn btn-sm btn-outline btn-primary gap-1"
                        onClick={() => navigate(`/editteam/${team.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(team.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-base-100 rounded-box shadow-sm">
              <div className="text-center max-w-md">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No tienes equipos registrados
                </h3>
                <p className="text-gray-500 mb-6">
                  Crea tu primer equipo para comenzar a gestionar jugadores y participar en torneos
                </p>
                <button 
                  className="btn btn-primary gap-2"
                  onClick={() => navigate('/createteam')}
                >
                  <PlusCircle className="w-5 h-5" />
                  Crear mi primer equipo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
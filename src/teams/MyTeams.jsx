import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";

export default function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

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
    if (!confirm("¿Estás seguro de eliminar este equipo?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(teams.filter(team => team.id !== teamId));
      alert("Equipo eliminado correctamente");
    } catch (err) {
      alert("Error al eliminar el equipo");
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

  if (!isAuthenticated || role !== "TEAM") {
    return (
      <Layout>
        <div className="alert alert-error max-w-2xl mx-auto mt-8">
          <span>Debes ser un equipo registrado para acceder a esta página</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-8 bg-base-200">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mis Equipos</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create-team')}
          >
            Crear Nuevo Equipo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="card bg-base-100 shadow-xl">
              {team.logoPath && (
                <figure className="px-4 pt-4">
                  <img
                    src={`http://localhost:8080${team.logoPath}`}
                    alt={`Logo de ${team.name}`}
                    className="rounded-xl h-48 w-full object-contain"
                  />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title">{team.name}</h2>
                <p><strong>Categoría:</strong> {team.category}</p>
                <p><strong>Ubicación:</strong> {team.location}</p>
                
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-outline btn-primary"
                    onClick={() => navigate(`/teams/${team.id}/edit`)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-outline btn-error"
                    onClick={() => handleDelete(team.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No tienes equipos registrados</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/create-team')}
            >
              Crear mi primer equipo
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
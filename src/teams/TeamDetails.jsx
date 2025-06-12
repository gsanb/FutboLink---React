import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Obtenemos el equipo por su ID
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/teams/${id}`);
        setTeam(res.data);
      } catch (err) {
        console.error("Error al obtener el equipo:", err);
        setError("Error al cargar la información del equipo");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchTeam();
    }
  }, [id, authLoading]);

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
  // Si aún se está cargando la autenticación o los datos del equipo, mostramos un spinner
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
        <div className="alert alert-error max-w-2xl mx-auto mt-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button 
            className="btn btn-sm ml-4"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </Layout>
    );
  }
//Devuelve el componente con los detalles del equipo
  return (
    <Layout>
      <div className="min-h-screen p-8 bg-base-200">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline mb-4"
        >
          ← Volver
        </button>
        
        <div className="card bg-base-100 shadow-xl">
          {team.logoPath && (
            <figure className="px-10 pt-10">
              <img 
                src={`http://localhost:8080${team.logoPath}`} 
                alt={`Logo de ${team.name}`} 
                className="rounded-xl max-h-64 object-contain mx-auto"
              />
            </figure>
          )}
          
          <div className="card-body">
            <h2 className="card-title text-3xl">{team.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <p><strong className="text-lg">Categoría:</strong> 
                  <span className="badge badge-primary ml-2">{team.category}</span>
                </p>
                <p><strong className="text-lg">Ubicación:</strong> 
                  <span className="badge badge-secondary ml-2">{team.location}</span>
                </p>
              </div>
              
              <div>
                <p><strong className="text-lg">Descripción:</strong></p>
                <p className="mt-2 p-4 bg-base-200 rounded-lg">{team.description || "No hay descripción disponible"}</p>
              </div>
            </div>
            
            {isAuthenticated && role === "PLAYER" && (
              <div className="card-actions justify-end mt-6">
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
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import { ArrowLeft, Mail, User, Award, Info } from "lucide-react";
import { API_URL } from '../config';


export default function VerPerfilJugador() {
  const { isAuthenticated, role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//Obtenemos el ID del jugador desde la URL y lo usamos para hacer la petición
  useEffect(() => {
    const fetchPlayerProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = token ? { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        } : {};
        
        const response = await axios.get(`${API_URL}/api/player/${id}`, config);
        setPlayer(response.data);
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Acceso restringido: Debes tener rol PLAYER para ver este perfil");
        } else if (err.response?.status === 404) {
          setError("Jugador no encontrado");
        } else {
          setError("Error al cargar el perfil");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [id]);
//Si el usuario no está autenticado, redirigimos a la página de inicio de sesión
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { state: { from: `/player/${id}` } });
    }
  }, [isAuthenticated, loading, navigate, id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {error ? (
          <div className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Error!</h3>
              <div className="text-xs">{error}</div>
              {!isAuthenticated && (
                <button 
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => navigate("/login", { state: { from: `/player/${id}` } })}
                >
                  Iniciar sesión como Jugador
                </button>
              )}
            </div>
          </div>
        ) : player && (
          <div className="card bg-base-100 shadow-2xl overflow-hidden">
            {/* Header con botón de volver */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4">
              <button 
                onClick={() => navigate(-1)}
                className="btn btn-ghost btn-circle text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="card-body p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sección izquierda - Foto y datos básicos */}
                <div className="flex-shrink-0 w-full lg:w-1/3">
                  <div className="flex flex-col items-center">
                    <div className="avatar">
                      <div className="w-48 h-48 rounded-full border-4 border-primary/20 bg-base-200">
                     {player.photoUrl ? (
                                  <img
                                    src={
                                      player.photoUrl.startsWith("http")
                                        ? player.photoUrl
                                        : `http://localhost:8080${player.photoUrl}`
                                    }
                                    alt="Foto del jugador"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-8xl text-primary/30">
                                    <User className="w-24 h-24" />
                                  </div>
                                )}

                      </div>
                    </div>
                    
                    <div className="mt-6 text-center space-y-3">
                      <h2 className="text-3xl font-bold">
                        {player.name}
                      </h2>
                      
                      <div className="flex justify-center gap-2">
                        <div className="badge badge-primary gap-1">
                          {player.age} años
                        </div>
                        <div className="badge badge-secondary gap-1">
                          {player.position}
                        </div>
                      </div>
                      
                      {player.team && (
                        <div className="mt-4 p-3 bg-base-200 rounded-box">
                          <div className="flex items-center justify-center gap-2">
                            {player.team.logoUrl && (
                              <div className="avatar">
                                <div className="w-8 rounded-full">
                                  <img src={player.team.logoUrl} alt="Logo del equipo" />
                                </div>
                              </div>
                            )}
                            <span className="font-medium">Juega en {player.team.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Sección derecha - Detalles */}
                <div className="flex-grow space-y-6">
                  {/* Habilidades */}
                  <div className="bg-base-200/50 p-5 rounded-box">
                    <h3 className="font-bold text-xl flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-primary" />
                      Habilidades destacadas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {player.skills?.split(',').map((skill, index) => (
                        <span key={index} className="badge badge-lg badge-outline badge-primary">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Experiencia */}
                  <div className="bg-base-200/50 p-5 rounded-box">
                    <h3 className="font-bold text-xl flex items-center gap-2 mb-3">
                      Experiencia
                    </h3>
                    <div className="flex items-center">
                      <span className="font-medium text-lg">{player.experience} años jugando</span>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <div className="bg-base-200/50 p-5 rounded-box">
                    <h3 className="font-bold text-xl flex items-center gap-2 mb-3">
                      <Info className="w-5 h-5 text-primary" />
                      Sobre mí
                    </h3>
                    <p className="whitespace-pre-line">
                      {player.description || "Este jugador no ha añadido una descripción todavía."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
                {isAuthenticated && role === "PLAYER" && (
          <div className="flex justify-center mt-8">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/editPlayerProfile")}
            >
              Editar perfil
            </button>
          </div>
        )}

      </div>
    </Layout>
  );
}
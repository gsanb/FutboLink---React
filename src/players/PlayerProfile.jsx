import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";

export default function VerPerfilJugador() {
  const { isAuthenticated, role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        const response = await axios.get(`http://localhost:8080/api/player/${id}`, config);
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

  // Redirigir si no está autenticado o no tiene el rol correcto
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
      <div className="max-w-4xl mx-auto p-4">
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
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Sección izquierda - Foto y datos básicos */}
                <div className="flex-shrink-0">
                  <div className="avatar">
                    <div className="w-48 rounded-full bg-base-200">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt="Foto del jugador" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-4xl">
                          👤
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h2 className="text-2xl font-bold">{player.name}</h2>
                    <div className="badge badge-primary">{player.age} años</div>
                    <div className="badge badge-secondary">{player.position}</div>
                  </div>
                </div>
                
                {/* Sección derecha - Detalles */}
                <div className="flex-grow space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">Habilidades</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {player.skills?.split(',').map((skill, index) => (
                        <span key={index} className="badge badge-outline">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">Experiencia</h3>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-2xl ${i < player.experience ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2">({player.experience} años)</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">Descripción</h3>
                    <p className="mt-2 p-4 bg-base-200 rounded-lg whitespace-pre-line">
                      {player.description || "No hay descripción disponible"}
                    </p>
                  </div>
                  
                  {player.team && (
                    <div>
                      <h3 className="font-bold text-lg">Equipo Actual</h3>
                      <div className="mt-2 flex items-center gap-2">
                        {player.team.logoUrl && (
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <img src={player.team.logoUrl} alt="Logo del equipo" />
                            </div>
                          </div>
                        )}
                        <span>{player.team.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card-actions justify-end mt-6">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    if (role === 'TEAM') {
                      // Lógica para contactar al jugador
                    } else {
                      navigate('/login', { 
                        state: { 
                          message: 'Regístrate como TEAM para contactar jugadores',
                          from: `/player/${id}`
                        } 
                      });
                    }
                  }}
                >
                  {role === 'TEAM' ? 'Contactar Jugador' : 'Regístrate como Equipo para contactar'}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate(-1)}
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
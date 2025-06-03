import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function VerPerfilJugador() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8080/api/player/${id}`)
      .then(res => {
        setPlayer(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el perfil");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (error) return (
    <div className="alert alert-error max-w-2xl mx-auto my-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold mb-4">Perfil del Jugador</h1>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-bold w-32">Edad:</span>
              <span className="badge badge-primary">{player.age}</span>
            </div>
            
            <div className="flex items-center">
              <span className="font-bold w-32">Posición:</span>
              <span className="badge badge-secondary">{player.position}</span>
            </div>
            
            <div className="flex items-start">
              <span className="font-bold w-32">Habilidades:</span>
              <div className="flex flex-wrap gap-2">
                {player.skills.split(',').map((skill, index) => (
                  <span key={index} className="badge badge-outline">{skill.trim()}</span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="font-bold w-32">Experiencia:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-2xl ${i < player.experience ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
                <span className="ml-2">({player.experience} años)</span>
              </div>
            </div>
            
            <div>
              <span className="font-bold block mb-2">Descripción:</span>
              <p className="p-4 bg-base-200 rounded-lg whitespace-pre-line">{player.description}</p>
            </div>
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Contactar</button>
            <button className="btn btn-outline">Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
}
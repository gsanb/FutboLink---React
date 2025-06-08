import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

export default function PlayerProfileForm() {
  const { token, isAuthenticated, isLoading } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    position: "",
    skills: "",
    experience: "",
    description: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/player/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.log("Perfil no encontrado, se puede crear uno nuevo.");
      } finally {
        setCargandoPerfil(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/player/profile", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMensaje("Perfil guardado correctamente");
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar el perfil");
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  
  if (!isAuthenticated) return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">🔒</h1>
          <p className="py-6 text-error">No estás autenticado. Por favor inicia sesión para acceder a esta página.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>Ir al login</button>
        </div>
      </div>
    </div>
  );
  
  if (cargandoPerfil) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-secondary"></span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary">Mi Perfil de Jugador</h1>
              <p className="text-gray-500 mt-2">Completa tu perfil para que los equipos puedan encontrarte</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Nombre completo</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered input-primary"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                
                {/* Edad */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Edad</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    className="input input-bordered input-primary"
                    value={profile.age}
                    onChange={handleChange}
                    placeholder="Ej: 25"
                    min="16"
                    max="60"
                    required
                  />
                </div>
                
                {/* Posición */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Posición principal</span>
                  </label>
                  <select
                    name="position"
                    className="select select-primary w-full"
                    value={profile.position}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Selecciona tu posición</option>
                    <option value="Portero">Portero</option>
                    <option value="Defensa">Defensa</option>
                    <option value="Lateral">Lateral</option>
                    <option value="Mediocentro">Mediocentro</option>
                    <option value="Delantero">Delantero</option>
                    <option value="Extremo">Extremo</option>
                  </select>
                </div>
                
                {/* Experiencia */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Años de experiencia</span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    className="input input-bordered input-primary"
                    value={profile.experience}
                    onChange={handleChange}
                    placeholder="Ej: 5"
                    min="0"
                    max="50"
                    required
                  />
                </div>
              </div>
              
              {/* Habilidades */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Habilidades destacadas</span>
                  <span className="label-text-alt">Separa con comas</span>
                </label>
                <input
                  type="text"
                  name="skills"
                  className="input input-bordered input-primary"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="Ej: Regate, Visión de juego, Disparo lejano"
                  required
                />
              </div>
              
              {/* Descripción */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Descripción</span>
                  <span className="label-text-alt">Máx. 500 caracteres</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-primary h-32"
                  value={profile.description}
                  onChange={handleChange}
                  placeholder="Describe tu estilo de juego, logros, motivaciones..."
                  maxLength="500"
                  required
                ></textarea>
              </div>
              
              {/* Mensajes de estado */}
              {mensaje && (
                <div className={`alert ${mensaje.includes("Error") ? 'alert-error' : 'alert-success'}`}>
                  <span>{mensaje}</span>
                </div>
              )}
              
              <div className="flex justify-end mt-8">
                <button type="submit" className="btn btn-primary px-8">
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>¿Necesitas ayuda? <a href="#" className="link link-primary">Contacta con soporte</a></p>
        </div>
      </div>
    </div>
  );
}
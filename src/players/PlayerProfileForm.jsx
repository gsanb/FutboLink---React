import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, Award, Info, AlertTriangle, CheckCircle } from "lucide-react";



export default function PlayerProfileForm() {
  const { token, isAuthenticated,role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    position: "",
    skills: "",
    experience: "",
    description: "",
    photoUrl: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  const [avatar, setAvatar] = useState(null);
const [avatarPreview, setAvatarPreview] = useState(profile.photoUrl || "");

// Redirigir si no está autenticado o no es jugador
 useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (role !== "PLAYER") {
        navigate("/unauthorized");
      }
    }
  }, [isAuthenticated, role, isLoading, navigate]);

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
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("age", profile.age);
    formData.append("position", profile.position);
    formData.append("skills", profile.skills);
    formData.append("experience", profile.experience);
    formData.append("description", profile.description);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    await axios.post("http://localhost:8080/api/player/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    setMensaje("Perfil guardado correctamente");
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  } catch (err) {
    console.error(err);
    setMensaje("Error al guardar el perfil");
  }
};


  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            <AlertTriangle className="inline-block w-12 h-12 text-warning" />
          </h1>
          <p className="py-6 text-error">No estás autenticado. Por favor inicia sesión para acceder a esta página.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/login'}>
            <User className="w-5 h-5 mr-2" />
            Ir al login
          </button>
        </div>
      </div>
    </div>
  );

  if (cargandoPerfil) return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <span className="loading loading-spinner loading-lg text-secondary"></span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                <Award className="w-8 h-8" />
                Mi Perfil de Jugador
              </h1>
              <p className="text-gray-500 mt-2">Completa tu perfil para que los equipos puedan encontrarte</p>
            </div>
          <div className="form-control">
  <label className="label">
    <span className="label-text font-semibold">Foto de perfil</span>
  </label>
  <div className="flex flex-col items-center gap-4">
    <div className="avatar">
      <div className="w-32 h-32 rounded-full bg-base-200 border-2 border-dashed border-primary/30">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" className="object-cover w-full h-full rounded-full" />
        ) : (
          <User className="w-32 h-32 text-primary/30" />
        )}
      </div>
    </div>
    <label className="btn btn-outline btn-primary gap-2 cursor-pointer">
      Subir foto
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
            // Sube la imagen al backend
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("http://localhost:8080/api/player/upload-avatar", formData, {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
            });
            setProfile(prev => ({ ...prev, photoUrl: res.data })); // res.data debe ser la URL devuelta
          }
        }}
      />
    </label>
  </div>
  <label className="label">
    <span className="label-text-alt">Deja en blanco para mantener la foto actual</span>
  </label>
</div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-1">
                      <User className="w-5 h-5" />
                      Nombre completo
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered input-primary w-full"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                {/* Edad */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-1">
                      <Info className="w-5 h-5" />
                      Edad
                    </span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    className="input input-bordered input-primary w-full"
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
                    className="input input-bordered input-primary w-full"
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
                  className="input input-bordered input-primary w-full"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="Ej: Regate, Visión de juego, Disparo lejano"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-1">
                    <Info className="w-5 h-5" />
                    Descripción
                  </span>
                  <span className="label-text-alt">Máx. 500 caracteres</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-primary h-32 w-full"
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
                  {mensaje.includes("Error") ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
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
          <p>
            ¿Necesitas ayuda? <a href="#" className="link link-primary">Contacta con soporte</a>
          </p>
        </div>
      </div>
    </div>
  );
}

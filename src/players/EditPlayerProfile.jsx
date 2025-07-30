import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import { ArrowLeft, Mail, User, Award, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { API_URL } from '../config';

export default function EditarPerfilJugador() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    position: "",
    skills: "",
    experience: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);

  const [avatar, setAvatar] = useState(null);
const [avatarPreview, setAvatarPreview] = useState(""); // Para la previsualización

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

  // Cargar perfil actual
  useEffect(() => {
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/player/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setAvatarPreview(
        res.data.photoUrl
          ? res.data.photoUrl.startsWith("http")
            ? res.data.photoUrl
            : `${API_URL}${res.data.photoUrl}`
          : ""
      );
      setError(null);
    } catch (err) {
      setError("No se pudo cargar el perfil.");
    } finally {
      setLoading(false);
    }
  };
  if (isAuthenticated && role === "PLAYER") fetchProfile();
  else setLoading(false);
}, [isAuthenticated, role]);


  // Guardar cambios
const handleSubmit = async (e) => {
  e.preventDefault();
  setMensaje("");
  setError(null);
  try {
    const token = localStorage.getItem("token");
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
    await axios.post(`${API_URL}api/player/profile`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    setMensaje("Perfil actualizado correctamente");
    setTimeout(() => navigate(`/playerProfile/${profile.id}`), 1200);
  } catch (err) {
    setError("Error al guardar el perfil");
  }
};


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || role !== "PLAYER") {
    return (
      <Layout>
        <div className="alert alert-warning max-w-lg mx-auto mt-12">
          <AlertTriangle className="w-6 h-6" />
          Debes iniciar sesión como jugador para editar tu perfil.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 py-10 px-4">
        <div className="max-w-2xl mx-auto card bg-base-100 shadow-xl p-8">
          <div className="flex items-center mb-6 gap-2">
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Editar Perfil de Jugador
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
  <label className="label">
    <span className="label-text font-semibold">Foto de perfil</span>
  </label>
  <div className="flex flex-col items-center gap-4">
    <div className="avatar">
      <div className="w-32 h-32 rounded-full bg-base-200 border-2 border-dashed border-primary/30 overflow-hidden flex items-center justify-center">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" className="object-cover w-full h-full rounded-full" />
        ) : (
          <User className="w-16 h-16 text-primary/30" />
        )}
      </div>
    </div>
    <label className="btn btn-outline btn-primary gap-2 cursor-pointer">
      Cambiar foto
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
          }
        }}
      />
    </label>
  </div>
  <label className="label">
    <span className="label-text-alt">Deja en blanco para mantener la foto actual</span>
  </label>
</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  required
                />
              </div>
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
                  min="16"
                  max="60"
                  required
                />
              </div>
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
                  min="0"
                  max="50"
                  required
                />
              </div>
            </div>
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
                required
              />
            </div>
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
                maxLength="500"
                required
              ></textarea>
            </div>
            {mensaje && (
              <div className="alert alert-success flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>{mensaje}</span>
              </div>
            )}
            {error && (
              <div className="alert alert-error flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary px-8">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

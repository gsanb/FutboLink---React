import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

export default function PlayerProfileForm() {
  const { token, isAuthenticated, isLoading } = useAuth();

  const [profile, setProfile] = useState({
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

  const handleSubmit = async () => {
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

  // Esperar si el hook de auth aún está cargando
  if (isLoading) return <div className="text-center">Cargando autenticación...</div>;
  if (!isAuthenticated) return <div className="text-center text-red-500">No estás autenticado</div>;
  if (cargandoPerfil) return <div className="text-center">Cargando perfil...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mi perfil de jugador</h1>

      <div className="form-control mb-3">
        <label className="label">Edad</label>
        <input
          type="number"
          name="age"
          className="input input-bordered"
          value={profile.age}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mb-3">
        <label className="label">Posición</label>
        <input
          type="text"
          name="position"
          className="input input-bordered"
          value={profile.position}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mb-3">
        <label className="label">Habilidades</label>
        <input
          type="text"
          name="skills"
          className="input input-bordered"
          value={profile.skills}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mb-3">
        <label className="label">Años de experiencia</label>
        <input
          type="number"
          name="experience"
          className="input input-bordered"
          value={profile.experience}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">Descripción</label>
        <textarea
          name="description"
          className="textarea textarea-bordered"
          value={profile.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <button onClick={handleSubmit} className="btn btn-primary">
        Guardar perfil
      </button>

      {mensaje && (
        <div className="mt-4 alert alert-info">
          {mensaje}
        </div>
      )}
    </div>
  );
}

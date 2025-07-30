import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Users, Upload, MapPin, Award, Info, ArrowLeft, Save, X } from "lucide-react";
import { API_URL } from '../config';


export default function EditTeam() {
  const { isAuthenticated, role, isLoading, userId } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [currentLogo, setCurrentLogo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (role !== "TEAM") {
        navigate("/unauthorized");
      }
    }
  }, [isAuthenticated, role, isLoading, navigate]);

  // Cargar datos del equipo
 useEffect(() => {
  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const team = response.data;

      // --- CONTROL DE PROPIEDAD ---
      // Si el usuario autenticado NO es el propietario, redirige y no muesttra el formulario
      if (!team.user || String(team.user.id) !== String(userId)) {
  setError("No tienes permiso para editar este equipo");
  setTimeout(() => navigate("/home"), 1800);
  return;
}
      setForm({
        name: team.name,
        location: team.location,
        category: team.category,
        description: team.description
      });
      
      if (team.logoPath) {
        setCurrentLogo(`${API_URL}${team.logoPath}`);
        setLogoPreview(`${API_URL}${team.logoPath}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los datos del equipo");
      setLoading(false);
    }
  };

  if (isAuthenticated && role === "TEAM" && userId) {
    fetchTeam();
  }
}, [id, isAuthenticated, role, userId, navigate]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (let key in form) {
        formData.append(key, form[key]);
      }

      if (logo) {
        formData.append("logo", logo);
      }

      const response = await axios.put(
        `${API_URL}/api/teams/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate(`/myteams`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al actualizar el equipo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-circle mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Editar Equipo
              </span>
            </h1>
          </div>

          {/* Formulario */}
          <div className="card bg-base-100 shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="alert alert-error shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Campo Logo */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Logo del Equipo</span>
                </label>
                <div className="flex flex-col items-center gap-4">
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full bg-base-200 border-2 border-dashed border-primary/30">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Vista previa del logo" className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-primary/30">
                          <Users className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="btn btn-outline btn-primary gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Cambiar Logo
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
                <label className="label">
                  <span className="label-text-alt">Deja en blanco para mantener el logo actual</span>
                </label>
              </div>

              {/* Campo Nombre */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Nombre del Equipo
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ej: Los Tigres FC"
                  className="input input-bordered w-full"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo Ubicación */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ubicación
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Ej: Madrid Centro"
                  className="input input-bordered w-full"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Campo Categoría */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Categoría/División
                  </span>
                </label>
                <select
                  name="category"
                  className="select select-bordered w-full"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Primera División">Primera División</option>
                  <option value="Segunda División">Segunda División</option>
                  <option value="Tercera División">Tercera División</option>
                  <option value="Juvenil">Juvenil</option>
                  <option value="Veteranos">Veteranos</option>
                  <option value="Amateur">Amateur</option>
                </select>
              </div>

              {/* Campo Descripción */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Descripción
                  </span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe tu equipo, filosofía de juego, horarios de entrenamiento, etc."
                  className="textarea textarea-bordered w-full h-32"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  className="btn btn-outline flex-1 gap-2"
                  onClick={() => navigate(`/teams/${id}`)}
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`btn btn-primary flex-1 gap-2 ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {!isSubmitting && <Save className="w-5 h-5" />}
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
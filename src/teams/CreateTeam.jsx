import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Users, Upload, MapPin, Award, Info, ArrowLeft } from "lucide-react";

export default function CreateTeam() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuración del tema
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lemonade");
  }, []);

  // Protección de ruta para rol TEAM
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (role !== "TEAM") {
        navigate("/unauthorized");
      }
    }
  }, [isAuthenticated, role, isLoading, navigate]);

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

      const response = await axios.post("http://localhost:8080/api/teams", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        navigate(`/teams/${response.data.id}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al crear el equipo. Por favor, verifica los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
                Crear Nuevo Equipo
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
                    <div className="w-24 h-24 rounded-full bg-base-200 border-2 border-dashed border-primary/30">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Vista previa del logo" className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-primary/30">
                          <Users className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="btn btn-outline btn-primary gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Subir Logo
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
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

              {/* Botón de enviar */}
              <div className="form-control mt-8">
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando equipo...' : 'Crear Equipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
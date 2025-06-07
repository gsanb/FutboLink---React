import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function EditTeam() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
  });

  const [logo, setLogo] = useState(null);
  const [currentLogo, setCurrentLogo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  // Cargar datos del equipo
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/api/teams/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const team = response.data;
        setForm({
          name: team.name,
          location: team.location,
          category: team.category,
          description: team.description
        });
        
        if (team.logoPath) {
          setCurrentLogo(`http://localhost:8080${team.logoPath}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos del equipo");
        setLoading(false);
      }
    };

    if (isAuthenticated && role === "TEAM") {
      fetchTeam();
    }
  }, [id, isAuthenticated, role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        `http://localhost:8080/api/teams/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate(`/teams/${id}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al actualizar el equipo");
    }
  };

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
        <form
          onSubmit={handleSubmit}
          className="card w-full max-w-md bg-base-100 shadow-xl p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Editar Equipo</h2>
          
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Logo del equipo</span>
            </label>
            {currentLogo && (
              <div className="mb-4">
                <img 
                  src={currentLogo} 
                  alt="Logo actual" 
                  className="w-32 h-32 object-contain mx-auto rounded-lg"
                />
                <p className="text-center text-sm mt-2">Logo actual</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => setLogo(e.target.files[0])}
            />
            <label className="label">
              <span className="label-text-alt">Deja en blanco para mantener el logo actual</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre del equipo</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nombre del equipo"
              className="input input-bordered w-full"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ubicación</span>
            </label>
            <input
              type="text"
              name="location"
              placeholder="Ubicación"
              className="input input-bordered w-full"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Categoría</span>
            </label>
            <input
              type="text"
              name="category"
              placeholder="Categoría"
              className="input input-bordered w-full"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Descripción</span>
            </label>
            <textarea
              name="description"
              placeholder="Descripción"
              className="textarea textarea-bordered w-full"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <button 
              type="button" 
              className="btn btn-outline flex-1"
              onClick={() => navigate(`/teams/${id}`)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
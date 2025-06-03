import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // Usa tu hook personalizado

const CreateTeam = () => {
  const { userId, role, isAuthenticated } = useAuth(); // Obtenemos los datos necesarios del hook
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    userId: '' // Lo actualizaremos con useEffect
  });

  const [error, setError] = useState('');

  // Cuando el userId esté disponible, lo establecemos
  useEffect(() => {
    if (userId) {
      setFormData(prev => ({ ...prev, userId }));
    }
  }, [userId]);

  // Opcional: proteger la ruta solo para equipos
  useEffect(() => {
    if (!isAuthenticated || role !== 'TEAM') {
      navigate('/unauthorized'); // o muestra un mensaje
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/teams', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el equipo');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Equipo</h2>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nombre del Equipo</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
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
            value={formData.location}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Crear Equipo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;

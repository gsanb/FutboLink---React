import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Users, Loader2, AlertCircle } from "lucide-react";
import { API_URL } from '../config';

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "PLAYER",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Maneja el envío del formulario de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post("${API_URL}/auth/register", formData);
      localStorage.setItem("token", res.data.access_token);

      if (formData.role === "PLAYER") {
        navigate("/createPlayer");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al registrarse. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="card w-full max-w-md bg-base-100 shadow-xl px-8 py-10 space-y-6"
      >
        <div className="flex flex-col items-center mb-4">
          <UserPlus className="w-10 h-10 text-primary mb-2" />
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Registro
          </h2>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1 font-semibold">
              <User className="w-4 h-4" />
              Nombre completo
            </span>
          </label>
          <input
            name="name"
            placeholder="Tu nombre"
            className="input input-bordered input-primary w-full"
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1 font-semibold">
              <Mail className="w-4 h-4" />
              Correo electrónico
            </span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="tu@email.com"
            className="input input-bordered input-primary w-full"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1 font-semibold">
              <Lock className="w-4 h-4" />
              Contraseña
            </span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="input input-bordered input-primary w-full"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1 font-semibold">
              <Users className="w-4 h-4" />
              Rol
            </span>
          </label>
          <select
            name="role"
            className="select select-primary w-full"
            onChange={handleChange}
            value={formData.role}
          >
            <option value="PLAYER">Jugador</option>
            <option value="TEAM">Equipo</option>
          </select>
        </div>

        {errorMsg && (
          <div className="alert alert-error flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Registrarse</span>
            </>
          )}
        </button>

        <div className="text-center mt-4 text-base-content/70">
          <span>¿Ya tienes cuenta? </span>
          <Link to="/login" className="link link-primary font-semibold">
            Inicia sesión aquí
          </Link>
        </div>
      </form>
    </div>
  );
}

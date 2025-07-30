import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { API_URL } from '../config';
document.documentElement.setAttribute("data-theme", "lemonade");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Maneja el envío del formulario de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      //rEDirigimos al usuario a la página de inicio
      navigate("/home");
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="card w-full max-w-md bg-base-100 shadow-xl px-8 py-10 space-y-6"
      >
        <div className="flex flex-col items-center mb-4">
          <LogIn className="w-10 h-10 text-primary mb-2" />
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Iniciar Sesión
          </h2>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-1 font-semibold">
              <User className="w-4 h-4" />
              Correo electrónico
            </span>
          </label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="input input-bordered input-primary w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
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
            type="password"
            placeholder="Contraseña"
            className="input input-bordered input-primary w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && (
          <div className="alert alert-error flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          className="btn btn-primary w-full flex items-center justify-center gap-2"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Entrar</span>
            </>
          )}
        </button>

        <div className="text-center mt-4 text-base-content/70">
          <span>¿No tienes cuenta? </span>
          <Link to="/register" className="link link-primary font-semibold">
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
}

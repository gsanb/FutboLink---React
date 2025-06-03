import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
    document.documentElement.setAttribute("data-theme", "lemonade");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      navigate("/home");
      alert("Login exitoso");
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form onSubmit={handleLogin} className="card w-96 bg-base-100 shadow-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-full" type="submit">
          Entrar
        </button>
        <div className="text-center mt-4">
          <span>¿No tienes cuenta? </span>
          <Link to="/register" className="link link-primary">
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
}
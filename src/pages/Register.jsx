import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
    document.documentElement.setAttribute("data-theme", "lemonade");

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "PLAYER",
  });
const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8080/auth/register", formData);
    localStorage.setItem("token", res.data.access_token);
    alert("Registro exitoso");
    navigate("/home"); // Redirige a Home después del registro
  } catch (err) {
    console.error(err);
    alert("Error al registrarse");
  }
};

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form onSubmit={handleRegister} className="card w-96 bg-base-100 shadow-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center">Registro</h2>
        <input
          name="name"
          placeholder="Nombre"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Correo"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="input input-bordered w-full"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="select select-bordered w-full"
          onChange={handleChange}
        >
          <option value="PLAYER">Jugador</option>
          <option value="TEAM">Equipo</option>
        </select>
        <button className="btn btn-success w-full" type="submit">
          Registrarse
        </button>
        <div className="text-center mt-4">
          <span>¿Ya tienes cuenta? </span>
          <Link to="/login" className="link link-primary">
            Inicia sesión aquí
          </Link>
        </div>
      </form>
    </div>
  );
}
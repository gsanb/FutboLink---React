// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar({ showAuthButtons = true }) {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={() => navigate("/")}>
          FutbolApp
        </a>
      </div>
      
      {showAuthButtons && isAuthenticated ? (
        <div className="flex-none gap-2">
          {/* Botones para usuarios autenticados */}
          <button className="btn btn-ghost" onClick={() => navigate("/teams")}>
            Equipos
          </button>
          
          {role === "TEAM" && (
            <button 
              className="btn btn-ghost" 
              onClick={() => navigate("/create-team")}
            >
              Crear Equipo
            </button>
          )}
          
          <button 
            className="btn btn-ghost"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      ) : showAuthButtons ? (
        <div className="flex-none gap-2">
          {/* Botones para usuarios no autenticados */}
          <button 
            className="btn btn-ghost"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/register")}
          >
            Registrarse
          </button>
        </div>
      ) : (
        <div className="flex-none gap-2">
          {/* Botones para rutas públicas */}
          <button className="btn btn-ghost" onClick={() => navigate("/teams")}>
            Equipos
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/about")}>
            Sobre Nosotros
          </button>
        </div>
      )}
    </div>
  );
}
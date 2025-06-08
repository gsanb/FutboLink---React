// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";
import { Bell } from "lucide-react";



export default function Navbar({ showAuthButtons = true }) {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();

const { notifications, markAllAsRead } = useNotifications();
const unreadCount = notifications.length;


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
          <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="badge badge-sm indicator-item">{unreadCount}</span>
                  )}
                </div>
              </div>
                      <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-80"
              onMouseLeave={() => markAllAsRead()} // o usa onClick si prefieres
            >
              {notifications.length === 0 ? (
                <li className="text-center">No hay notificaciones</li>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <li key={n.id}>
                    <span className="text-sm">{n.message}</span>
                  </li>
                ))
              )}
            </ul>

          </div>
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
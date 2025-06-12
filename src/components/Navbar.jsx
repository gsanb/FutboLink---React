import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";
import { Bell, Settings, LogOut, User, Users, Mail, FileText, Menu } from "lucide-react";
import futbolinkImg from "../image/futbolink.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { userId, role, isAuthenticated } = useAuth();
  const { notifications, markAllAsRead } = useNotifications();
  const unreadCount = notifications.length;
  const [playerId, setPlayerId] = useState(null);
  const [playerPhotoUrl, setPlayerPhotoUrl] = useState(null);

//Dependiendo del rol, tendremos distinos menús y funcionalidades
useEffect(() => {
  const fetchPlayerProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token || role !== "PLAYER") return;

    try {
      const res = await fetch("http://localhost:8080/api/player/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo obtener el perfil del jugador");

      const data = await res.json();
      setPlayerId(data.id);
      setPlayerPhotoUrl(data.photoUrl || null);
    } catch (err) {
      console.error("Error al obtener el perfil del jugador:", err);
    }
  };

  fetchPlayerProfile();
}, [role]);


  // Menú de navegación (para reusar en desktop y mobile)
  const navMenu = (
    <>
      <li>
        <button
          className="flex items-center gap-2"
          onClick={() => navigate("/teams")}
        >
          <Users className="w-5 h-5" />
          Equipos
        </button>
      </li>
      {role === "PLAYER" && (
        <>
          <li>
            <button
              className="flex items-center gap-2"
              onClick={() => navigate("/applications")}
            >
              <FileText className="w-5 h-5" />
              Solicitudes
            </button>
          </li>
          <li>
            <button
              className="flex items-center gap-2"
              onClick={() => navigate(`/playerProfile/${playerId}`)}
              disabled={!playerId}
            >
              <User className="w-5 h-5" />
              Perfil
            </button>
          </li>
        </>
      )}
      {role === "TEAM" && (
        <>
          <li>
            <button
              className="flex items-center gap-2"
              onClick={() => navigate("/myteams")}
            >
              <Users className="w-5 h-5" />
              Mis Equipos
            </button>
          </li>
          <li>
            <button
              className="flex items-center gap-2"
              onClick={() => navigate("/teamapplications")}
            >
              <Mail className="w-5 h-5" />
              Solicitudes
            </button>
          </li>
        </>
      )}
      <li>
        <button
          className="flex items-center gap-2"
          onClick={() => navigate("/chats")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chats
        </button>
      </li>
    </>
  );

  return (
   <div className="navbar bg-base-100/80 backdrop-blur-sm border-b border-base-200 px-4 lg:px-8">
  {/* Texto a la izquierda */}
  <div className="flex-1">
    <a
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate("/home")}
    >
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
        FutboLink
      </span>
    </a>
  </div>

  {/* Logo centrado */}
  <div className="absolute left-1/2 transform -translate-x-1/2">
    <img
      src={futbolinkImg}
      alt="FutboLink Logo"
      className="h-25 w-25 object-contain transition-transform hover:scale-105 cursor-pointer"
      onClick={() => navigate("/home")}
    />
  </div>


      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          {/* Desktop menu */}
          <ul className="hidden md:flex menu menu-horizontal gap-1 px-1">{navMenu}</ul>

          {/* Notificaciones */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              onClick={markAllAsRead}
            >
              <div className="indicator">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="badge badge-sm indicator-item bg-red-500 border-red-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content mt-3 z-[1] p-2 shadow menu menu-sm bg-base-100 rounded-box w-80"
            >
              {notifications.length === 0 ? (
                <li className="text-center py-2">No hay notificaciones</li>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <li
                    key={n.id}
                    className="hover:bg-base-200 rounded"
                    onClick={markAllAsRead}
                  >
                    <a className="py-2">
                      <span className="text-sm">{n.message}</span>
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Usuario */}
          <div className="dropdown dropdown-end">
           <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {role === "PLAYER" && playerPhotoUrl ? (
                  <img
                    src={
                      playerPhotoUrl.startsWith("http")
                        ? playerPhotoUrl
                        : `http://localhost:8080${playerPhotoUrl}`
                    }
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>

            <ul tabIndex={0} className="dropdown-content mt-3 z-[1] p-2 shadow menu menu-sm bg-base-100 rounded-box w-52">
              <li>
                <a onClick={() => navigate("/settings")} className="py-2">
                  <Settings className="w-4 h-4" />
                  Ajustes
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="py-2 text-error"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile hamburger menu */}
          <div className="dropdown dropdown-end md:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Menu className="w-6 h-6" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content mt-3 z-[2] p-2 shadow menu menu-sm bg-base-100 rounded-box w-56"
            >
              {navMenu}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex-none gap-2">
          <button
            className="btn btn-ghost hidden sm:inline-flex"
            onClick={() => navigate("/teams")}
          >
            Equipos
          </button>
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
      )}
    </div>
  );
}

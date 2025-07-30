import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import { User, Mail, Lock, LogOut, Trash2, Upload, Save, Key } from "lucide-react";
import { API_URL } from './config';

export default function Ajustes() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({ 
    name: "", 
    email: "", 
    avatarPath: "" 
  });
  const [passwordData, setPasswordData] = useState({ 
    oldPassword: "", 
    newPassword: "" 
  });
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    //Si está autenticado podra acceder a la página de ajustes
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        if (response.data.avatarPath) {
          setAvatarPreview(`${API_URL}${response.data.avatarPath}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, isLoading, navigate]);

  const updateProfile = async () => {
    setIsUpdating(true);
    try {
      await axios.put(`${API_URL}/api/users/me`, user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar perfil");
    } finally {
      setIsUpdating(false);
    }
  };

  const changePassword = async () => {
    setIsChangingPassword(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/users/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPasswordData({ oldPassword: "", newPassword: "" });
      alert(response.data.message || "Contraseña cambiada exitosamente");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert(error.response.data.message || "Datos inválidos");
            break;
          case 401:
            alert("No autorizado - Token inválido o expirado");
            break;
          case 403:
            alert("Contraseña actual incorrecta");
            break;
          default:
            alert("Error al cambiar contraseña");
        }
      } else {
        alert("Error de conexión. Intenta nuevamente");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) return;
    
    try {
      await axios.delete(`${API_URL}/api/users/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("Error al eliminar cuenta");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <User className="w-8 h-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Configuración de Cuenta
            </span>
          </h1>

          {/* Sección de Perfil */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Información del Perfil
              </h2>
              

              {/* Nombre */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre
                  </span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  value={user.name} 
                  onChange={(e) => setUser({ ...user, name: e.target.value })} 
                />
              </div>

              {/* Email */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered w-full" 
                  value={user.email} 
                  onChange={(e) => setUser({ ...user, email: e.target.value })} 
                />
              </div>

              <button 
                onClick={updateProfile} 
                className={`btn btn-primary gap-2 ${isUpdating ? 'loading' : ''}`}
                disabled={isUpdating}
              >
                {!isUpdating && <Save className="w-5 h-5" />}
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>

          {/* Sección de Contraseña */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Cambiar Contraseña
              </h2>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Contraseña Actual</span>
                </label>
                <input 
                  type="password" 
                  className="input input-bordered w-full" 
                  placeholder="Ingresa tu contraseña actual"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} 
                />
              </div>

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-medium">Nueva Contraseña</span>
                </label>
                <input 
                  type="password" 
                  className="input input-bordered w-full" 
                  placeholder="Ingresa tu nueva contraseña"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                />
              </div>

              <button 
                onClick={changePassword} 
                className={`btn btn-primary gap-2 ${isChangingPassword ? 'loading' : ''}`}
                disabled={isChangingPassword}
              >
                {!isChangingPassword && <Key className="w-5 h-5" />}
                {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </div>

          {/* Sección de Acciones */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={logout} 
                  className="btn btn-outline gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
                
                <button 
                  onClick={deleteAccount} 
                  className="btn btn-error gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Eliminar Cuenta Permanentemente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Layout from "./components/Layout";

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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, isLoading, navigate]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/upload-avatar", 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setUser({ ...user, avatarPath: res.data });
      alert("Avatar actualizado");
    } catch (error) {
      console.error("Error al subir avatar:", error);
      alert("Error al subir avatar");
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put("http://localhost:8080/api/users/me", user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar perfil");
    }
  };

  const changePassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/change-password",
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
    }
  };

  const deleteAccount = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) return;
    
    try {
      await axios.delete("http://localhost:8080/api/users/delete", {
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
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Ajustes de cuenta</h1>

        <div className="card bg-base-100 shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Información del perfil</h2>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full" 
              value={user.name} 
              onChange={(e) => setUser({ ...user, name: e.target.value })} 
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              type="email" 
              className="input input-bordered w-full" 
              value={user.email} 
              onChange={(e) => setUser({ ...user, email: e.target.value })} 
            />
          </div>

          {role !== "TEAM" && (
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Avatar</span>
              </label>
              <input 
                type="file" 
                className="file-input file-input-bordered w-full" 
                accept="image/*"
                onChange={handleAvatarUpload} 
              />
              {user.avatarPath && (
                <div className="mt-3">
                  <img 
                    src={`http://localhost:8080${user.avatarPath}`} 
                    className="w-20 h-20 rounded-full object-cover" 
                    alt="Avatar" 
                  />
                </div>
              )}
            </div>
          )}

          <button 
            onClick={updateProfile} 
            className="btn btn-primary w-full mt-2"
          >
            Guardar cambios
          </button>
        </div>

        <div className="card bg-base-100 shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Contraseña actual</span>
            </label>
            <input 
              type="password" 
              className="input input-bordered w-full" 
              placeholder="Ingresa tu contraseña actual"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} 
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Nueva contraseña</span>
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
            className="btn btn-primary w-full"
          >
            Cambiar contraseña
          </button>
        </div>

        <div className="card bg-base-100 shadow-md p-6">
          <div className="flex flex-col gap-4">
            <button 
              onClick={logout} 
              className="btn btn-outline w-full"
            >
              Cerrar sesión
            </button>
            
            <button 
              onClick={deleteAccount} 
              className="btn btn-error w-full"
            >
              Eliminar cuenta permanentemente
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
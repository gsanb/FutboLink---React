import { useState, useEffect } from "react";
import axios from "axios";

export default function Ajustes() {
  const [user, setUser] = useState({ name: "", email: "", avatarPath: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    // Puedes hacer un fetch para traer los datos del usuario si quieres
  }, []);

const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("http://localhost:8080/api/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
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

    // Limpiamos los campos si fue exitoso
    setPasswordData({ oldPassword: "", newPassword: "" });
    
    // Mostramos mensaje de éxito (puedes personalizar según la respuesta del backend)
    alert(response.data.message || "Contraseña cambiada exitosamente");
    
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    
    // Manejo específico de errores por código de estado
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
    if (!confirm("¿Estás seguro?")) return;
    await axios.delete("http://localhost:8080/api/users/delete");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajustes</h1>

      <div className="mb-6">
        <label className="block">Nombre</label>
        <input className="input w-full" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
        <label className="block mt-2">Email</label>
        <input className="input w-full" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
        <label className="block mt-2">Avatar</label>
        <input type="file" onChange={handleAvatarUpload} />
        {user.avatarPath && (
          <img src={`http://localhost:8080${user.avatarPath}`} className="w-20 mt-2 rounded" alt="Avatar" />
        )}
        <button onClick={updateProfile} className="btn btn-primary mt-3">Guardar cambios</button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
        <input className="input w-full mt-2" type="password" placeholder="Antigua contraseña"
          onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
        <input className="input w-full mt-2" type="password" placeholder="Nueva contraseña"
          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
        <button onClick={changePassword} className="btn mt-3">Cambiar</button>
      </div>

      <div className="mb-6">
        <button className="btn btn-error" onClick={deleteAccount}>Eliminar cuenta</button>
      </div>

      <div>
        <button className="btn" onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );
}

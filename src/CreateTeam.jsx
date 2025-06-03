import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
    document.documentElement.setAttribute("data-theme", "lemonade");

export default function CreateTeam() {
 const [form, setForm] = useState({
  name: "",
  location: "",
  category: "",
  description: "",
});

const [logo, setLogo] = useState(null);


  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Añadir datos del formulario
    for (let key in form) {
      formData.append(key, form[key]);
    }

    // Añadir imagen si existe
    if (logo) {
      formData.append("logo", logo);
    }

    await axios.post("http://localhost:8080/api/teams", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Equipo creado correctamente");
    navigate("/home");
  } catch (err) {
    console.error(err);
    alert("Error al crear el equipo");
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 shadow-xl p-8 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Crear Equipo</h2>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setLogo(e.target.files[0])}
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre del equipo"
          className="input input-bordered w-full"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Ubicación"
          className="input input-bordered w-full"
          value={form.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          className="input input-bordered w-full"
          value={form.category}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Descripción"
          className="textarea textarea-bordered w-full"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary w-full">
          Crear
        </button>
      </form>
    </div>
  );
}

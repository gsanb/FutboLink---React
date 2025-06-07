// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import Layout from "./components/Layout"; // Asegúrate que la ruta sea correcta

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout publicRoute>
      {/* Carrusel */}
      <div className="carousel w-full rounded-box mb-8">
        <div id="slide1" className="carousel-item relative w-full h-64">
          <img 
            src="https://via.placeholder.com/800x300?text=Bienvenido+a+FutbolApp" 
            className="w-full object-cover" 
            alt="Slide 1" 
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle">❮</a> 
            <a href="#slide2" className="btn btn-circle">❯</a>
          </div>
        </div>
        {/* Resto de slides... */}
      </div>

      {/* Sección de bienvenida */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a FutboLink</h1>
        <p className="text-lg mb-6">La plataforma que conecta jugadores y equipos de fútbol</p>
        
        <div className="flex justify-center gap-4">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/teams")}
          >
            Ver Equipos
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate("/createTeam")}
          >
            Ver Ofertas
          </button>
        </div>
      </div>

      {/* Resto del contenido... */}
    </Layout>
  );
}
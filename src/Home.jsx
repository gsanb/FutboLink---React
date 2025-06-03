import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lemonade");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="navbar bg-base-300">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">FutbolApp</a>
        </div>
        <div className="flex-none">
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
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
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
          <div id="slide2" className="carousel-item relative w-full h-64">
            <img 
              src="https://via.placeholder.com/800x300?text=Encuentra+tus+mejores+jugadores" 
              className="w-full object-cover" 
              alt="Slide 2" 
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide1" className="btn btn-circle">❮</a> 
              <a href="#slide3" className="btn btn-circle">❯</a>
            </div>
          </div> 
          <div id="slide3" className="carousel-item relative w-full h-64">
            <img 
              src="https://via.placeholder.com/800x300?text=Únete+a+grandes+equipos" 
              className="w-full object-cover" 
              alt="Slide 3" 
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide2" className="btn btn-circle">❮</a> 
              <a href="#slide4" className="btn btn-circle">❯</a>
            </div>
          </div> 
        </div>

        {/* Sección de bienvenida */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a FutbolApp</h1>
          <p className="text-lg mb-6">La plataforma que conecta jugadores y equipos de fútbol</p>
          
          <div className="flex justify-center gap-4">
            <button className="btn btn-primary" onClick={() => navigate("/teams")}>
              Ver Equipos
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/offers")}>
              Ver Ofertas
            </button>
          </div>
        </div>

        {/* Tarjetas informativas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Para Equipos</h2>
              <p>Encuentra los mejores jugadores para tu equipo. Publica ofertas y recibe solicitudes.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-outline">Más info</button>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Para Jugadores</h2>
              <p>Descubre oportunidades para unirte a equipos que buscan tu talento y habilidades.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-outline">Más info</button>
              </div>
            </div>
          </div>
       
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Estadísticas</h2>
              <p>Mantén un registro de tu rendimiento y mejora como jugador profesional.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-outline">Más info</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de contacto */}
        <div className="card bg-base-300 shadow-xl p-8">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl mb-4">¿Necesitas ayuda?</h2>
            <p className="mb-6">Contáctanos para resolver cualquier duda sobre nuestra plataforma.</p>
            <button className="btn btn-accent">Contactar Soporte</button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout"; // Asegúrate de tener un Layout adecuado
import slide2Img from "../image/slide2.jpg";
import slide3Img from "../image/slide3.jpg";
import aficionIMG from "../image/aficion.jpg"
import campoIMG from "../image/campo.jpg";
import futbolIMG from "../image/futbol.jpg";
import jugadoresIMG from "../image/jugadores.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(1);
  const carouselRef = useRef(null);
  const totalSlides = 3; // Ajusta según tus slides

  // Efecto para el carrusel automático
  useEffect(() => {
  const interval = setInterval(() => {
    setActiveSlide((prev) => {
      const nextSlide = (prev % totalSlides) + 1;
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: carouselRef.current.clientWidth * (nextSlide - 1),
          behavior: 'smooth',
        });
      }
      return nextSlide;
    });
  }, 5000);

  return () => clearInterval(interval);
}, []);


  return (
    <Layout publicRoute>
    <div className="container mx-auto px-4 py-8">
      {/* Carrusel automático */}
      <div className="relative mb-12">
       <div 
  ref={carouselRef}
  className="carousel w-full rounded-box shadow-xl overflow-x-scroll scroll-smooth flex"
>
  {[1, 2, 3].map((slide) => (
    <div 
      key={slide}
      className="carousel-item w-full h-64 md:h-96 flex-shrink-0 relative"
    >
      {slide === 1 ? (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
            Conecta con equipos
          </h2>
        </div>
      ) : (
        <>
          <img 
            src={slide === 2 ? slide2Img : slide3Img}
            className="w-full object-cover"
            alt={`Slide ${slide}`}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              {slide === 2 && "Encuentra jugadores"}
              {slide === 3 && "Mejora tu juego"}
            </h2>
          </div>
        </>
      )}
    </div>
  ))}
</div>

        
        {/* Indicadores del carrusel */}
        <div className="flex justify-center gap-2 mt-4">
  {[1, 2, 3].map((slide) => (
    <button
      key={slide}
      onClick={() => {
        setActiveSlide(slide);
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            left: carouselRef.current.clientWidth * (slide - 1),
            behavior: 'smooth',
          });
        }
      }}
      className={`w-3 h-3 rounded-full ${activeSlide === slide ? 'bg-primary' : 'bg-gray-300'}`}
      aria-label={`Ir a slide ${slide}`}
    />
  ))}
</div>

      </div>

      {/* Sección de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Fila superior (2 cards) */}
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <figure className="px-4 pt-4">
            <img 
              src={aficionIMG}
              alt="Equipos" 
              className="rounded-xl h-48 w-full object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Explora Equipos</h2>
            <p>Descubre equipos en tu área y únete a la competencia.</p>
            <div className="card-actions justify-end">
              <button 
                onClick={() => navigate("/teams")}
                className="btn btn-primary"
              >
                Ver equipos
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <figure className="px-4 pt-4">
            <img 
              src={jugadoresIMG}
              alt="Jugadores" 
              className="rounded-xl h-48 w-full object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Encuentra Jugadores</h2>
            <p>Si eres un equipo, encuentra el talento que necesitas.</p>
            <div className="card-actions justify-end">
              <button 
                onClick={() => navigate("/players")}
                className="btn btn-secondary"
              >
                Buscar jugadores
              </button>
            </div>
          </div>
        </div>

        {/* Fila inferior (2 cards) */}
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <figure className="px-4 pt-4">
            <img 
              src={campoIMG}
              alt="Campos" 
              className="rounded-xl h-48 w-full object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Reserva Campos</h2>
            <p>Encuentra y reserva campos para tus partidos.</p>
            <div className="card-actions justify-end">
              <button 
                onClick={() => navigate("/fields")}
                className="btn btn-accent"
              >
                Ver Campos
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
          <figure className="px-4 pt-4">
            <img 
              src={futbolIMG}
              alt="Torneos" 
              className="rounded-xl h-48 w-full object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Únete a Torneos</h2>
            <p>Participa en competencias locales y demuestra tu habilidad.</p>
            <div className="card-actions justify-end">
              <button 
                onClick={() => navigate("/tournaments")}
                className="btn btn-info"
              >
                Ver torneos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección CTA */}
      <div className="text-center bg-gradient-to-r from-primary to-secondary text-primary-content p-8 rounded-box shadow-lg mb-12">
        <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
        <p className="mb-6">Regístrate ahora y accede a todas las funciones de FutboLink</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => navigate("/register")}
            className="btn btn-neutral"
          >
            Registrarse
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="btn btn-outline btn-neutral"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
    </Layout>
  );
}
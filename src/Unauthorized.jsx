// src/pages/Unauthorized.jsx
import Layout from "./components/Layout";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="hero min-h-[calc(100vh-200px)] bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="flex justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold mb-4">403 - Acceso no autorizado</h1>
            <p className="text-xl mb-8">
              No tienes permiso para acceder a esta página con tu rol actual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate(-1)} 
                className="btn btn-primary"
              >
                ← Volver atrás
              </button>
              <button 
                onClick={() => navigate("/home")} 
                className="btn btn-ghost"
              >
                Ir al inicio
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }} 
                className="btn btn-outline btn-error"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
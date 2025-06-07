// src/components/Layout.jsx
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";

export default function Layout({ children, publicRoute = false }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Configuración del tema
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lemonade");
  }, []);

  // Redirigir solo en rutas protegidas
  useEffect(() => {
    if (!publicRoute && !isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, publicRoute]);

  if (!publicRoute && isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar showAuthButtons={!publicRoute} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
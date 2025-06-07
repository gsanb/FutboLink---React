import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PlayerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [authState, setAuthState] = useState({ isLoading: true });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          localStorage.removeItem("token");
          throw new Error("Token expirado");
        }

        const role = (decoded.authorities || [])[0]?.replace("ROLE_", "");

        setAuthState({
          isAuthenticated: true,
          role,
          token,
          isLoading: false
        });
      } catch (err) {
        setAuthState({ isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/applications/player", {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error cargando postulaciones:", err);
        setError("Error al cargar postulaciones");
      }
    };

    if (!authState.isLoading && authState.isAuthenticated && authState.role === "PLAYER") {
      fetchApplications();
    }
  }, [authState]);

  if (authState.isLoading) return <div className="p-8">Cargando autenticación...</div>;
  if (!authState.isAuthenticated || authState.role !== "PLAYER") {
    return <div className="p-8 text-warning">Solo los jugadores pueden ver sus postulaciones.</div>;
  }
  if (error) return <div className="p-8 text-error">{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-base-200">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mis postulaciones</h1>
        {applications.length === 0 ? (
          <p>No has aplicado a ningún equipo aún.</p>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <Link
                key={app.id}
                to={`/applicationstatus/${app.id}`} // si decides usar ID de aplicación o teamId
                className="card bg-base-100 shadow-md p-4 hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold mb-2">{app.teamName || "Equipo desconocido"}</h2>
                <p><span className="font-semibold">Mensaje:</span> {app.message}</p>
                <p><span className="font-semibold">Estado:</span> {app.status}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

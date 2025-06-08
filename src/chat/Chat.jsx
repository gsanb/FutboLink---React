import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import useAuth from '../hooks/useAuth'; // Asegúrate de que la ruta sea correcta
import Layout from "../components/Layout";


export default function Chat() {
  const { applicationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const { token, isAuthenticated, role } = useAuth();

  // Función para obtener mensajes
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/chat/${applicationId}`, {  // <-- backticks para template string
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Función para enviar mensaje
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || !isAuthenticated) return;

    try {
      await axios.post(`http://localhost:8080/api/chat/${applicationId}`, { content }, {  // <-- backticks aquí también
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContent('');
      fetchMessages(); // Recarga mensajes tras enviar
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect para cargar mensajes y actualizar cada 10s
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, applicationId, token]);  // <-- incluye token

  // Scroll automático al final cuando cambian los mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Formatear fecha para mostrar hora y minutos
  const formatDate = (dateStr) => new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="alert alert-warning">Debes iniciar sesión para acceder al chat</div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-base-200 shadow-xl rounded-xl p-4 h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="text-center">Cargando mensajes...</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat ${msg.senderRole === 'PLAYER' ? 'chat-start' : 'chat-end'}`}
            >
              <div className="chat-header">
                {msg.senderRole === 'PLAYER' ? 'Jugador' : 'Equipo'}
                <time className="text-xs opacity-50 ml-2">{formatDate(msg.timestamp)}</time>
              </div>
              <div className="chat-bubble">{msg.content}</div>
            </div>
          ))
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* Formulario para enviar mensaje */}
      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Escribe tu mensaje"
          className="input input-bordered w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!isAuthenticated}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!isAuthenticated || !content.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
    </Layout>
  );
}

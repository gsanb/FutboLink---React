import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import useAuth from '../hooks/useAuth';
import Layout from "../components/Layout";
import { User, Users, SendHorizonal, Loader2, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

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
      const res = await axios.get(`${API_URL}/api/chat/${applicationId}`, {
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
      await axios.post(`http://localhost:8080/api/chat/${applicationId}`, { content }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContent('');
      fetchMessages();
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
  }, [isAuthenticated, applicationId, token]);

  

  // Formatear fecha para mostrar hora y minutos
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 flex items-center">
          <div className="max-w-lg mx-auto w-full">
            <div className="alert alert-warning flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Debes iniciar sesión para acceder al chat.
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Cabecera del chat */}
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-7 h-7 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Conversación
            </h1>
          </div>

          {/* Zona de mensajes */}
          <div className="card bg-base-100 shadow-xl rounded-xl h-[60vh] md:h-[70vh] overflow-y-auto p-4 mb-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-lg text-primary">Cargando mensajes...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                <User className="w-12 h-12 mb-2" />
                <p className="text-lg">No hay mensajes aún.</p>
                <p className="text-sm">¡Envía el primer mensaje!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat ${msg.senderRole === 'PLAYER' ? 'chat-start' : 'chat-end'} mb-2`}
                >
                  <div className="chat-header flex items-center gap-2 mb-1">
                    {msg.senderRole === 'PLAYER' ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Users className="w-4 h-4 text-secondary" />
                    )}
                    <span className="font-semibold text-base">
                      {msg.senderRole === 'PLAYER' ? 'Jugador' : 'Equipo'}
                    </span>
                    <time className="text-xs opacity-50 ml-2">{formatDate(msg.timestamp)}</time>
                  </div>
                  <div
                    className={`chat-bubble ${
                      msg.senderRole === 'PLAYER'
                        ? 'bg-primary text-primary-content'
                        : 'bg-secondary text-secondary-content'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef}></div>
          </div>

          {/* Formulario para enviar mensaje */}
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu mensaje"
              className="input input-bordered input-primary w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!isAuthenticated}
              maxLength={500}
            />
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={!isAuthenticated || !content.trim()}
              title="Enviar"
            >
              <SendHorizonal className="w-5 h-5" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

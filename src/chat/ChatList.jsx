import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import { MessageSquare, Users, AlertCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('${API_URL}/api/chat', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChats(res.data);
      } catch (err) {
        console.error('Error al cargar los chats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchChats();
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 flex items-center">
          <div className="max-w-lg mx-auto w-full">
            <div className="alert alert-warning flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Debes iniciar sesión para ver tus chats.
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
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tus Chats
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="ml-3 text-lg text-primary">Cargando chats...</span>
            </div>
          ) : chats.length === 0 ? (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-medium mb-2">No tienes chats disponibles aún</h2>
                <p className="text-gray-500 mb-4">Tus conversaciones aparecerán aquí cuando recibas o envíes mensajes.</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {chats.map((chat) => (
                <li key={chat.applicationId}>
                  <Link
                    to={`/chat/${chat.applicationId}`}
                    className="block card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-300 hover:border-primary"
                  >
                    <div className="card-body py-4 px-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-base-content text-lg">
                          {chat.teamName} <span className="text-base-content/60">↔</span> {chat.playerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/80 mb-1">
                        <MessageSquare className="w-4 h-4" />
                        <span className="truncate">
                          Último mensaje: {chat.lastMessage || <span className="italic text-base-content/50">Sin mensajes</span>}
                        </span>
                      </div>
                      <div className="text-xs text-base-content/50">
                        {chat.lastTimestamp
                          ? new Date(chat.lastTimestamp).toLocaleString()
                          : "Sin actividad reciente"}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}

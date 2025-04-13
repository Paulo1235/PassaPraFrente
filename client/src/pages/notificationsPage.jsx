"use client";

import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Footer from "../components/footer";
import { NotificationList } from "../components/notificationCard";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notificationsData, setNotificationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/notifications/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar notificações");
        }

        const data = await response.json();
        console.log(data);
        setNotificationsData(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Não foi possível carregar as notificações. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/read/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao marcar notificação como lida");
      }

      if (notificationsData) {
        setNotificationsData({
          ...notificationsData,
          message: notificationsData.message.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-bgp overflow-hidden">
      <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Botão fixo no topo direito */}
        <button
          className="absolute top-4 right-4 sm:top-6 sm:right-10 flex items-center text-txts z-10"
          onClick={() => navigate("/account")}
        >
          <Undo2 />
          <span className="ml-1">Voltar</span>
        </button>

        {/* Cabeçalho */}
        <div className="p-6 sm:p-10 pb-0">
          <h1 className="text-2xl font-medium text-txtp">Notificações</h1>
          {!loading && notificationsData && (
            <p className="text-sm text-gray-500 mt-1">
              {notificationsData.message.filter((n) => !n.read).length} não lidas
            </p>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          <div className="w-full md:w-3/4 p-4 md:p-6 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <NotificationList
                notifications={notificationsData ? notificationsData.message : []}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}

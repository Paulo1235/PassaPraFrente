import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Footer from "../components/footer";
import { NotificationList } from "../components/notificationCard";
import { Helmet } from "react-helmet";
import NavbarAccount from "../components/navbarAccount"; // Importação adicionada

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notificationsData, setNotificationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("notifications"); // Estado para controlar a aba ativa

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/notifications/user",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar notificações");
        }

        const data = await response.json();
        console.log(data);
        setNotificationsData(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError(
          "Não foi possível carregar as notificações. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/read/${notificationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao marcar notificação como lida");
      }

      if (notificationsData) {
        setNotificationsData({
          ...notificationsData,
          message: notificationsData.message.map((notification) =>
            notification.Notificacao_ID === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-bgp overflow-hidden">
      <Helmet>
        <title>Notificações</title>
      </Helmet>
      <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* NavbarAccount adicionado aqui */}
        <NavbarAccount activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Cabeçalho */}
        <div className="p-6 sm:p-10 pb-0">
          <h1 className="text-2xl font-medium text-txtp">Notificações</h1>
          {!loading && notificationsData && (
            <p className="text-sm text-gray-500 mt-1">
              {notificationsData.message.filter((n) => !n.read).length} não
              lidas
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
                notifications={
                  notificationsData ? notificationsData.message : []
                }
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

export default NotificationsPage;
import React from "react";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Footer from "../components/footer";

export default function NotificationsPage() {
    const navigate = useNavigate();
  
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
          </div>
  
          {/* Conteúdo */}
          <div className="flex flex-col md:flex-row flex-1 overflow-auto">
            <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto">
              <p className="text-[#7b892f] font-semibold text-lg text-center">
                Sem Notificações
              </p>
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
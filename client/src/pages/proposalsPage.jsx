import React from "react";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import ProposalCard from "../components/proposalCard";

export default function ProposalsPage() {
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
          <h1 className="text-2xl font-medium text-txtp">Propostas</h1>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          {/* A Anunciar */}
          <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto">
            <h2 className="text-gray-400 font-semibold mb-4">A Anunciar</h2>
            <ProposalCard />
            <ProposalCard />
          </div>

          {/* Divisória visível só em desktop */}
          <div className="hidden md:block w-px bg-[#8b9a41]" />

          {/* A Querer */}
          <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto flex flex-col">
            <h2 className="text-gray-400 font-semibold mb-4">A Querer</h2>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[#7b892f] font-semibold text-lg text-center">
                Nao fez nenhuma proposta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

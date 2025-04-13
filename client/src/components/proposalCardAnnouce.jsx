import React, { useState } from "react";
import { Check, Trash } from 'lucide-react';

const ProposalCardAnnouncement = ({ item, onApprove, onReject }) => {
  // Sempre começa como pendente
  const [status, setStatus] = useState(0); 

  const formatDate = (dateString) => {
    if (!dateString) return "Data não disponível";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Aceite";
      case 2:
        return "Rejeitado";
      case 0:
      case undefined:
        return "Pendente";
      default:
        return "Pendente";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-red-100 text-red-800";
      case 0:
      case undefined:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleApprove = () => {
    setStatus(1);
    onApprove?.(item);
  };

  const handleReject = () => {
    setStatus(2);
    onReject?.(item);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-txtp">{item.title}</h3>
        <span className="bg-[#e8f0c9] text-[#7b892f] px-2 py-1 rounded text-xs">{item.category}</span>
      </div>

      {item.advertiser && <div className="mt-1 text-xs text-[#7b892f]">Anunciante: {item.advertiser}</div>}

      {item.description && <p className="text-gray-600 mt-2 text-sm line-clamp-2">{item.description}</p>}

      <div className="mt-3 flex justify-between items-center">
        {item.price !== undefined && <span className="font-medium text-txtp">€ {item.price}</span>}
        {item.date && <span className="text-xs text-gray-500">{formatDate(item.date)}</span>}
      </div>

      {item.duration && <div className="mt-2 text-xs text-gray-600">Duração: {item.duration}</div>}

      <div className="mt-2 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded ${getStatusClass(status)}`}>{getStatusText(status)}</span>

        {/* Botões sempre disponíveis, lado a lado */}
        <div className=" p-2 rounded-lg flex justify-end gap-4">
  <button
    onClick={handleApprove}
    className="flex items-center bg-[#f9f7e8] px-3 py-2 rounded-lg  text-[#7b892f] font-medium hover:text-[#5a6622]"
  >
    <Check className="h-5 w-5 mr-2" />
    Aceitar
  </button>

  <button
    onClick={handleReject}
    className="flex items-center bg-[#f9f7e8] px-3 py-2 rounded-lg  text-red-600 font-medium hover:text-red-700"
  >
    <Trash className="h-5 w-5 mr-2" />
    Eliminar
  </button>
</div>
      </div>

      <div className="mt-2 text-xs text-gray-500 space-y-1">
        {item.idVenda && item.idVenda !== "ID" && <div>ID Venda: {item.idVenda}</div>}
        {item.idEmprestimo && item.idEmprestimo !== "ID" && <div>ID Empréstimo: {item.idEmprestimo}</div>}
        {item.idSorteio && item.idSorteio !== "ID" && <div>ID Sorteio: {item.idSorteio}</div>}
      </div>
    </div>
  );
};

export default ProposalCardAnnouncement;

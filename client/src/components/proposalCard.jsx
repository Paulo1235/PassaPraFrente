import React from "react";

const ProposalCard = ({ item }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Data não disponível";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Convert status number to a readable string
  const getStatusText = (status) => {
    if (status === undefined) return "Pendente";

    switch (status) {
      case 0:
        return "Pendente";
      case 1:
        return "Aprovado";
      case 2:
        return "Rejeitado";
      default:
        return "Pendente";
    }
  };

  // Get status class based on status number
  const getStatusClass = (status) => {
    if (status === undefined) return "bg-yellow-100 text-yellow-800";

    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-txtp">{item.title}</h3>
        <span className="bg-[#e8f0c9] text-[#7b892f] px-2 py-1 rounded text-xs">{item.category}</span>
      </div>

      {item.description && <p className="text-gray-600 mt-2 text-sm line-clamp-2">{item.description}</p>}

      <div className="mt-3 flex justify-between items-center">
        {item.price !== undefined && (
          <span className="font-medium text-txtp">
            {"€ " + item.price}
          </span>
        )}

        {item.date && <span className="text-xs text-gray-500">{formatDate(item.date)}</span>}
      </div>

      {item.duration && (
        <div className="mt-2">
          <span className="text-xs text-gray-600">Duração: {item.duration}</span>
        </div>
      )}

      <div className="mt-2">
        <span className={`text-xs px-2 py-1 rounded ${getStatusClass(item.status)}`}>{getStatusText(item.status)}</span>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {item.idVenda && item.idVenda !== "ID" && <div>ID Venda: {item.idVenda}</div>}
        {item.idEmprestimo && item.idEmprestimo !== "ID" && <div>ID Empréstimo: {item.idEmprestimo}</div>}
        {item.idSorteio && item.idSorteio !== "ID" && <div>ID Sorteio: {item.idSorteio}</div>}
      </div>
    </div>
  );
};

export default ProposalCard;

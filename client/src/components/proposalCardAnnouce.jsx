import React, { useState } from "react";
import { Check, Trash } from 'lucide-react';

const ProposalCardAnnouncement = ({ item, proposerId, onApprove, onReject }) => {
  const [status, setStatus] = useState(item.status || 0);

  // Garante valores padrão para título e descrição
  const safeItem = {
    ...item,
    title: item?.title || item?.Titulo || "Sem título",
    description: item?.description || item?.Descricao || "Sem descrição",
    price: item?.price ?? item?.NovoValor ?? 0,
    category: item?.category || (item.idVenda ? "Vendas" : "Empréstimos")
  };

  const formatDate = (dateString) => 
    dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "Data não disponível";

  const statusConfig = {
    1: { text: "Pendente", class: "bg-yellow-100 text-yellow-800" },
    2: { text: "Aceite", class: "bg-green-100 text-green-800" },
    3: { text: "Rejeitado", class: "bg-red-100 text-red-800" },
    0: { text: "Pendente", class: "bg-yellow-100 text-yellow-800" }
  };

  const handleAction = async (action) => {
    try {
      const isSale = item.idVenda && item.idVenda !== "ID";
      const endpoint = isSale
        ? `http://localhost:5000/api/proposal-sales/${item.idVenda}/user/${proposerId}`
        : `http://localhost:5000/api/proposal-loans/${item.idEmprestimo}/user/${proposerId}`;
  
      // Determina o status baseado na ação
      const newStatus = action === 'approve' ? 2 : 3;
  
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...(isSale ? { idVenda: item.idVenda } : { idEmprestimo: item.idEmprestimo }),
          status: newStatus // Envia o status diretamente
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Falha ao ${action === 'approve' ? 'aprovar' : 'rejeitar'}`);
      }
  
      setStatus(newStatus);
      action === 'approve' ? onApprove?.(item) : onReject?.(item);
    } catch (error) {
      console.error(`Erro ao ${action === 'approve' ? 'aprovar' : 'rejeitar'}:`, error);
      // Você pode querer adicionar um feedback visual para o usuário aqui
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-txtp">{safeItem.title}</h3>
        <span className="bg-[#e8f0c9] text-[#7b892f] px-2 py-1 rounded text-xs">
          {safeItem.category}
        </span>
      </div>

      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{safeItem.description}</p>

      <div className="mt-3 flex justify-between items-center">
        <span className="font-medium text-txtp">€ {safeItem.price}</span>
        {safeItem.date && (
          <span className="text-xs text-gray-500">{formatDate(safeItem.date)}</span>
        )}
      </div>

      {safeItem.duration && (
        <div className="mt-2 text-xs text-gray-600">Duração: {safeItem.duration}</div>
      )}

      <div className="mt-2 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded ${statusConfig[status]?.class || statusConfig[0].class}`}>
          {statusConfig[status]?.text || statusConfig[0].text}
        </span>

        {(status === 0 || status === 1) && (
          <div className="p-2 rounded-lg flex justify-end gap-4">
            <button
              onClick={() => handleAction('approve')}
              className="flex items-center bg-[#f9f7e8] px-3 py-2 rounded-lg text-[#7b892f] font-medium hover:text-[#5a6622]"
            >
              <Check className="h-5 w-5 mr-2" />
              Aceitar
            </button>
            <button
              onClick={() => handleAction('reject')}
              className="flex items-center bg-[#f9f7e8] px-3 py-2 rounded-lg text-red-600 font-medium hover:text-red-700"
            >
              <Trash className="h-5 w-5 mr-2" />
              Rejeitar
            </button>
          </div>
        )}

        {(status === 2 || status === 3) && (
          <div className="text-xs text-gray-500">
            {status === 2 ? "Proposta aceita" : "Proposta rejeitada"}
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 space-y-1">
        {safeItem.idVenda && safeItem.idVenda !== "ID" && <div>ID Venda: {safeItem.idVenda}</div>}
        {safeItem.idEmprestimo && safeItem.idEmprestimo !== "ID" && <div>ID Empréstimo: {safeItem.idEmprestimo}</div>}
        {proposerId && <div>Proponente ID: {proposerId}</div>}
      </div>
    </div>
  );
};

export default ProposalCardAnnouncement;
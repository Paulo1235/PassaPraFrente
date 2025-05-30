import React, { useState } from "react";
import { Check, Trash, Loader2 } from 'lucide-react';

const ProposalCardAnnouncement = ({ item, proposerId, onApprove, onReject }) => {
  const [status, setStatus] = useState(() => Number(item.status));
  const [isProcessing, setIsProcessing] = useState(false);

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
    3: { text: "Rejeitado", class: "bg-red-100 text-red-800" }
  };

  const handleAction = async (action) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const isSale = item.idVenda && item.idVenda !== "ID";
      const endpoint = isSale
        ? `http://localhost:5000/api/proposal-sales/${item.idVenda}/user/${proposerId}`
        : `http://localhost:5000/api/proposal-loans/${item.idEmprestimo}/user/${proposerId}`;

      const newStatus = action === 'approve' ? 2 : 3;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...(isSale ? { idVenda: item.idVenda } : { idEmprestimo: item.idEmprestimo }),
          status: newStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Falha ao ${action === 'approve' ? 'aprovar' : 'rejeitar'}`);
      }

      setStatus(newStatus);
      
      if (action === 'approve') {
        onApprove?.({ ...item, status: newStatus });
      } else {
        onReject?.({ ...item, status: newStatus });
      }
    } catch (error) {
      console.error(`Erro ao ${action === 'approve' ? 'aprovar' : 'rejeitar'}:`, error);
      // Você pode adicionar um toast de erro aqui se desejar
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-txtp">{safeItem.title}</h3>
        <span className="bg-[#e8f0c9] text-[#7b892f] px-2 py-1 rounded text-xs">
          {safeItem.category}
        </span>
      </div>

      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{safeItem.description}</p>

      <div className="mt-3 flex justify-between items-center">
        <span className="font-medium text-txtp">€ {safeItem.price.toFixed(2)}</span>
        {safeItem.date && (
          <span className="text-xs text-gray-500">{formatDate(safeItem.date)}</span>
        )}
      </div>

      {safeItem.duration && (
        <div className="mt-2 text-xs text-gray-600">Duração: {safeItem.duration}</div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[status]?.class || statusConfig[1].class}`}>
          {statusConfig[status]?.text || statusConfig[1].text}
        </span>

        {status === 1 && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleAction('approve')}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isProcessing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">Aceitar</span>
            </button>
            
            <button
              onClick={() => handleAction('reject')}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isProcessing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">Rejeitar</span>
            </button>
          </div>
        )}

        {status === 2 && (
          <div className="text-sm text-green-600 flex items-center gap-1">
            <Check className="h-4 w-4" />
            Proposta aceita
          </div>
        )}
        
        {status === 3 && (
          <div className="text-sm text-red-600 flex items-center gap-1">
            <Trash className="h-4 w-4" />
            Proposta rejeitada
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalCardAnnouncement;
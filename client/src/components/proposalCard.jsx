import React from "react";
import { Trash2, Check } from "lucide-react";

function ProposalCard({ imageSrc, title, size, price, onDelete, onAccept }) {
  return (
    <div className="rounded-md p-4 flex gap-4 items-center bg-white mb-4">
      <img
        src={imageSrc}
        alt={title}
        className="w-20 h-20 object-cover rounded"
        onError={(e) => (e.target.src = "https://via.placeholder.com/80")} // Fallback se imagem falhar
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-black"> Titulo {title}</p>
        <p className="text-xs text-black mt-1">Tamanho {size}</p>
      </div>
      <div className="text-lg font-semibold text-black mr-4">{price} €</div>
      <div className="flex flex-col gap-2 items-end">
        <button
          className="text-red-600 flex items-center gap-1 text-sm font-medium"
          onClick={onDelete}
        >
          <Trash2 size={16} /> Eliminar
        </button>
        <button
          className="text-green-700 flex items-center gap-1 text-sm font-medium"
          onClick={onAccept}
        >
          <Check size={16} /> Aceitar
        </button>
      </div>
    </div>
  );
}

export default ProposalCard;

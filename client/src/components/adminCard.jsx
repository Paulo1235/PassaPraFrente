import React from "react";
import logoEmpresa from '../images/logoEmpresa.png';
import { ToastContainer, toast } from 'react-toastify';
import { Trash2, Check } from "lucide-react";

const AdminCard = (props) => {
  const accept = () => toast("Aceite!");
  const deny = () => toast("Recusado!");

  return (
    <div className="w-[300px] h-[120px] rounded-lg bg-white shadow-xl flex items-center p-3">
      <ToastContainer />
      <img 
        src={logoEmpresa} 
        alt="Logo da Empresa" 
        className="w-20 h-20 rounded-lg object-cover" 
      />

      <div className="flex flex-col flex-grow ml-3">
        <span className="text-black font-semibold">{props.name}</span>
        <span className="text-gray-600 text-sm">Tamanho {props.size}</span>
        
        <div className="flex flex-col mt-2 gap-2">
          <div className="flex items-center cursor-pointer" onClick={deny}>
            <Trash2 className="text-red-600 mr-1" />
            <button className="text-red-600 font-semibold">Eliminar</button>
          </div>
          <div className="flex items-center cursor-pointer" onClick={accept}>
            <Check className="text-green-600 mr-1" />
            <button className="text-green-600 font-semibold">Aprovar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;

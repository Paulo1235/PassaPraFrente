import React from "react";
import logoEmpresa from '../images/logoEmpresa.png';
import { ToastContainer, toast } from 'react-toastify';

const AdminCard = (props) => {
  const notify = () => toast("Card Aberto!");
  return (
    <div className="w-[300px] h-[120px] rounded-lg bg-[#ffffff] shadow-xl flex items-center p-3" onClick={notify}>
      <ToastContainer/>

      <img 
      src={logoEmpresa} 
      alt="" 
      className="w-20 h-20 rounded-lg object-cover" />

      <div className="flex flex-col flex-grow ml-3">
        <span className="text-black font-semibold">{props.name}</span>
        <span className="text-gray-600 text-sm">Tamanho {props.size}</span>
        <div className="flex mt-2">
          <button className="text-red-600 font-semibold mr-4">Eliminar</button>
          <button className="text-green-600 font-semibold">Aprovar</button>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
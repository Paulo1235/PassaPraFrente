import React from "react";
import logoEmpresa from '../images/logoEmpresa.png';

import { ToastContainer, toast } from 'react-toastify';

const AdminCard = (props) => {
  const notify = () => toast("Card Aberto!");
  return (
    <div className="w-[200px] h-[250px] rounded-lg bg-white shadow-lg cursor-pointer" onClick={notify}>
       <ToastContainer />
      <div className="bg-black mx-5 mt-3 rounded-lg">
        <img
          src={logoEmpresa}
          width="123px"
          height="118px"
          className="mx-auto"
          alt=""
        />
      </div>
      <div className="flex flex-col">
        <span className="mx-2 pt-3">{props.name}</span>
      </div>
      <div className="justify-center flex mt-3 items-center">
          <button className="flex items-center text-red-600 font-semibold mr-4">
            <button className="mr-1" /> Eliminar
          </button>
          <button className="flex items-center text-green-600 font-semibold">
            <button className="mr-1" /> Aprovar
          </button>
        </div>
    </div>
  );
};

export default AdminCard;
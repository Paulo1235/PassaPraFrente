import React from "react";
import logoEmpresa from '../images/logoEmpresa.png';
import { ToastContainer, toast } from 'react-toastify';
import { Trash2, Check } from "lucide-react";

const AdminCard = (props) => {
  const accept = async (id, values) => {
    toast("Aceite!");
 if (values.tipoAnuncio === "Emprestimo")
 {
    return( 

      await fetch(`http://localhost:5000/api/loans/update-status/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        status: "Disponível"
      }),
      credentials: "include",
    })
  )}
  if (values.tipoAnuncio === "Venda")
    {
       return( 
   
         await fetch(`http://localhost:5000/api/sales/update-status/${id}`, {
         method: "PATCH",
         headers: {
           "Content-Type": "application/json",
         },
         body:JSON.stringify({
           status: "Disponível"
         }),
         credentials: "include",
       })
     )}
     if (values.tipoAnuncio === "Sorteio")
      {
         return( 
     
           await fetch(`http://localhost:5000/api/sales/update-status/${id}`, {
           method: "PATCH",
           headers: {
             "Content-Type": "application/json",
           },
           body:JSON.stringify({
             status: "Disponível"
           }),
           credentials: "include",
         })
       )}
};
    
    
const deny = async (id, values) => {
  toast("Recusado!");
  console.log("DENY CALLED", { id, values });
if (values.tipoAnuncio === "Emprestimo")
{
  return( 

    await fetch(`http://localhost:5000/api/loans/update-status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      loanId: values.loanId,
      status: "Rejeitado"
    }),
    credentials: "include",
  })
)}
if (values.tipoAnuncio === "Venda")
  {
     return( 
 
       await fetch(`http://localhost:5000/api/sales/update-status/${id}`, {
       method: "PATCH",
       headers: {
         "Content-Type": "application/json",
       },
       body:JSON.stringify({
         status: "Rejeitado"
       }),
       credentials: "include",
     })
   )}
   if (values.tipoAnuncio === "Sorteio")
    {
       return( 
   
         await fetch(`http://localhost:5000/api/sales/update-status/${id}`, {
         method: "PATCH",
         headers: {
           "Content-Type": "application/json",
         },
         body:JSON.stringify({
           status: "Rejeitado"
         }),
         credentials: "include",
       })
     )}
};

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
        
        <div className="flex flex-col mt-2 gap-2">
          <div className="flex items-center cursor-pointer" onClick={() => deny(props.idVenda || props.idEmprestimo || props.idSorteio, props)}>
            <Trash2 className="text-red-600 mr-1" />
            <button className="text-red-600 font-semibold">Eliminar</button>
          </div>
          <div className="flex items-center cursor-pointer" onClick={() => 
          accept(
              props.idEmprestimo || props.idVenda || props.idSorteio,
              {
                tipoAnuncio: props.tipoAnuncio,
                loanId: props.idEmprestimo,
                saleId: props.idVenda,
                givewayId: props.idSorteio
              }
            )
          }>
            <Check className="text-green-600 mr-1" />
            <button className="text-green-600 font-semibold">Aprovar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;

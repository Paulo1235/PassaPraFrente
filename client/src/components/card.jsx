import React, { use, useEffect } from "react";
import logoEmpresa from '../images/logoEmpresa.png';
import { useNavigate } from "react-router-dom";

const Card = (props) => {
  const navigate = useNavigate();

  const handleCardClick = () => {

    console.log(props)

    if(props.mainPage == true)
    {
      if (props.category === "Vendas") {
        navigate(`/sale/${props.idVenda}`);
        } else if (props.category === "Emprestimos") {
          navigate(`/loan/${props.idEmprestimo}`);
        } else if (props.category === "Sorteios") {
          navigate(`/draw/${props.idSorteio}`);
        }
    
        console.log("IDs recebidos:", {
          idVenda: props.idVenda,
          idEmprestimo: props.idEmprestimo,
          idSorteio: props.idSorteio,
          category: props.category,
        });
    }
    else
    {
      if (props.category === "Vendas") {
        navigate(`/editsale/${props.idVenda}`);
        } else if (props.category === "Emprestimos") {
          navigate(`/editloan/${props.idEmprestimo}`);
        } else if (props.category === "Sorteios") {
          navigate(`/editdraw/${props.idSorteio}`);
        }
    
        console.log("IDs (BPMN) recebidos:", {
          idVenda: props.idVenda,
          idEmprestimo: props.idEmprestimo,
          idSorteio: props.idSorteio,
          category: props.category,
        });
    }
  };

  return (
    <div
      className="w-[200px] h-[250px] rounded-lg bg-white shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
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
        <span className="mx-2 pt-1 truncate">{props.name}</span>
        <span className="mx-2 pt-1 truncate">Tamanho: {props.size}</span>
        <span className="mx-2 pt-5">{props.value}€</span>
      </div>
    </div>
  );
};

export default Card;

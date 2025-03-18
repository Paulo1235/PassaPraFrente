import React from "react";
import logoEmpresa from '../images/logoEmpresa.png';
import { useNavigate } from "react-router-dom";

const Card = (props) => {

  const navigate = useNavigate();

  const handleCardClick = () => {
    if (props.category === "Vendas") {
      navigate("/sale");
    } else if (props.category === "Emprestimos") {
      navigate("/loan");
    } else if (props.category === "Sorteios") {
      navigate("/draw");
    }
  };
  return (
    <div className="w-[200px] h-[250px] rounded-lg bg-white shadow-lg cursor-pointer" onClick={handleCardClick}>
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
        <span className="mx-2 pt-1">{props.name}</span>
        <span className="mx-2 pt-1">Tamanho: {props.size}</span>
        <span className="mx-2 pt-5">{props.value}€</span>
      </div>
    </div>
  );
};

export default Card;
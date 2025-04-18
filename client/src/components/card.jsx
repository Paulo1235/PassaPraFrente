import React, { use, useEffect } from "react";
import pessoaIco from "../images/pessoaIco.svg";
import { useNavigate } from "react-router-dom";

const Card = (props) => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("Props:", props);
  // }, [props]);

  const handleCardClick = () => {
    if (props.mainPage == true) {
      if (props.category === "Vendas" && props.Estado !== "Concluído") {
        navigate(`/sale/${props.idVenda}`);
      } else if (props.category === "Emprestimos") {
        navigate(`/loan/${props.idEmprestimo}`);
      } else if (props.category === "Sorteios") {
        navigate(`/draw/${props.idSorteio}`);
      }
    } else if (props.isCompleted == true) {
    } else {
      if (props.category === "Vendas") {
        navigate(`/editsale/${props.idVenda}`);
      } else if (props.category === "Emprestimos") {
        navigate(`/editloan/${props.idEmprestimo}`);
      } else if (props.category === "Sorteios") {
        navigate(`/editdraw/${props.idSorteio}`);
      }
    }
  };

  return (
    <div
      className="w-[200px] h-[290px] rounded-lg bg-white shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="bg-black mx-5 mt-3 rounded-lg">
        <img
          src={props.image?.Url ? props.image.Url : pessoaIco}
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

import { useState } from "react";
import pessoaIco from "../images/pessoaIco.svg";
import { useNavigate } from "react-router-dom";

const Card = (props) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (props.mainPage == true) {
      if (props.category === "Compras" && props.Estado !== "Concluído") {
        navigate(`/sale/${props.idVenda}`);
      } else if (props.category === "Empréstimos") {
        navigate(`/loan/${props.idEmprestimo}`);
      } else if (props.category === "Sorteios") {
        navigate(`/draw/${props.idSorteio}`);
      }
    } else if (props.isCompleted == true) {
      //? Isto serve para quando o utilizador clica no cartão de um item que já foi concluído, nao podendo editar
    } else {
      if (props.category === "Compras") {
        navigate(`/editsale/${props.idVenda}`);
      } else if (props.category === "Empréstimos") {
        navigate(`/editloan/${props.idEmprestimo}`);
      } else if (props.category === "Sorteios") {
        navigate(`/editdraw/${props.idSorteio}`);
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="w-[220px] overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-[180px] overflow-hidden">
        <img
          src={props.image?.Url && !imageError ? props.image.Url : pessoaIco}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          alt={props.name || "Item image"}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-base mb-1 truncate">{props.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 overflow-hidden">
          {props.condition ? `Condição: ${props.condition}` : "Sem condição"}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{props.value}€</span>
        </div>
      </div>
    </div>
  );
};

export default Card;

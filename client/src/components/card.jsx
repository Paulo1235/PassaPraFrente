import { useState } from "react";
import { useNavigate } from "react-router-dom";
import pessoaIco from "../images/pessoaIco.svg";

const Card = ({
  mainPage,
  idVenda,
  idEmprestimo,
  idSorteio,
  Estado,
  isCompleted,
  category,
  image,
  name,
  condition,
  value,
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (mainPage) {
      if (idVenda !== null && Estado !== "Concluído") {
        navigate(`/sale/${idVenda}`);
      } else if (idEmprestimo !== null) {
        navigate(`/loan/${idEmprestimo}`);
      } else if (idSorteio !== null) {
        navigate(`/draw/${idSorteio}`);
      }
    } else if (!isCompleted) {
      if (category === "Compras") {
        navigate(`/editsale/${idVenda}`);
      } else if (category === "Empréstimos") {
        navigate(`/editloan/${idEmprestimo}`);
      } else if (category === "Sorteios") {
        navigate(`/editdraw/${idSorteio}`);
      }
    }
  };

  const handleImageError = () => setImageError(true);

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-300 w-full"
    >
      {/* Container da imagem com tamanho fixo e overflow escondido */}
      <div className="w-full h-48 bg-gray-50 overflow-hidden flex items-center justify-center">
        <img
          src={image?.Url && !imageError ? image.Url : pessoaIco}
          alt={name || "Imagem do item"}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ minWidth: '100%', minHeight: '100%' }}
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-sm text-gray-500">{condition || "Sem condição"}</p>
        <p className="mt-1 text-sm font-bold text-gray-900">{value}€</p>
      </div>
    </div>
  );
};

export default Card;
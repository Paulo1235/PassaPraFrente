"use client"

import { useState } from "react"
import pessoaIco from "../images/pessoaIco.svg"
import { useNavigate } from "react-router-dom"

const Card = (props) => {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)

  const handleCardClick = () => {
    if (props.mainPage === true) {
      if (props.idVenda !== null && props.Estado !== "Concluído") {
        navigate(`/sale/${props.idVenda}`)
      } else if (props.idEmprestimo !== null) {
        navigate(`/loan/${props.idEmprestimo}`)
      } else if (props.idSorteio !== null) {
        navigate(`/draw/${props.idSorteio}`)
      }
    } else if (props.isCompleted === true) {
      //? Isto serve para quando o utilizador clica no cartão de um item que já foi concluído, nao podendo editar
    } else {
      if (props.category === "Compras") {
        navigate(`/editsale/${props.idVenda}`)
      } else if (props.category === "Empréstimos") {
        navigate(`/editloan/${props.idEmprestimo}`)
      } else if (props.category === "Sorteios") {
        navigate(`/editdraw/${props.idSorteio}`)
      }
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="group relative cursor-pointer" onClick={handleCardClick}>
      <div className="h-64 w-full overflow-hidden rounded-md">
        <img
          src={props.image?.Url && !imageError ? props.image.Url : pessoaIco}
          className="h-full w-full object-cover group-hover:opacity-75 transition-opacity duration-300"
          alt={props.name || "Item image"}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <span aria-hidden="true" className="absolute inset-0"></span>
            {props.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{props.condition ? props.condition : "Sem condição"}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{props.value}€</p>
      </div>
    </div>
  )
}

export default Card

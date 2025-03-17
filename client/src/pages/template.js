//? Pagina apenas para servir como modelo para colocar a sidebar+conteudo
import React from 'react'
import { Helmet } from 'react-helmet'

import '../components/css/sidebar.css'
import '../index.css'
//? Components
import SideBar from '../components/sideBar'
import Card from '../components/card'

const Teste = () => {
  return (
    <div className='flex flex-row'>
      <Helmet>
        <title>Template</title>
      </Helmet>
      <SideBar />
      <div className='App sm:ml-48 w-screen flex flex-col'>
        <div className="mt-5 flex flex-col w-full">
          <p className="text-[#73802A] text-3xl ml-10 mb-5">Vendas:</p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center">
            <Card name="Camisola dourada" size="S" value="10,50" />
            <Card name="Camisola vermelha" size="M" value="15,00" />
            <Card name="Camisola azul" size="XL" value="17,40" />
            <Card name="Camisola rosa" size="XXL" value="20,00" />
            <Card name="Camisola amarela" size="3XL" value="25,00" />
          </div>
        </div>
        <div className="mt-10 flex flex-col w-full">
          <p className="text-[#73802A] text-3xl ml-10 mb-5">Emprestimos:</p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center">
            <Card name="Camisola dourada" size="S" value="10,50" />
            <Card name="Camisola vermelha" size="M" value="15,00" />
            <Card name="Camisola azul" size="XL" value="17,40" />
            <Card name="Camisola rosa" size="XXL" value="20,00" />
            <Card name="Camisola amarela" size="3XL" value="25,00" />
          </div>
        </div>
        <div className="mt-10 flex flex-col w-full">
          <p className="text-[#73802A] text-3xl ml-10 mb-5">Sorteios:</p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center">
            <Card name="Camisola dourada" size="S" value="10,50" />
            <Card name="Camisola vermelha" size="M" value="15,00" />
            <Card name="Camisola azul" size="XL" value="17,40" />
            <Card name="Camisola rosa" size="XXL" value="20,00" />
            <Card name="Camisola amarela" size="3XL" value="25,00" />
          </div>
        </div>
        <div className="mt-10 flex flex-col w-full">
          <p className="text-[#73802A] text-3xl ml-10 mb-5">Sorteios:</p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center">
            <Card name="Camisola dourada" size="S" value="10,50" />
            <Card name="Camisola vermelha" size="M" value="15,00" />
            <Card name="Camisola azul" size="XL" value="17,40" />
            <Card name="Camisola rosa" size="XXL" value="20,00" />
            <Card name="Camisola amarela" size="3XL" value="25,00" />
          </div>
        </div>
        <div className="mt-10 flex flex-col w-full">
          <p className="text-[#73802A] text-3xl ml-10 mb-5">Sorteios:</p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center">
            <Card name="Camisola dourada" size="S" value="10,50" />
            <Card name="Camisola vermelha" size="M" value="15,00" />
            <Card name="Camisola azul" size="XL" value="17,40" />
            <Card name="Camisola rosa" size="XXL" value="20,00" />
            <Card name="Camisola amarela" size="3XL" value="25,00" />
          </div>
        </div>
        <div className="mt-10 flex flex-col w-full">
          <p className="text-[#73802A] text-3xl ml-10 mb-5">Sorteios:</p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center">
            <Card name="Camisola dourada" size="S" value="10,50" />
            <Card name="Camisola vermelha" size="M" value="15,00" />
            <Card name="Camisola azul" size="XL" value="17,40" />
            <Card name="Camisola rosa" size="XXL" value="20,00" />
            <Card name="Camisola amarela" size="3XL" value="25,00" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Teste
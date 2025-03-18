import React from 'react'
import { Helmet } from 'react-helmet'
import { Undo2 } from 'lucide-react'

//? Components
import SideBar from '../components/sideBar'
import Footer from '../components/footer'

//? Logo
import logo from '../images/logoEmpresa.png'

//? CSS
import '../components/css/sidebar.css'
import '../index.css'

function CreateDraw() {

    return (
        <div className='flex flex-row'>
            <Helmet>
                <title>Criar Sorteio</title>
            </Helmet>
            <SideBar />
            <div className='App w-screen flex flex-col'>
                <div className="modal-sale w-[1500px] h-[800px] bg-[#FFFAEE] mx-auto my-20 rounded-xl flex flex-col">
                    <div className="button-back flex flex-col items-end mr-10 mt-5">
                        <a href="/index">
                            <button className='flex flex-row gap-2'>
                                <Undo2 />
                                <span>Voltar</span>
                            </button>
                        </a>
                    </div>
                    <div className="images flex flex-row gap-20 mx-auto">
                        <img
                            src={logo}
                            width="300px"
                            height="300px"
                            className=""
                            alt=""
                        />
                        <img
                            src={logo}
                            width="300px"
                            height="300px"
                            className=""
                            alt=""
                        />
                    </div>
                    <section className='flex flex-row mt-20 gap-10'>
                        <div className="left flex flex-col ml-48">
                            <p className='text-3xl text '>Titulo: <span className='text-lg text-black'>Camisola Quentinha Tigresa - XS</span></p>
                            <div className='flex flex-col'>
                                <p className='text-3xl text '>Descricao:</p>
                                <span className='text-lg text-black'>Quentinha, usada poucas vezesTamanho XS Cor castanho</span>
                            </div>
                            <div className='flex flex-row mt-10 gap-48'>
                                <div className='flex flex-col'>
                                    <p className='text-3xl text '>Valor:</p>
                                    <span className='text-lg text-black'>10.50$</span>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-3xl text '>Condicao:</p>
                                    <span className='text-lg text-black'>Como novo</span>
                                </div>
                            </div>
                        </div>
                        <div className="middle">
                            <div className='flex flex-col'>
                                <p className='text-3xl text '>Data Inicio:</p>
                                <span className='text-lg text-black'>28-03-2025 12h:30 mim</span>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-3xl text '>Data Fim:</p>
                                <span className='text-lg text-black'>28-03-2025 12h:30 mim</span>
                            </div>
                        </div>
                        <div className="right flex flex-col gap-10 ml-20">
                            <button className="bg-[#CAAD7E] rounded-lg px-4 py-2 flex items-center space-x-2">
                                <span className="text-xl text-white">Entrar Sorteio</span>
                            </button>
                            <button className="bg-[#CAAD7E] rounded-lg px-4 py-2 flex items-center space-x-2">
                                <span className="text-xl text-white">+351 930 213 123</span>
                            </button>
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default CreateDraw
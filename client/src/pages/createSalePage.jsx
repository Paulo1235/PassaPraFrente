import React from 'react'
import { Helmet } from 'react-helmet'

//? Components
import SideBar from '../components/sideBar'

//? Logo
import logo from '../images/logoEmpresa.png'

//? CSS
import '../components/css/sidebar.css'
import '../index.css'

function CreateSale() {
    return (
        <div className='flex flex-row'>
            <Helmet>
                <title>Criar Venda</title>
            </Helmet>
            <SideBar />
            <div className='App sm:ml-48 w-screen h-screen flex'>
                <div className="modal-sale w-[1500px] h-[800px] bg-[#FFFAEE] mx-auto my-auto rounded-xl flex flex-col">
                    <div className="button-back flex flex-col items-end mr-10 mt-5">
                        <button className=''>Voltar</button>
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
                    <section>
                        <div className="left flex flex-col ml-48 debug">
                            <p className='text-3xl text '>Titulo:</p>
                            <p className='text-3xl text '>Descricao:</p>
                            <p className='text-3xl text '>Valor:</p>
                            <p className='text-3xl text '>Condicao:</p>
                        </div>
                        <div className="right"></div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CreateSale
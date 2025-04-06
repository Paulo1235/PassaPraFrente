import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Undo2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//? Components
import SideBar from '../../components/sideBar';
import Footer from '../../components/footer';

//? Logo
import logo from '../../images/logoEmpresa.png';

//? CSS
import '../../components/css/sidebar.css';
import '../../index.css';

function CreateDraw() {
  const { id, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("User State in Main:", id, isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, dispatch, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-row h-screen overflow-y-auto">
      <Helmet>
        <title>Criar Sorteio</title>
      </Helmet>
      <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />
      <div className="App w-full flex flex-col">
        <div className="modal-sale w-[90%] max-w-[1200px] bg-[#FFFAEE] mx-auto my-10 rounded-xl flex flex-col p-6">
          <div className="button-back flex justify-end mb-4">
            <a href="/index">
              <button className="text-txts flex flex-row gap-2 items-center">
                <Undo2 />
                <span>Voltar</span>
              </button>
            </a>
          </div>
          <div className="images flex flex-wrap justify-center gap-10 mb-10">
            <img
              src={logo}
              className="w-[200px] h-[200px] object-contain"
              alt="Logo"
            />
            <img
              src={logo}
              className="w-[200px] h-[200px] object-contain"
              alt="Logo"
            />
          </div>
          <section className="flex flex-wrap justify-between">
            <div className="left flex flex-col w-full md:w-1/2 mb-6">
              <p className="text-2xl mb-2">
                Titulo:{" "}
                <span className="text-lg text-black">
                  Camisola Quentinha Tigresa - XS
                </span>
              </p>
              <div className="flex flex-col mb-4">
                <p className="text-2xl">Descricao:</p>
                <span className="text-lg text-black">
                  Quentinha, usada poucas vezes Tamanho XS Cor castanho
                </span>
              </div>
              <div className="flex flex-wrap gap-10 mb-4">
                <div className="flex flex-col">
                  <p className="text-2xl">Valor:</p>
                  <span className="text-lg text-black">10.50$</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl">Condicao:</p>
                  <span className="text-lg text-black">Como novo</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-10">
                <div className="flex flex-col">
                  <p className="text-2xl">Data Início:</p>
                  <span className="text-lg text-black">28-03-2025 12h:30</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl">Data Fim:</p>
                  <span className="text-lg text-black">29-03-2025 12h:30</span>
                </div>
              </div>
            </div>
            <div className="right flex flex-col gap-4 w-full md:w-1/3">
              <button className="bg-[#CAAD7E] rounded-lg px-4 py-2 flex items-center justify-center">
                <span className="text-xl text-white">Entrar no Sorteio</span>
              </button>
              <button className="border border-txtp rounded-lg px-4 py-2 flex items-center justify-center">
                <span className="text-xl text-txtp">+351 930 213 123</span>
              </button>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default CreateDraw;

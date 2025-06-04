import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Undo2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { formatDate } from "../../lib/utils";

//? Components
import SideBar from "../../components/sideBar";
import Footer from "../../components/footer";

//? CSS
import "../../components/css/sidebar.css";
import "../../index.css";

function LookDraw(props) {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("User State in Main:", id, isAuthenticated);

  useEffect(() => {
    // console.log("ID do sorteio:", id);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/giveaways/id/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();

        setData(data.message);

        const dateStart = new Date(data.message.DataInicio);
        const dateEnd = new Date(data.message.DataFim);

        //? Formata a data
        data.message.DataInicio = formatDate(dateStart);
        data.message.DataFim = formatDate(dateEnd);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, dispatch, navigate, id]);

  if (!isAuthenticated) return null;

  const enterGiveaway = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/entry-giveaway/create/${data.Sorteio_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();
      // console.log(result.message);
      if (result.message == "Inscrição criada com sucesso.")
        toast.success("Entrou no sorteio com sucesso!");
      else toast.error(result.message);
    } catch (error) {
      console.error("Error entering giveaway:", error);
    }
  };

  return (
    <div className="flex flex-row h-screen overflow-y-auto">
      <Helmet>
        <title>Sorteio</title>
      </Helmet>
      <ToastContainer />
      <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />
      <div className="w-full flex flex-col bg-bgp">
        <div className="w-[90%] max-w-[1200px] bg-[#FFFAEE] mx-auto my-10 rounded-xl flex flex-col p-6">
          <div className="button-back flex justify-end mb-4">
            <button
              className="text-txts flex flex-row gap-2 items-center"
              onClick={() => navigate("/index")}
            >
              <Undo2 />
              <span>Voltar</span>
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-10 mb-10">
            {data.photos &&
              data.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.Url}
                  className="w-[300px] h-[300px] object-contain"
                  alt={`Foto ${index + 1}`}
                />
              ))}
          </div>
          <section className="flex flex-wrap justify-between">
            <div className="flex flex-col w-full md:w-1/2 mb-6">
              <p className="text-2xl mb-2">
                Titulo:{" "}
                <span className="text-lg text-black">{data.Titulo}</span>
              </p>
              <div className="flex flex-col mb-4">
                <p className="text-2xl">Descrição:</p>
                <span className="text-lg text-black">{data.Descricao}</span>
              </div>
              <div className="flex flex-wrap gap-10 mb-4">
                <div className="flex flex-col">
                  <p className="text-2xl">Condição:</p>
                  <span className="text-lg text-black">{data.Condicao}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-10">
                <div className="flex flex-col">
                  <p className="text-2xl">Data Início:</p>
                  <span className="text-lg text-black">{data.DataInicio}</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl">Data Fim:</p>
                  <span className="text-lg text-black">{data.DataFim}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              <button className="bg-[#CAAD7E] rounded-lg px-4 py-2 flex items-center justify-center">
                <span className="text-xl text-white" onClick={enterGiveaway}>
                  Entrar no Sorteio
                </span>
              </button>
              <button className="border border-txtp rounded-lg px-4 py-2 flex items-center justify-center cursor-default">
                <span className="text-xl text-txtp">{data.Contacto}</span>
              </button>
              <button className="border border-txtp rounded-lg px-4 py-2 flex items-center justify-center cursor-default">
                <span className="text-xl text-txtp">{data.Nome}</span>
              </button>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default LookDraw;

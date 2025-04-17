import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-bgp">
      <Helmet>
        <title>PassaPraFrente</title>
      </Helmet>
      <TriangleAlert width={300} height={300} />
      <p className="text-3xl">Pagina nao encontrada!</p>
      <button className="text-2xl mt-5 bg-btnp rounded text-white px-5 py-2" onClick={() => navigate("/index")}>
        Voltar ao inicio
      </button>
    </div>
  );
};

export default NotFound;

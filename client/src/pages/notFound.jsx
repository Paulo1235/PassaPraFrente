import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import "../components/css/sidebar.css";
import "../index.css";

const NotFound = () => {
  const [url, setURL] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setURL("https://http.cat/404");
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-bgp">
      <Helmet>
        <title>PassaPraFrente</title>
      </Helmet>
      {url && <img src={url} className="shadow-xl" alt="Error 404" />}
      <button className="text-4xl mt-5" onClick={() => navigate("/index")}>
        Voltar
      </button>
    </div>
  );
};

export default NotFound;

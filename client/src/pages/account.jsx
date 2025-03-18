import React from "react";
import { Helmet } from "react-helmet";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Card from "../components/card";

import AccLogo from "../images/conta-logo.png";
import Star1 from "../images/star1.svg";
import Star2 from "../images/star2.svg";

import EditIco from "../images/edit-account.svg";
import ProposalsIco from "../images/proposals.svg";
import LogoutIco from "../images/logout.svg";

const Account = () => {
  return (
    <div className="flex flex-row">
      <Helmet>
        <title>Conta</title>
      </Helmet>
      <SideBar />
      <div className="App sm:ml-48 w-screen h-screen flex flex-col">
        <div className="left ml-20 mt-10 flex flex-col">
          <p className="text-3xl text-[#73802A]">Conta</p>
          <div className="flex items-center">
            <div className="account mt-10 flex flex-row">
              <img
                src={AccLogo}
                height={182}
                width={182}
                className="rounded-full"
                alt="account-logo"
              />
              <div className="info ml-10 flex flex-col justify-center">
                <p className="text-3xl text-[#73802A]">Paulao Teixeirao</p>
                <p className="ml-5">paulaoteixeirao@gmail.com</p>
              </div>
              <div className="rating ml-60 flex flex-row items-center gap-2">
                <img src={Star1} height={29} width={29} alt="" />
                <img src={Star1} height={29} width={29} alt="" />
                <img src={Star1} height={29} width={29} alt="" />
                <img src={Star2} height={29} width={29} alt="" />
                <img src={Star2} height={29} width={29} alt="" />
                <span>X avaliações</span>
              </div>
              <div className="icons ml-20 flex flex-col gap-3 justify-center">
                <div className="edit flex flex-row items-center cursor-pointer">
                  <img src={EditIco} width={35} height={35} alt="" />
                  <span className="ml-2">Editar</span>
                </div>
                <div className="proposals flex flex-row items-center cursor-pointer">
                  <img src={ProposalsIco} width={35} height={35} alt="" />
                  <span className="ml-2">Propostas</span>
                </div>
                <div className="logout flex flex-row items-center cursor-pointer">
                  <img src={LogoutIco} width={35} height={35} alt="" />
                  <span className="ml-2">Sair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content h-screen ml-2 pl-20 mt-20 text-[#73802A]">
          <p>O que tem para o vizinho:</p>
          <div className="items mt-5 flex flex-row gap-10">
            <Card name="Camisola dourada" size="S" value="10,50" />
            <Card name="Camisola vermelha" size="M" value="15,00" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

// Main.jsx
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Shop from "../components/shop";
import { useState } from "react";

const Main = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [shopData, setShopData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const responseSales = await fetch("http://localhost:5000/api/sales/available", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
    
        const responseLoans = await fetch("http://localhost:5000/api/loans/available", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
    
        const responseGiveaways = await fetch("http://localhost:5000/api/giveaways/available", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
    
        if (!responseSales.ok || !responseGiveaways.ok || !responseLoans.ok) {
          throw new Error("Failed to fetch shop data");
        }
    
        const dataSales = await responseSales.json();
        const dataLoans = await responseLoans.json();
        const dataGiveaways = await responseGiveaways.json();
        console.log(dataGiveaways)
        const transformItems = (items, category) => {
          return items.message.map((item) => ({
            name: item.Titulo || item.title || "Sem título",
            size: item.Descricao || item.description || "Sem descrição",
            value: item.Valor || item.Valor || "N/A",
            idVenda: item.Venda_ID || "ID",
            idEmprestimo: item.Emprestimo_ID || "ID",
            idSorteio: item.Sorteio_ID || "ID",
            category,
          }));
        };

        const shopData = {
          sales: {
            title: "Vendas",
            items: transformItems(dataSales, "Vendas"),
          },
          loans: {
            title: "Emprestimos",
            items: transformItems(dataLoans, "Emprestimos"),
          },
          giveaways: {
            title: "Sorteios",
            items: transformItems(dataGiveaways, "Sorteios"),
          },
        };
        console.log(shopData)
        setShopData(shopData);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };
    

    fetchShopData();

    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, dispatch, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col md:flex-row">
      <Helmet>
        <title>Loja</title>
      </Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />
      </div>
      <Shop shopData={shopData} />
    </div>
  );
};

export default Main;

import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { data, useNavigate } from "react-router-dom";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Shop from "../components/shop";

const Main = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [shopData, setShopData] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const responseSales = await fetch(
          "http://localhost:5000/api/sales/available",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseLoans = await fetch(
          "http://localhost:5000/api/loans/available",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseGiveaways = await fetch(
          "http://localhost:5000/api/giveaways/available",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!responseSales.ok || !responseGiveaways.ok || !responseLoans.ok) {
          throw new Error("Failed to fetch shop data");
        }

        const dataSales = await responseSales.json();
        const dataLoans = await responseLoans.json();
        const dataGiveaways = await responseGiveaways.json();

        console.log(dataGiveaways);

        const transformItems = (items, category) => {
          return items.message.map((item) => ({
            name: item.Titulo || item.title || "Sem título",
            description: item.Descricao || item.description || "Sem descrição",
            condition: item.Condicao || item.condition || "Sem condição",
            value: item.Valor || item.Valor || 0,
            idVenda: item.Venda_ID || "ID",
            idEmprestimo: item.Emprestimo_ID || "ID",
            idSorteio: item.Sorteio_ID || "ID",
            foto: item.photos || "",
            category,
          }));
        };

        const shopData = {
          sales: {
            title: "Compras",
            items: transformItems(dataSales, "Compras"),
          },
          loans: {
            title: "Empréstimos",
            items: transformItems(dataLoans, "Empréstimos"),
          },
          giveaways: {
            title: "Sorteios",
            items: transformItems(dataGiveaways, "Sorteios"),
          },
        };
        setShopData(shopData);
        console.log(shopData);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();

    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, dispatch, navigate]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex bg-bgp h-screen justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
      </div>
    );
  }

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

import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Footer from "../components/footer";
import ContentAdmin from "../components/contentAdmin";

const AdminMain = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [adminData, setAdminData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const responseSales = await fetch(
          "http://localhost:5000/api/sales/pending",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseLoans = await fetch(
          "http://localhost:5000/api/loans/pending",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseGiveaways = await fetch(
          "http://localhost:5000/api/giveaways/pending",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!responseSales.ok || !responseLoans.ok || !responseGiveaways.ok) {
          throw new Error("Erro ao buscar dados da loja");
        }

        const dataSales = await responseSales.json();
        const dataLoans = await responseLoans.json();
        const dataGiveaways = await responseGiveaways.json();

        const transformItems = (items, category) => {
          return items.message.map((item) => ({
            name: item.Titulo || item.title || "Sem título",
            size: item.Descricao || item.description || "Sem descrição",
            value: item.Valor || "N/A",
            idVenda: item.Venda_ID || null,
            idEmprestimo: item.Emprestimo_ID || null,
            idSorteio: item.Sorteio_ID || null,
            image: item.photos || null,
            category,
          }));
        };

        const formattedData = [
          {
            title: "Venda",
            items: transformItems(dataSales, "Venda"),
          },
          {
            title: "Empréstimo",
            items: transformItems(dataLoans, "Emprestimo"),
          },
          {
            title: "Sorteio",
            items: transformItems(dataGiveaways, "Sorteio"),
          },
        ];

        //! as fotos dos sorteios ta sempre null ou undefined
        setAdminData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar dados do backend:", error);
      }
    };

    fetchAdminData();

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar canAdd={false} Home={true} Account={true} LogOut={true} />
      </div>
      <div className="bg-bgp w-full overflow-x-auto flex flex-col">
        <h1 className="text-center mt-16 md:mt-10 text-4xl text-txtp">Pedidos de anuncios</h1>
        <div className="flex flex-col md:flex-row px-4 md:px-6 flex-grow text-center md:text-start">
          <ContentAdmin data={adminData} />
        </div>
        <Footer className="w-full mt-16" />
      </div>
    </div>
  );
};

export default AdminMain;

// AdminMain.jsx
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import AdminCard from "../components/adminCard";
import Footer from "../components/footer";

const AdminMain = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [shopData, setShopData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const responseSales = await fetch("http://localhost:5000/api/sales/pending", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const responseLoans = await fetch("http://localhost:5000/api/loans/pending", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const responseGiveaways = await fetch("http://localhost:5000/api/giveaways/pending", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

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
        
        console.log(formattedData)
        setShopData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar dados do backend:", error);
      }
    };
    
    fetchShopData();

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Helmet>
        <title>Loja</title>
      </Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar canAdd={false} Home={true} Account={true} LogOut={true} />
      </div>
      <div className="App w-full overflow-x-auto flex flex-col">
        <div className="flex flex-col md:flex-row px-4 md:px-6 flex-grow">
          {shopData.map((section, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className="flex flex-col w-full md:w-1/3 px-2">
              <p className="text-[#73802A] text-2xl md:text-3xl mb-3 md:mb-5 mt-10">{section.title}:</p>
              <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
                {section.items.map((item, itemIndex) => (
                  <AdminCard
                  key={`card-${sectionIndex}-${itemIndex}`}
                  name={item.name}
                  size={item.size}
                  value={item.value}
                  tipoAnuncio={section.title} // Vendas, Emprestimos ou Sorteios
                  idEmprestimo={item.idEmprestimo}
                  idVenda={item.idVenda}
                  idSorteio={item.idSorteio}
                />
                ))}
              </div>
            </div>
          ))}
        </div>
        <Footer className="w-full mt-16" />
      </div>
    </div>
  );
};

export default AdminMain;

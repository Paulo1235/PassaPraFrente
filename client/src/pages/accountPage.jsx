import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../lib/authSlice";

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Footer from "../components/footer";
import ContentAccount from "../components/contentAccount";
import NavbarAccount from "../components/navbarAccount";

//? Icons
import ProfilePicture from "../images/default-avatar.jpg";
import { Star } from "lucide-react";

const Account = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [userDataNonCompleted, setUserDataNonCompleted] = useState(null);
  const [rating, setRating] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const endpoints = [
          "sales/completed",
          "loans/completed",
          "giveaways/completed",
          "sales/non-completed",
          "loans/non-completed",
          "giveaways/non-completed",
          "users/my-reviews",
        ];

        const [
          resSales,
          resLoans,
          resGiveaways,
          resSalesNC,
          resLoansNC,
          resGiveawaysNC,
          resRating,
        ] = await Promise.all(
          endpoints.map((endpoint) =>
            fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            })
          )
        );

        if (!resSales.ok || !resLoans.ok || !resGiveaways.ok)
          throw new Error("Erro ao buscar dados");

        const [
          dataSales,
          dataLoans,
          dataGiveaways,
          dataSalesNC,
          dataLoansNC,
          dataGiveawaysNC,
          dataRating,
        ] = await Promise.all([
          resSales.json(),
          resLoans.json(),
          resGiveaways.json(),
          resSalesNC.json(),
          resLoansNC.json(),
          resGiveawaysNC.json(),
          resRating.json(),
        ]);

        setRating(dataRating.message || 0);

        const transformItems = (items, category) =>
          items.message.map((item) => ({
            name: item.Titulo || item.title || "Sem título",
            size: item.Descricao || item.description || "Sem descrição",
            condition: item.Condicao || item.condition || "Sem condição",
            value: item.Valor || 0,
            idVenda: item.Venda_ID || "ID",
            idEmprestimo: item.Emprestimo_ID || "ID",
            idSorteio: item.Sorteio_ID || "ID",
            image: item.photos,
            category,
          }));

        setUserData({
          sales: {
            title: "Compras",
            items: transformItems(dataSales, "Compras"),
          },
          loans: {
            title: "Emprestimos",
            items: transformItems(dataLoans, "Emprestimos"),
          },
          giveaways: {
            title: "Sorteios",
            items: transformItems(dataGiveaways, "Sorteios"),
          },
        });

        setUserDataNonCompleted({
          sales: {
            title: "Compras",
            items: transformItems(dataSalesNC, "Compras"),
          },
          loans: {
            title: "Emprestimos",
            items: transformItems(dataLoansNC, "Emprestimos"),
          },
          giveaways: {
            title: "Sorteios",
            items: transformItems(dataGiveawaysNC, "Sorteios"),
          },
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchAccountData();

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    dispatch(fetchUserInfo());
  }, [isAuthenticated, dispatch, navigate]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          fill={i <= rating ? "#D4AF37" : "#E5E5E5"}
          stroke="transparent"
          size={25}
          className="star-icon"
        />
      );
    }
    return stars;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Helmet>
        <title>Conta</title>
      </Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar canAdd={true} Home={true} Account={true} LogOut={true} />
      </div>

      <div className="bg-bgp w-full overflow-x-hidden flex flex-col flex-grow">
        {/* Novo componente NavbarAccount */}
        <NavbarAccount activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="left mx-2 md:ml-10 lg:ml-20 mt-6 md:mt-10 flex flex-col px-4 md:px-6">
          <p className="text-2xl md:text-3xl text-[#73802A] text-center md:text-start mb-6">
            Conta
          </p>

          {/* Layout para mobile (coluna) */}
          <div className="flex flex-col items-center gap-4 md:hidden">
            {/* Imagem */}
            <img
              src={user?.message.Url || ProfilePicture}
              className="rounded-full w-32 h-32 object-cover"
              alt="Profile"
            />

            {/* Nome e email */}
            <div className="text-center">
              <h1 className="text-xl text-[#73802A]">{user?.message.Nome}</h1>
              <p className="text-sm mt-1 text-gray-600">
                {user?.message.Email}
              </p>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-center mt-2">
              <div className="flex gap-1">{renderStars()}</div>
              <p className="text-sm mt-1">Avaliação</p>
            </div>
          </div>

          {/* Layout para desktop (linha com rating centralizado) */}
          <div className="hidden md:flex md:flex-row items-center gap-6">
            {/* Imagem */}
            <div className="flex-shrink-0">
              <img
                src={user?.message.Url || ProfilePicture}
                className="rounded-full w-40 h-40 object-cover"
                alt="Profile"
              />
            </div>

            {/* Container principal */}
            <div className="relative w-full flex items-center">
              {/* Nome e email */}
              <div className="flex flex-col">
                <h1 className="text-2xl text-[#73802A]">
                  {user?.message.Nome}
                </h1>
                <p className="text-sm mt-1 text-gray-600">
                  {user?.message.Email}
                </p>
              </div>

              {/* Rating - centralizado no espaço restante */}
              <div className="absolute left-1/2 right-4 transform -translate-x-1/2">
                <div className="flex flex-col items-center">
                  <div className="flex gap-1">{renderStars()}</div>
                  <p className="text-sm mt-1">Avaliação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Pagination Toggle */}
        {userData && (
          <div className="flex flex-col px-4 md:px-6 mt-6">
            <div className="flex justify-center gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded ${
                  !showCompleted ? "bg-[#73802A] text-white" : "bg-gray-200"
                }`}
                onClick={() => setShowCompleted(false)}
              >
                Em Andamento
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  showCompleted ? "bg-[#73802A] text-white" : "bg-gray-200"
                }`}
                onClick={() => setShowCompleted(true)}
              >
                Concluídos
              </button>
            </div>

            <ContentAccount
              title="Compras"
              completedItems={showCompleted ? userData.sales.items : []}
              incompleteItems={
                !showCompleted ? userDataNonCompleted.sales.items : []
              }
            />
            <ContentAccount
              title="Empréstimos"
              completedItems={showCompleted ? userData.loans.items : []}
              incompleteItems={
                !showCompleted ? userDataNonCompleted.loans.items : []
              }
            />
            <ContentAccount
              title="Sorteios"
              completedItems={showCompleted ? userData.giveaways.items : []}
              incompleteItems={
                !showCompleted ? userDataNonCompleted.giveaways.items : []
              }
            />
          </div>
        )}

        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Account;

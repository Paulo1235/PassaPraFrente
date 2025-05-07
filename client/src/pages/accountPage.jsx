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

//? Icons
import ProfilePicture from "../images/default-avatar.jpg";
import { Bell, HandHelping, Star, UserPen } from "lucide-react";

const Account = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [userDataNonCompleted, setUserDataNonCompleted] = useState(null);
  const [rating, setRating] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false); // NEW STATE

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
            fetch(`http://localhost:5000/api/${endpoint}`, {
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
      stars.push(<Star key={i} fill={i <= rating ? "yellow" : "black"} />);
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
        <div className="left mx-2 md:ml-10 lg:ml-20 mt-6 md:mt-10 flex flex-col px-4 md:px-6">
          <p className="text-2xl md:text-3xl text-[#73802A] text-center md:text-start">
            Conta
          </p>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="account mt-6 md:mt-10 flex flex-col md:flex-row">
              <img
                src={user?.message.Url || ProfilePicture}
                className="rounded-full w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-[182px] xl:h-[182px] object-cover mx-auto md:mx-0"
                alt="account-logo"
              />
              <div className="info mt-4 md:mt-0 md:ml-4 lg:ml-10 flex flex-col justify-center text-center md:text-left">
                <p className="text-xl md:text-2xl lg:text-3xl text-[#73802A]">
                  {user?.message.Nome}
                </p>
                <p className="md:ml-2 lg:ml-5 mt-2 text-sm md:text-base">
                  {user?.message.Email}
                </p>
              </div>

              <div className="rating mt-4 md:mt-0 md:ml-6 lg:ml-20 xl:ml-60 flex flex-col items-center md:items-start">
                <div className="flex flex-row items-center justify-center md:justify-start gap-1 md:gap-2">
                  {renderStars()}
                </div>
                <p className="mx-auto my-1 text-center">Rating</p>
              </div>

              <div className="icons mt-6 md:mt-0 md:ml-6 lg:ml-10 xl:ml-20 flex flex-row md:flex-col justify-center gap-4 md:gap-3">
                <div
                  onClick={() => navigate("/editaccount")}
                  className="edit flex flex-row items-center cursor-pointer text-txts"
                >
                  <UserPen className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]" />
                  <span className="ml-2 text-sm md:text-base">Editar</span>
                </div>
                <div
                  onClick={() => navigate("/notifications")}
                  className="edit flex flex-row items-center cursor-pointer text-txtp"
                >
                  <Bell className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]" />
                  <span className="ml-2 text-sm md:text-base">
                    Notificações
                  </span>
                </div>
                <div
                  className="proposals flex flex-row items-center cursor-pointer text-txtp"
                  onClick={() => navigate("/proposals")}
                >
                  <HandHelping className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]" />
                  <span className="ml-2 text-sm md:text-base">Propostas</span>
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

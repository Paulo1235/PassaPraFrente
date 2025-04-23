import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../lib/authSlice"; // Import the action

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

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const responseSales = await fetch(
          "http://localhost:5000/api/sales/completed",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseLoans = await fetch(
          "http://localhost:5000/api/loans/completed",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseGiveaways = await fetch(
          "http://localhost:5000/api/giveaways/completed",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseSalesNonCompleted = await fetch(
          "http://localhost:5000/api/sales/non-completed",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseLoansNonCompleted = await fetch(
          "http://localhost:5000/api/loans/non-completed",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseGiveawaysNonCompleted = await fetch(
          "http://localhost:5000/api/giveaways/non-completed",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const responseRating = await fetch(
          "http://localhost:5000/api/users/my-reviews",
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

        const dataSalesNonCompleted = await responseSalesNonCompleted.json();
        const dataLoansNonCompleted = await responseLoansNonCompleted.json();
        const dataGiveawaysNonCompleted =
          await responseGiveawaysNonCompleted.json();

        const dataRating = await responseRating.json();

        // console.log(dataRating)
        // console.log(dataSales)
        // console.log(dataLoans)
        // console.log(dataGiveaways)

        // Set the rating value from backend
        setRating(dataRating.message || 0);

        const transformItems = (items, category) => {
          return items.message.map((item) => ({
            name: item.Titulo || item.title || "Sem título",
            size: item.Descricao || item.description || "Sem descrição",
            value: item.Valor || item.Valor || "N/A",
            idVenda: item.Venda_ID || "ID",
            idEmprestimo: item.Emprestimo_ID || "ID",
            idSorteio: item.Sorteio_ID || "ID",
            photos: item.photos?.Url,
            category,
          }));
        };

        const userData = {
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

        const userDataNonCompleted = {
          sales: {
            title: "Vendas",
            items: transformItems(dataSalesNonCompleted, "Vendas"),
          },
          loans: {
            title: "Emprestimos",
            items: transformItems(dataLoansNonCompleted, "Emprestimos"),
          },
          giveaways: {
            title: "Sorteios",
            items: transformItems(dataGiveawaysNonCompleted, "Sorteios"),
          },
        };

        // console.log(userData);
        // console.log(userDataNonCompleted);
        setUserData(userData);
        setUserDataNonCompleted(userDataNonCompleted);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    fetchAccountData();

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    dispatch(fetchUserInfo());
  }, [isAuthenticated, dispatch, navigate]);

  //? Renderiza as estrelas do rating
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Filled star
        stars.push(<Star fill="yellow" />);
      } else {
        // Empty star
        stars.push(<Star fill="black" />);
      }
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
      <div className="App w-full overflow-x-hidden flex flex-col flex-grow">
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
                  onClick={() => {
                    navigate("/editaccount");
                  }}
                  className="edit flex flex-row items-center cursor-pointer text-txts"
                >
                  <UserPen className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]" />
                  <span className="ml-2 text-sm md:text-base">Editar</span>
                </div>
                <div
                  onClick={() => {
                    navigate("/notifications");
                  }}
                  className="edit flex flex-row items-center cursor-pointer text-txtp"
                >
                  <Bell className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]" />
                  <span className="ml-2 text-sm md:text-base">
                    Notificações
                  </span>
                </div>
                <div
                  className="proposals flex flex-row items-center cursor-pointer text-txtp"
                  onClick={() => {
                    navigate("/proposals");
                  }}
                >
                  <HandHelping className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[35px] xl:h-[35px]" />
                  <span className="ml-2 text-sm md:text-base">Propostas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {userData && (
          <>
            <ContentAccount
              title="Vendas"
              completedItems={userData.sales.items}
              incompleteItems={userDataNonCompleted.sales.items}
            />
            <ContentAccount
              title="Emprestimos"
              completedItems={userData.loans.items}
              incompleteItems={userDataNonCompleted.loans.items}
            />
            <ContentAccount
              title="Sorteios"
              completedItems={userData.giveaways.items}
              incompleteItems={userDataNonCompleted.giveaways.items}
            />
          </>
        )}
        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Account;

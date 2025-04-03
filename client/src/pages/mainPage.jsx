// Main.jsx
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, fetchProtectedData } from "../lib/authSlice";
import { fetchUserInfo } from "../lib/authSlice"; // Import the action

//? CSS
import "../components/css/sidebar.css";
import "../index.css";

//? Components
import SideBar from "../components/sideBar";
import Shop from "../components/shop";

const shopData = [
  {
    title: "Vendas",
    items: [
      { name: "Camisola dourada", size: "S", value: "10,50" },
      { name: "Camisola vermelha", size: "M", value: "15,00" },
      { name: "Camisola azul", size: "XL", value: "17,40" },
      { name: "Camisola rosa", size: "XXL", value: "20,00" },
      { name: "Camisola amarela", size: "3XL", value: "25,00" },
    ],
  },
  {
    title: "Emprestimos",
    items: [
      { name: "Camisola dourada", size: "S", value: "10,50" },
      { name: "Camisola vermelha", size: "M", value: "15,00" },
      { name: "Camisola azul", size: "XL", value: "17,40" },
      { name: "Camisola rosa", size: "XXL", value: "20,00" },
      { name: "Camisola amarela", size: "3XL", value: "25,00" },
    ],
  },
  {
    title: "Sorteios",
    items: [
      { name: "Camisola dourada", size: "S", value: "10,50" },
      { name: "Camisola vermelha", size: "M", value: "15,00" },
      { name: "Camisola azul", size: "XL", value: "17,40" },
      { name: "Camisola rosa", size: "XL", value: "17,40" },
    ],
  },
];

const Main = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
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
        <SideBar canAdd={true} />
      </div>
      <Shop shopData={shopData} />
    </div>
  );
};

export default Main;

import { Helmet } from "react-helmet"

//? CSS
import "../components/css/sidebar.css"
import "../index.css"

//? Components
import SideBar from "../components/sideBar"
import AdminCard from "../components/adminCard"
import Footer from "../components/footer"

// Sample data structure - replace with your actual data source
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
    ],
  }
]

const AdminMain = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Helmet>
        <title>Loja</title>
      </Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar canAdd = {false} />
      </div>
      <div className="App w-full overflow-x-auto flex flex-col">
        <div className="flex flex-col md:flex-row px-4 md:px-6 flex-grow">
          {shopData.map((section, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className="flex flex-col w-full md:w-1/3 px-2">
              <p className="text-[#73802A] text-2xl md:text-3xl mb-3 md:mb-5 mt-10">{section.title}:</p>
              <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
                {section.items.map((item, itemIndex) => (
                  <AdminCard key={`card-${sectionIndex}-${itemIndex}`} name={item.name} size={item.size} value={item.value} />
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


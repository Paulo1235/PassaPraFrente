import { Helmet } from "react-helmet"

//? CSS
import "../components/css/sidebar.css"
import "../index.css"

//? Components
import SideBar from "../components/sideBar"
import Card from "../components/card"
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

const Main = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <Helmet>
        <title>Loja</title>
      </Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar />
      </div>
      <div className="App w-full overflow-x-hidden flex flex-col">
        {shopData.map((section, sectionIndex) => (
          <div
            key={`section-${sectionIndex}`}
            className={`${sectionIndex === 0 ? "mt-5" : "mt-8 md:mt-10"} flex flex-col w-full px-4 md:px-6`}
          >
            <p className="text-[#73802A] text-2xl md:text-3xl ml-2 md:ml-10 mb-3 md:mb-5">{section.title}:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 px-2 md:px-4">
              {/* fazer com que ao clicar no card vai ter ao /sale ou /loan ou /draw */}
              {section.items.map((item, itemIndex) => (
                <Card key={`card-${sectionIndex}-${itemIndex}`} name={item.name} size={item.size} value={item.value} category={section.title} />
              ))}
            </div>
          </div>
        ))}
        <Footer />
      </div>
    </div>
  )
}

export default Main


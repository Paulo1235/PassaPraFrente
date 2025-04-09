import Card from "./card";
import Footer from "./footer";

const ShopSection = ({ title, items }) => {
    return (
      <div className={`mt-8 md:mt-10 flex flex-col w-full px-4 md:px-6`}>
        <p className="text-[#73802A] text-2xl md:text-3xl ml-2 md:ml-10 mb-3 md:mb-5">
          {title}:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 px-2 md:px-4">
          {items.map((item, index) => (
            <Card
              key={`card-${title}-${index}`}
              name={item.name}
              size={item.size}
              value={item.value}
              category={title}
              idVenda={item.idVenda}
              idEmprestimo={item.idEmprestimo}
              idSorteio={item.idSorteio}
            />
          ))}
        </div>
      </div>
    );
  };
  
  const Shop = ({ shopData }) => {
    return (
      <div className="App w-full overflow-x-hidden flex flex-col">
        {Object.values(shopData).map((section, index) => (
          <ShopSection key={`section-${index}`} title={section.title} items={section.items} />
        ))}
        <Footer />
      </div>
    );
  };
  
  export default Shop;
  
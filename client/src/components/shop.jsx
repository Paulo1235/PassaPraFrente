import { useEffect } from "react";
import Card from "./card";
import Footer from "./footer";
import "../index.css";

const ShopSection = ({ title, items }) => {
  const singularTitle = title.slice(0, -1);

  return (
    <div className="bg-bgp flex flex-col">
      <section className="mt-4 w-full px-4 md:px-8 lg:px-10 max-w-7xl mx-auto"> {/* Reduzido mt-8 para mt-4 */}
        {/* Header da seção */}
        <h2 className="text-[#73802A] text-2xl md:text-3xl font-medium mb-4 md:mb-6"> {/* Reduzido mb-6 para mb-4 */}
          {title}
        </h2>

        {/* Grid de cards ou estado vazio */}
        {items.length === 0 ? (
          <div className="bg-bgp p-4 rounded-lg border border-gray-200"> {/* Reduzido p-6 para p-4 */}
            <p className="text-gray-600 text-center text-lg">
              Nenhum {singularTitle.toLowerCase()} disponível
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Reduzido gap-6 para gap-4 */}
            {items.map((item, index) => (
              <Card
                mainPage={true}
                key={`${title}-${
                  item.idVenda || item.idEmprestimo || item.idSorteio || index
                }`}
                name={item.name}
                description={item.description}
                condition={item.condition}
                value={item.value}
                category={title}
                image={item.foto}
                idVenda={item.idVenda}
                idEmprestimo={item.idEmprestimo}
                idSorteio={item.idSorteio}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Shop = ({ shopData }) => {
  useEffect(() => {
    console.log("Shop data loaded:", shopData);
  }, [shopData]);

  return (
    <div className="flex flex-col">
      <main className="flex-1 py-4"> {/* Reduzido py-8 para py-4 */}
        {Object.values(shopData).map((section, index) => (
          <ShopSection
            key={`shop-section-${index}`}
            title={section.title}
            items={section.items}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
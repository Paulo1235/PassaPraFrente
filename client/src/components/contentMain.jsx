import Card from "./card";
import Footer from "./footer";

//? CSS
import "../index.css";

const ContentMainSection = ({ title, items }) => {

  return (
    <div className="bg-bgp flex flex-col">
      <section className="mt-4 w-full px-4 md:px-8 lg:px-10 max-w-7xl mx-4">
        {/* Header da seção */}
        <h2 className="text-[#73802A] text-2xl md:text-3xl md:text-start text-center font-medium mb-4 md:mb-6">
          {title}
        </h2>

        {/* Grid de cards ou estado vazio */}
        {items.length === 0 ? (
          <div className="bg-bgp p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-center text-lg">
              Sem {title.toLowerCase()} disponíveis no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:place-items-start place-items-center">
            {items.map((item) => {
              return (
                <Card
                  mainPage={true}
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
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const ContentMain = ({ shopData }) => {
  return (
    <div className="flex flex-col w-full">
      <main className="flex-1 py-4">
        {Object.values(shopData).map((section, index) => (
          <ContentMainSection
            title={section.title}
            items={section.items}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default ContentMain;

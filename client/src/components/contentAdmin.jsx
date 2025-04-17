// components/AdminCardsSection.jsx
import AdminCard from './adminCard'

const ContentAdmin = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row px-4 md:px-6 flex-grow text-center md:text-start">
      {data.map((section, sectionIndex) => (
        <div
          key={`section-${sectionIndex}`}
          className="flex flex-col w-full md:w-1/3 px-2"
        >
          <p className="text-[#73802A] text-2xl md:text-3xl mb-3 md:mb-5 mt-10">
            {section.title}:
          </p>
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
            {section.items.length === 0 ? (
              <p className="text-gray-500 text-lg">
                Nenhum(a) {section.title.toLowerCase()} disponível
              </p>
            ) : (
              section.items.map((item, itemIndex) => (
                <AdminCard
                  key={`card-${sectionIndex}-${itemIndex}`}
                  name={item.name}
                  size={item.size}
                  value={item.value}
                  tipoAnuncio={section.title}
                  image={item.image?.Url}
                  idEmprestimo={item.idEmprestimo}
                  idVenda={item.idVenda}
                  idSorteio={item.idSorteio}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentAdmin;

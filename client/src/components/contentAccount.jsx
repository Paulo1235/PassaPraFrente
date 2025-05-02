import React, { useEffect } from "react";
import Card from "./card";

const ContentAccount = (props) => {
  const {
    title = "",
    completedItems = [],
    incompleteItems = [],
  } = props || {};

  useEffect(() => {
    console.log(props);
  }, []);

  const hasCompletedItems =
    Array.isArray(completedItems) && completedItems.length > 0;
  const hasIncompleteItems =
    Array.isArray(incompleteItems) && incompleteItems.length > 0;

  return (
    <div className="content mt-10 md:mt-20 px-4 md:px-6 lg:px-10 xl:px-20 text-[#73802A] flex-grow">
      <p className="text-xl md:text-2xl">
        O que tem para o vizinho: <span className="font-semibold">{title}</span>
      </p>

      {/* Incomplete Items Section */}
      {hasIncompleteItems && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2 text-center md:text-start">
            Em andamento
          </h3>
          <div className="overflow-x-auto flex gap-5 pb-2">
            <div className="flex flex-row gap-5">
              {incompleteItems.map((item, index) => (
                <Card
                  key={`incomplete-${index}`}
                  name={item.name}
                  size={item.size}
                  value={item.value}
                  condition={item.condition}
                  category={title}
                  idVenda={item.idVenda}
                  idEmprestimo={item.idEmprestimo}
                  idSorteio={item.idSorteio}
                  image={item.image}
                  isCompleted={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Items Section */}
      {hasCompletedItems && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2 text-center md:text-start">
            Concluídos
          </h3>
          <div className="overflow-x-auto flex gap-5 pb-2">
            <div className="flex flex-row gap-5">
              {completedItems.map((item, index) => (
                <Card
                  key={`complete-${index}`}
                  name={item.name}
                  size={item.size}
                  condition={item.condition}
                  value={item.value}
                  category={title}
                  idVenda={item.idVenda}
                  idEmprestimo={item.idEmprestimo}
                  idSorteio={item.idSorteio}
                  image={item.image}
                  isCompleted={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Items Message */}
      {!hasCompletedItems && !hasIncompleteItems && (
        <p className="mt-4 text-gray-500">Nenhum item disponível.</p>
      )}
    </div>
  );
};

export default ContentAccount;

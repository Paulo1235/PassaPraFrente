import React from "react";
import Card from "./card";
import { useEffect } from "react";

const ContentAccount = (props) => {
    const { 
        title = "", 
        completedItems = [], 
        incompleteItems = [] 
    } = props || {};

    // useEffect(()=>{console.log(props)}, [])

    const hasCompletedItems = Array.isArray(completedItems) && completedItems.length > 0;
    const hasIncompleteItems = Array.isArray(incompleteItems) && incompleteItems.length > 0;

    return (
        <div className="content mt-10 md:mt-20 px-4 md:px-6 lg:px-10 xl:px-20 text-[#73802A] flex-grow">
            <p className="text-xl md:text-2xl">O que tem para o vizinho: <span className="font-semibold">{title}</span></p>
            
            {/* Incomplete Items Section */}
            {hasIncompleteItems && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2 text-center md:text-start">Em andamento</h3>
                    <div className="items grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10 justify-items-center">
                        {incompleteItems.map((item, index) => (
                            <Card
                                key={`incomplete-${index}`}
                                name={item.name}
                                size={item.size}
                                value={item.value}
                                category={title}
                                idVenda={item.idVenda}
                                idEmprestimo={item.idEmprestimo}
                                idSorteio={item.idSorteio}
                                image = {item.photos}
                                isCompleted={false}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Items Section */}
            {hasCompletedItems && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2 text-center md:text-start">Concluídos</h3>
                    <div className="items grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10 justify-items-center">
                        {completedItems.map((item, index) => (
                            <Card
                                key={`complete-${index}`}
                                name={item.name}
                                size={item.size}
                                value={item.value}
                                category={title}
                                idVenda={item.idVenda}
                                idEmprestimo={item.idEmprestimo}
                                idSorteio={item.idSorteio}
                                isCompleted={true}
                            />
                        ))}
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
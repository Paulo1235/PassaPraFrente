import React from "react";
import Card from "./card";

const ContentAccount = (props) => {
    const { title = "", items = [] } = props.items || {}; // props.items pode ser null ou undefined

    const hasValidItems = Array.isArray(items) && items.length > 0;

    return (
        <>
            <div className="content mt-10 md:mt-20 px-4 md:px-6 lg:px-10 xl:px-20 text-[#73802A] flex-grow">
                <p className="text-xl md:text-2xl">O que tem para o vizinho: <span className="font-semibold">{title}</span></p>
                {hasValidItems ? (
                    <div className="items mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
                        {items.map((item, index) => (
                            <Card
                                key={index}
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
                ) : (
                    <p className="mt-4 text-gray-500">Nenhum item disponível.</p>
                )}
            </div>
        </>
    );
};

export default ContentAccount;

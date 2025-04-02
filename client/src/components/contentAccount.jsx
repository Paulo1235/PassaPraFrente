import React from "react";
import Card from "./card";

const ContentAccount = (props) => {
    const { items = [] } = props; // Recebe o array de itens via props e define um valor padrão

    return (
        <>
            <div className="content mt-10 md:mt-20 px-4 md:px-6 lg:px-10 xl:px-20 text-[#73802A] flex-grow">
                <p className="text-xl md:text-2xl">O que tem para o vizinho:</p>
                <div className="items mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
                    {items.map((item, index) => (
                        <Card
                            key={index} // Adiciona uma key única para cada Card
                            name={item.name}
                            size={item.size}
                            value={item.value}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ContentAccount;

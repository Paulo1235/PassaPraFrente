import { useState } from "react";
import { Star, X } from "lucide-react";

const Modal = ({ closeModal }) => {
  const [rating, setRating] = useState(1);

  const submitAvaliation = () => {
    console.log("Avaliação submetida com nota:", rating);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal} 
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={closeModal} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-2">Fazer Avaliação</h2>
        <p className="text-gray-600 mb-4">Dê a sua avaliação abaixo:</p>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer transition-colors ${
                star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <button
          onClick={submitAvaliation}
          className="mt-4 bg-[#CAAD7E] text-white px-4 py-2 rounded hover:bg-[#887455]"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Modal;

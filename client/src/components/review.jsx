import { useState } from "react";
import { Star } from "lucide-react";

const Modal = ({ closeModal }) => {
  const [rating, setRating] = useState(4);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
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
          onClick={closeModal}
          className="mt-4 bg-[#CAAD7E] text-white px-4 py-2 rounded hover:bg-[#887455]"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;
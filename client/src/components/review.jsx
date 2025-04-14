import { useState } from "react";
import { Star, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Modal = ({ closeModal, reviewId, category }) => {
  const [rating, setRating] = useState(1);
  const navigate = useNavigate();
  const submitAvaliation = async () => {
    if (category == "sale") {
      try {
        const result = await fetch(
          `http://localhost:5000/api/transaction-sales/review/${reviewId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
              { 
                review: rating, 
              }
            ),
          }
        );
        const data = await result.json();
        if(data.message == "Review da venda criada com sucesso.")
          {
            toast.success("Review da venda criada com sucesso.");
            setTimeout(() => {
              navigate("/index");
            }, 2000);
          }else
          {
            toast.error(data.message)
            setTimeout(() => {
              navigate("/index");
            }, 2000);
          }
      } catch (error) {
        console.log(error);
      }
    }

    if (category == "loan") {
      try {
        const result = await fetch(
          `http://localhost:5000/api/transaction-loans/review/${reviewId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
              { 
                review: rating, 
              }
            ),
          }
        );
        const data = await result.json();
        if(data.message == "Review do empréstimo criada com sucesso.")
        {
          toast.success("Review do empréstimo criada com sucesso.");
          setTimeout(() => {
            navigate("/index");
          }, 2000);
        }else
        {
          toast.error(data.message)
          setTimeout(() => {
            navigate("/index");
          }, 2000);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (category == "giveaway") {
      try {
        const result = await fetch(
          `http://localhost:5000/api/winner-giveaway/review/${reviewId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(
              { 
                review: rating, 
              }
            ),
          }
        );
        console.log(await result.json());
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <ToastContainer />
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
                star <= rating
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-400"
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

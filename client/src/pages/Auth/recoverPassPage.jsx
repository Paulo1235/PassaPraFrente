import { useState } from "react";
import logo from "../../images/logoEmpresa.png";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("O email é obrigatório!");
    } else {
      setError("");
      // Aqui você pode adicionar a lógica para enviar o formulário
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#E0E5B6]">
      <div className="w-full max-w-4xl bg-[#24251D] rounded-3xl shadow-xl overflow-hidden flex">
        
        {/* Left Side (Logo & Message) */}
        <div className="hidden md:flex md:w-1/2 bg-[#24251D] flex-col items-center justify-center p-8">
          <div className="text-[#73802A] mb-4">
            <img src={logo} alt="logo" width={200} height={200} />
          </div>
          <p className="text-[#73802A] text-center text-lg">
            Entre vizinhos, tudo se
          </p>
          <p className="text-[#73802A] text-center text-lg">Aproveita!</p>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl m-4 p-6">
          <h2 className="text-2xl font-medium text-[#73802A] mb-6 text-center">
            Alterar Palavra-Passe
          </h2>
          <p className="text-center mb-8 text-gray-800">
            Vai ser enviado um email com um link para
            <br />
            escrever a nova palavra passe.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#73802A]"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full px-3 py-2 border border-[#73802A] rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]"
                required
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <button
              onClick={handleSubmit}
              className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
            >
              Enviar
            </button>
            <p className="text-center text-sm">
              Tem conta?{" "}
              <a href="/" className="text-[#73802A] hover:underline">
                Clique Aqui!
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

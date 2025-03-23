"use client";

import { useState } from "react";
import logo from "../../images/logoEmpresa.png";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordReset() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex h-screen items-center justify-center bg-[#e2e5b9]">
      <div className="relative mx-auto flex w-full max-w-4xl overflow-hidden rounded-3xl bg-[#24251D] p-6 shadow-xl">
        {/* Left side with logo and tagline */}

        <div className="hidden md:flex md:w-1/2 bg-[#24251D] flex-col items-center justify-center p-8">
          <div className="text-[#73802A] mb-4">
            <img src={logo} alt="logo" width={200} height={200} />
          </div>
          <p className="text-[#73802A] text-center text-lg">
            Entre vizinhos, tudo se
          </p>
          <p className="text-[#73802A] text-center text-lg">Aproveita!</p>
        </div>

        {/* Right side with form */}
        <div className="w-3/5">
          <div className="rounded-2xl bg-white p-8">
            <h2 className="mb-8  text-2xl font-medium text-[#73802A]">
              Nova Palavra-Passe
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-[#73802A]"
                >
                  Nova Palavra-Passe:
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-md border border-[#73802A] bg-white px-4 py-2 pr-10 text-gray-800 focus:border-[#73802A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-[#73802A]"
                >
                  Confirmar Palavra-Passe:
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full rounded-md border border-[#73802A] bg-white px-4 py-2 pr-10 text-gray-800 focus:border-[#73802A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
              >
                Enviar
              </button>

              <div className="mt-4 text-center">
                <span className="text-gray-800">Fazer Login? </span>
                <a href="/" className="text-[#73802A] hover:underline">
                  Clique Aqui!
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

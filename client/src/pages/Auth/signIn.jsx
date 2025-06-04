import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import * as Yup from "yup";

import logo from "../../images/logoEmpresa.png";

const SignIn = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      contact: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email inválido")
        .required("Email é obrigatório"),
      password: Yup.string()
        .min(6, "A palavra-passe deve ter pelo menos 6 caracteres")
        .required("Palavra-passe é obrigatória"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "As palavras-passe têm de coincidir")
        .required("Confirmação de palavra-passe é obrigatória"),
      name: step === 2 ? Yup.string().required("Nome é obrigatório") : Yup.string(),
      contact: step === 2 
        ? Yup.string()
            .matches(
              /^\+351(91|92|93|96)\d{7}$/,
              "O número deve começar com +351 e ser português"
            )
            .required("Contacto é obrigatório")
        : Yup.string(),
      birthDate: step === 2 ? Yup.date().required("Data de nascimento é obrigatória") : Yup.date(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
          credentials: "include",
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Erro ao criar conta");
        }

        toast.success("Conta criada com sucesso!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        toast.error(err.message || "Erro ao criar conta");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1 && 
        formik.values.email && 
        formik.values.password && 
        formik.values.confirmPassword &&
        !formik.errors.email && 
        !formik.errors.password && 
        !formik.errors.confirmPassword) {
      setStep(2);
    } else {
      formik.handleSubmit();
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center min-h-screen bg-bgp p-4 sm:p-8">
      <Helmet>
        <title>PassaPraFrente - Criar Conta</title>
      </Helmet>
      <ToastContainer />
      
      <div className="w-full max-w-4xl bg-bgs rounded-3xl shadow-xl overflow-hidden flex flex-col sm:flex-row p-4 sm:p-6">
                {/* Imagem - mobile */}
                <div className="flex sm:hidden w-full bg-bgs flex-col items-center justify-center p-8">
          <div className="text-txtp mb-4">
            <img src={logo} alt="logo" className="w-48 h-48" />
          </div>
          <p className="text-txtp text-center text-lg">
            Entre vizinhos, tudo se
          </p>
          <p className="text-txtp text-center text-lg">Aproveita!</p>
        </div>
        {/* Formulário - agora vem primeiro (esquerda no desktop) */}
        <div className="w-full sm:w-1/2 bg-white rounded-2xl px-6 py-6 sm:px-8 sm:py-8">
          <h2 className="text-2xl font-medium text-txtp mb-6">
            {step === 1 ? "Crie sua conta" : "Complete seu registro"}
          </h2>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-txtp">
                      Email:
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="exemplo@email.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : "border-txtp"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-txtp">
                      Palavra-Passe:
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border ${
                          formik.touched.password && formik.errors.password
                            ? "border-red-500"
                            : "border-txtp"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-txtp">
                      Confirmar Palavra-Passe:
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border ${
                          formik.touched.confirmPassword && formik.errors.confirmPassword
                            ? "border-red-500"
                            : "border-txtp"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-txtp">
                      Nome Completo:
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border ${
                        formik.touched.name && formik.errors.name
                          ? "border-red-500"
                          : "border-txtp"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-sm">{formik.errors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact" className="block text-sm font-medium text-txtp">
                      Contacto Telefónico:
                    </label>
                    <input
                      id="contact"
                      name="contact"
                      type="tel"
                      placeholder="+351912345678"
                      value={formik.values.contact}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border ${
                        formik.touched.contact && formik.errors.contact
                          ? "border-red-500"
                          : "border-txtp"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
                    />
                    {formik.touched.contact && formik.errors.contact && (
                      <p className="text-red-500 text-sm">{formik.errors.contact}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-txtp">
                      Data de Nascimento:
                    </label>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formik.values.birthDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 border ${
                        formik.touched.birthDate && formik.errors.birthDate
                          ? "border-red-500"
                          : "border-txtp"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
                    />
                    {formik.touched.birthDate && formik.errors.birthDate && (
                      <p className="text-red-500 text-sm">{formik.errors.birthDate}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 space-y-4">
              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full text-white py-2 px-4 bg-btns hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                >
                  Continuar
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white py-2 px-4 bg-btns hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      "Criar Conta"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full text-center text-sm text-txtp hover:underline"
                  >
                    Voltar
                  </button>
                </>
              )}
              
              <p className="text-center text-sm">
                Já tem conta?{" "}
                <span onClick={() => navigate("/")} className="text-txtp hover:underline cursor-pointer">
                  Entrar
                </span>
              </p>
            </div>
          </form>
        </div>


        
        <div className="hidden sm:flex sm:w-1/2 bg-bgs flex-col items-center justify-center p-8">
          <div className="text-txtp mb-4">
            <img src={logo} alt="logo" className="w-48 h-48" />
          </div>
          <p className="text-txtp text-center text-lg">
            Entre vizinhos, tudo se
          </p>
          <p className="text-txtp text-center text-lg">Aproveita!</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
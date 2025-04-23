import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import logo from "../../images/logoEmpresa.png";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      contact: "",
      birthDate: null,
      imageUrl: "https://www.google.com",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email inválido")
        .required("Email é obrigatório"),
      password: Yup.string()
        .min(6, "A palavra-passe deve ter pelo menos 6 caracteres")
        .required("Palavra-passe é obrigatória"),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("password"), null],
          "As palavras-passe têm de coincidir"
        )
        .required("Obrigatorio"),
      name:
        step === 2 ? Yup.string().required("Nome é obrigatório") : Yup.string(),
      contact:
        step === 2
          ? Yup.string()
              .matches(
                /^\+351(91|92|93|96)\d{7}$/,
                "O número de telefone deve começar com +351 e ser portugues oh burro"
              )
              .required("Número de telefone é obrigatório")
          : Yup.string(),
      birthDate:
        step === 2
          ? Yup.date().required("Data de nascimento é obrigatória")
          : Yup.date(),
    }),
    onSubmit: (values) => {
      //! So aqui e que usamos axios xd
      axios
        .post("http://localhost:5000/api/auth/register", values)
        .then((response) => {
          toast.success("Conta criada com sucesso!");
          setTimeout(() => {
            navigate("/");
          }, 5000);
        })
        .catch((error) => {
          toast.error("Erro ao criar conta. Tente novamente.");
          console.error("Error:", error);
        });
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (
      formik.values.email &&
      formik.values.password &&
      !formik.errors.email &&
      !formik.errors.password
    ) {
      setStep(2);
    } else {
      formik.handleSubmit();
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#E0E5B6]">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-[#24251D] rounded-3xl shadow-xl overflow-hidden flex">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl m-4 p-6">
          <h2 className="text-2xl font-medium text-[#73802A] mb-6">
            {step === 1
              ? "Novo por Aqui? Crie conta agora!"
              : "Complete o seu registo"}
          </h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#73802A]"
                    >
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
                          : "border-[#73802A]"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#73802A]"
                    >
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
                            : "border-[#73802A]"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-[#73802A]"
                    >
                      Confirmar Palavra-Passe:
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword2 ? "text" : "password"}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border ${
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                            ? "border-red-500"
                            : "border-[#73802A]"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility2}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword2 ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.confirmPassword}
                        </p>
                      )}
                  </div>
                </>
              ) : (
                // Step 2: Name, Phone Number, and Date of Birth
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[#73802A]"
                    >
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
                          : "border-[#73802A]"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]`}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="contact"
                      className="block text-sm font-medium text-[#73802A]"
                    >
                      Número de Telefone:
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
                          : "border-[#73802A]"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]`}
                    />
                    {formik.touched.contact && formik.errors.contact && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.contact}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium text-[#73802A]"
                    >
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
                          : "border-[#73802A]"
                      } rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]`}
                    />
                    {formik.touched.birthDate && formik.errors.birthDate && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.birthDate}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="mt-8">
              {step === 2 ? (
                <div className="space-y-4">
                  <button
                    type="submit"
                    className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                  >
                    Criar Conta
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full text-center text-sm text-[#73802A] hover:underline"
                  >
                    Voltar
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                  >
                    Continuar
                  </button>
                  <p className="text-center text-sm">
                    Tem conta?{" "}
                    <a href="/" className="text-[#73802A] hover:underline">
                      Clique Aqui!
                    </a>
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right side - Logo and tagline */}
        <div className="hidden md:flex md:w-1/2 bg-[#222220] flex-col items-center justify-center p-8">
          <div className="text-[#73802A] mb-4">
            <img src={logo} alt="logo" width={200} height={200} />
          </div>
          <p className="text-[#73802A] text-center text-lg">
            Entre vizinhos, tudo se Aproveita!
          </p>
        </div>
      </div>
    </div>
  );
}

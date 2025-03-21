//? CSS
import "../index.css";
//? Logo
import logo from "../images/logoEmpresa.png";

import { Formik } from "formik";
//import { useState } from "react";

function SignIn() {
/*  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
*/
  return (
    <div className="App flex justify-center items-center">
      <div className="!w-auto !h-auto black-rectangle flex p-10 text-xl max-w-5xl p-5">
        <div className="left ml-0 flex flex-col justify-center mr-10">
          <div className="!h-auto white-rectangle flex flex-col overflow-hidden">
            <span className="text text-2xl pt-8 pl-10">
              Continuar Nova Conta
            </span>
            <Formik
              initialValues={{ name: "", birth: "", contact: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.name) {
                  errors.name = "Obrigatorio";
                } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/i.test(values.name)
                ) {
                  errors.name = "Insira um nome valido";
                }

                if (!values.birth) {
                    errors.birth = "Obrigatório";
                  } else {
                    const birthDate = new Date(values.birth);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    const dayDiff = today.getDate() - birthDate.getDate();
                    
                    if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
                      errors.birth = "Tem que ter mais de 18 anos";
                    }
                  }

                  if (!values.contact) {
                    errors.contact = "Obrigatório";
                  } else if (!/^\+?\d{9,15}$/.test(values.contact)) {
                    errors.contact = "Insira um número de telefone válido";
                  }

                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="w-full px-10 flex flex-col"
                >
                  <label className="text pt-4" htmlFor="name">
                    Nome:
                  </label>
                  <input
                    className="texbox mt-2 p-2 rounded"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Escreva seu nome"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  <span className="text-lg text-error h-3">
                    {errors.name && touched.name && errors.name}
                  </span>

                  <label className="text pt-4" htmlFor="birth">
                    Data Nascimento:
                  </label>
                  <div className="relative">
                    <input
                      className="texbox mt-2 p-2 rounded w-full"
                      //type={showPassword ? "text" : "birth"}
                      id="birth"
                      name="birth"
                      placeholder= "DD/MM/AAAA"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.birth}
                    />
                  </div>
                  <span className="text-lg text-error h-3">
                    {errors.birth && touched.birth && errors.birth}
                  </span>

                  <label className="text pt-4" htmlFor="contact">
                    Contacto Telefone:
                  </label>
                  <div className="relative">
                    <input
                      className="texbox mt-2 p-2 rounded w-full"
                      //type={showPassword2 ? "text" : "password"}
                      id="contact"
                      name="contact"
                      placeholder="999999999"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.contact}
                    />
                  </div>
                  <span className="text-lg text-error h-3">
                    {errors.contact && touched.contact && errors.contact}
                  </span>



                  <div className="py-5 flex flex-col self-center justify-center">

                    <button
                      type="submit"
                      className="btn-login"
                      disabled={isSubmitting}
                    >
                      Entrar
                    </button>

                    <span className="text-base text-center pt-2">
                      <a href="/SignIn" className="text">
                        Voltar Atrás
                      </a>
                    </span>

                    <span className="text-base text-center pt-2">
                      Ainda sem conta?{" "}
                      <a href="/" className="text">
                        Clique Aqui!
                      </a>
                    </span>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
        <div className="right m-20  flex flex-col items-start justify-center">
          <img src={logo} alt="logo" />
          <span className="text text-center ml-8">
            Entre vizinhos, tudo se <span className="block">Aproveita!</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

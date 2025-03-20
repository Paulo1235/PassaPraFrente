//? CSS
import "../index.css";
//? Logo
import logo from "../images/logoEmpresa.png";
//? Icons
import eyeIco from "../images/eyeIco.svg";

import { Formik } from "formik";
import { useState } from "react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="App flex justify-center items-center">
      <div className="!w-auto !h-auto black-rectangle flex p-10 text-xl max-w-5xl p-5">
        <div className="left ml-20  flex flex-col items-start justify-center">
          <img src={logo} alt="logo" />
          <span className="text">
            Entre vizinhos, tudo se{" "}
            <span className="flex flex-col items-center">Aproveita!</span>
          </span>
        </div>
        <div className="right ml-20 flex flex-col justify-center">
          <div className="white-rectangle flex flex-col overflow-hidden"> 
            <span className="text text-2xl pt-8 pl-10">
              Bem-Vindo, entre agora!
            </span>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Obrigatorio";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Insira um email valido";
                }
                if (!values.password) {
                  errors.password = "Obrigatorio";
                } else if (values.password.length < 6) {
                  errors.password =
                    "A palavra-passe deve ter pelo menos 6 caracteres";
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
                  <label className="text pt-4 " htmlFor="email">
                    Email:
                  </label>
                  <input
                    className="texbox mt-2 p-2 rounded"
                    type="text"
                    id="email"
                    name="email"
                    placeholder="teste@gmail.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <span className="text-lg text-error h-6">
                    {errors.email && touched.email && errors.email}
                  </span>
                  <label className="text pt-4" htmlFor="username">
                    Palavra-Passe:
                  </label>
                  <div className="relative">
                    <input
                      className=" texbox mt-2 p-2 border border-gray-300 rounded w-full"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="*******"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <img
                      src={eyeIco}
                      alt="eye icon"
                      className="absolute right-3 top-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  <span className="text-lg text-error h">
                    {errors.password && touched.password && errors.password}
                  </span>
                  <span className="text text-base flex justify-end">
                    <a href="/RecoverPass">Alterar Palavra-Passe</a>
                  </span>
                  <div className="pt-10 flex flex-col self-center justify-center">
                    <button
                      type="submit"
                      className="btn-login"
                      disabled={isSubmitting}
                    >
                      Entrar
                    </button>
                    <span className="text-base text-center pt-2">
                      Ainda sem conta?{" "}
                      <a href="/SignIn" className="text">
                        Clique Aqui!
                      </a>
                    </span>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

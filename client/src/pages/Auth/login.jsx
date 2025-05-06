import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";

import { Eye, EyeOff } from "lucide-react";

import { LoginSchema } from "../../lib/schemas";
import { login } from "../../lib/authSlice";

import logo from "../../images/logoEmpresa.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        setIsLoading(false);
        return;
      }

      const userResponse = await fetch(`http://localhost:5000/api/protected-route`, {
        credentials: "include",
      });

      const userData = await userResponse.json();
      dispatch(login({ user: { email: values.email, message: userData.message } }));

      toast.success(`Bem vindo: ${data.message.Nome}`);
      setTimeout(() => navigate("/index"), 3000);
    } catch (err) {
      toast.error(err.message || "Erro no login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center min-h-screen bg-bgp p-4 sm:p-8">
      <Helmet>
        <title>PassaPraFrente</title>
      </Helmet>
      <ToastContainer />
      <div className="w-full max-w-4xl bg-bgs rounded-3xl shadow-xl overflow-hidden flex flex-col sm:flex-row p-4 sm:p-6">
        <div className="flex sm:hidden w-full bg-bgs flex-col items-center justify-center p-8">
          <img src={logo} alt="logo" className="w-48 h-48 mb-4" />
          <p className="text-txtp text-center text-lg">Entre vizinhos, tudo se</p>
          <p className="text-txtp text-center text-lg">Aproveita!</p>
        </div>
        <div className="hidden sm:flex sm:w-1/2 bg-bgs flex-col items-center justify-center p-8">
          <img src={logo} alt="logo" className="w-48 h-48 mb-4" />
          <p className="text-txtp text-center text-lg">Entre vizinhos, tudo se</p>
          <p className="text-txtp text-center text-lg">Aproveita!</p>
        </div>
        <div className="w-full sm:w-1/2 bg-white rounded-2xl px-6 py-6 sm:px-8 sm:py-8">
          <h2 className="text-2xl font-medium text-txtp mb-6">Bem-vindo de volta!</h2>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-txtp">Email:</label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="exemplo@email.com"
                      className="w-full px-3 py-2 border border-txtp rounded-md focus:outline-none focus:ring-1 focus:ring-txtp"
                    />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-txtp">Palavra-Passe:</label>
                    <div className="relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 border border-txtp rounded-md focus:outline-none focus:ring-1 focus:ring-txtp"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  <span
                    onClick={() => navigate("/recoverpass")}
                    className="text-sm text-txts hover:underline cursor-pointer"
                  >
                    Recuperar palavra-passe
                  </span>
                </div>
                <div className="mt-8 space-y-4">
                  <button
                    type="submit"
                    className="w-full text-white py-2 px-4 bg-btns hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </button>
                  <p className="text-center text-sm">
                    Novo aqui?{" "}
                    <span onClick={() => navigate("/signin")} className="text-txtp hover:underline cursor-pointer">
                      Criar Conta
                    </span>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../lib/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logoEmpresa.png";
import { useFormik } from "formik";
import { loginSchema } from "../../lib/schemas";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
        const userResponse = await fetch(`${BACKEND_URL}/api/protected-route`, {
          credentials: "include",
        });
        if (!userResponse.ok) throw new Error("Failed to get user information");
        const userData = await userResponse.json();
        dispatch(
          login({ user: { email: values.email, message: userData.message } })
        );
        navigate("/index");
      } catch (err) {
        toast.error("Login Falhou", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center min-h-screen bg-bgp p-4 sm:p-8">
      <Helmet>
        <title>PassaPraFrente</title>
      </Helmet>
      <ToastContainer />
      <div className="w-full max-w-4xl bg-bgs rounded-3xl shadow-xl overflow-hidden flex flex-col sm:flex-row p-4 sm:p-6">
        <div className="flex sm:hidden w-full bg-bgs flex-col items-center justify-center p-8">
          <div className="text-txtp mb-4">
            <img src={logo} alt="logo" className="w-48 h-48" />
          </div>
          <p className="text-txtp text-center text-lg">
            Entre vizinhos, tudo se
          </p>
          <p className="text-txtp text-center text-lg">Aproveita!</p>
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
        <div className="w-full sm:w-1/2 bg-white rounded-2xl px-6 py-6 sm:px-8 sm:py-8">
          <h2 className="text-2xl font-medium text-txtp mb-6">
            Bem-vindo de volta!
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-txtp"
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
                      : "border-txtp"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-txtp`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-txtp"
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
                  <p className="text-red-500 text-sm">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <a
                href="RecoverPass"
                className="text-sm text-txts hover:underline"
              >
                Alterar Palavra-Passe
              </a>
            </div>
            <div className="mt-8 space-y-4">
              <button
                type="submit"
                className="w-full text-white py-2 px-4 bg-btns hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#fff"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-50"
                      fill="#fff"
                      d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                    ></path>
                  </svg>
                ) : (
                  "Entrar"
                )}
              </button>
              <p className="text-center text-sm">
                Novo aqui?{" "}
                <a href="SignIn" className="text-txtp hover:underline">
                  Criar Conta
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../lib/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logoEmpresa.png";
import { useFormik } from "formik";
import { loginSchema } from "../../lib/form";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

// Backend URL from environment variable or default
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function Login() {
  const [error, setError] = useState("");
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
      const { email, password } = values;

      setError("");
      setIsLoading(true);

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        const userResponse = await fetch(`${BACKEND_URL}/api/protected-route`, {
          credentials: "include",
        });

        if (!userResponse.ok) {
          throw new Error("Failed to get user information");
        }

        const userData = await userResponse.json();

        dispatch(
          login({
            user: {
              email: values.email,
              message: userData.message,
            },
          })
        );

        // Show success notification

        navigate("/index");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#E0E5B6]">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-[#24251D] rounded-3xl shadow-xl overflow-hidden flex">
        <div className="hidden md:flex md:w-1/2 bg-[#24251D] flex-col items-center justify-center p-8">
          <div className="text-[#73802A] mb-4">
            <img src={logo} alt="logo" width={200} height={200} />
          </div>
          <p className="text-[#73802A] text-center text-lg">
            Entre vizinhos, tudo se
          </p>{" "}
          <p className="text-[#73802A] text-center text-lg">
            tudo se Aproveita!
          </p>
        </div>
        <div className="w-full md:w-1/2 bg-white rounded-2xl m-4 p-6">
          <h2 className="text-2xl font-medium text-[#73802A] mb-6">
            Bem-vindo de volta!
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
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
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
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
                className="text-sm text-[#ADADAD] hover:underline"
              >
                Alterar Palavra-Passe
              </a>
            </div>
            <div className="mt-8 space-y-4">
              <button
                type="submit"
                className="w-full text-white py-2 px-4 bg-[#d2b48c] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
              >
                Entrar
              </button>
              <p className="text-center text-sm">
                Novo aqui?{" "}
                <a href="SignIn" className="text-[#73802A] hover:underline">
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

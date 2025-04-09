import { useEffect, useState } from "react";
import logo from "../../images/logoEmpresa.png";
import { useFormik } from "formik";
import { SendEmailSchema } from "../../lib/schemas";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../../lib/authSlice";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("O email é obrigatório!");
    } else {
      setError("");
      // Aqui você pode adicionar a lógica para enviar o formulário
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: SendEmailSchema,
    onSubmit: async (values) => {
      const { email } = values;

      setError("");
      setIsLoading(true);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/users/activate-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
            credentials: "include",
          }
        );

        const data = await response.json();

        toast.success("Email enviado com sucesso!");

        if (!response.ok) {
          throw new Error(data.message || "Send Email failed");
        }

        // Show success notification
      } catch (err) {
        setError(err instanceof Error ? err.message : "Send Email failed");
        toast.error("Erro ao enviar o email!");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    console.log();
    dispatch(fetchUserInfo()); // Fetch user info on page load
  }, [isAuthenticated, dispatch, navigate]);

  if (!isAuthenticated) return null;
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#E0E5B6]">
      <ToastContainer />
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
            Confirmar Conta
          </h2>
          <p className="text-center mb-8 text-gray-800">
           O codigo de verificação foi enviado para:
            <br />
             {user.message.Email} 
            <br />
            
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#73802A]"
                  >
                    Introduza o Código aqui:
                  </label>
                  <input
                    type="number"
                    id="number"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border ${
                      formik.touched.code && formik.errors.code
                        ? "border-red-500"
                        : "border-[#73802A]"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]`}
                  />
                  {formik.touched.code && formik.errors.code && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.code}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <button
                  type="submit"
                  className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                >
                  Enviar
                </button>
                <p className="text-center text-sm">
                  <a href="/editaccount" className="text-[#73802A] hover:underline">
                    Voltar 
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

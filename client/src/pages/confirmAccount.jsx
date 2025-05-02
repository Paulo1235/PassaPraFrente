import { useEffect, useState } from "react";
import logo from "../images/logoEmpresa.png";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../lib/authSlice";
import { Undo2 } from "lucide-react";

import '../components/css/sidebar.css';
import '../index.css';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const ConfirmAccount = () => {
  const [loading, setIsLoading] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [activationToken, setActivationToken] = useState("");

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      activationCode: "",
    },
    // validationSchema: SendEmailSchema,
    onSubmit: async (values) => {
      // console.log("Enviando valores do form:", values);
      const activationCode = values.activationCode;

      setIsLoading(true);

      try {
        const response = await fetch(`http://localhost:5000/api/auth/activate-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-activation-token": activationToken, // <- token enviado no header
          },
          body: JSON.stringify({ activationCode }),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Código inválido");
        }

        toast.success("Conta verificada com sucesso!");
        setTimeout(() => {
          navigate("/account");
        }, 2000);

      } catch (err) {
        toast.error("Erro ao verificar o código!");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleSendEmail = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/send-activation-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.message.Email }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao enviar o email");
      }

      toast.success("Email enviado com sucesso!");
      setActivationToken(data.activationToken);
      setShowCodeForm(true);
    } catch (err) {

      toast.error("Erro ao enviar o email!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    dispatch(fetchUserInfo());
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
            Verificar Conta
          </h2>
          <p className="text-center mb-8 text-gray-800">
            O código de verificação foi enviado para:
            <br />
            {user.message.Email}
            <br />
          </p>

          {!showCodeForm && (
            <div className="mt-12 space-y-4">
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
              >
                Enviar Email
              </button>
            </div>
          )}

          {showCodeForm && (
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="activationCode"
                    className="block text-sm font-medium text-[#73802A]"
                  >
                    Código:
                  </label>
                  <input
                    type="text"
                    id="activationCode"
                    name="activationCode"
                    value={formik.values.activationCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border ${
                      formik.touched.activationCode && formik.errors.activationCode
                        ? "border-red-500"
                        : "border-[#73802A]"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A]`}
                  />
                  {formik.touched.activationCode && formik.errors.activationCode && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.activationCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-12 space-y-4 flex flex-col items-center">
                <button
                  type="submit"
                  disabled={loading}
                    // onClick={() => console.log("Botão clicado")}

                  className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                >
                  {loading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          )}

          <button
            type="button"
            className="flex items-center text-txts mt-6"
            onClick={() => navigate("/editaccount")}
          >
            <Undo2 className="mr-2" />
            <span>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAccount;
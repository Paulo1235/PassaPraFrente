import { useState } from "react";
import logo from "../../images/logoEmpresa.png";
import { useFormik } from "formik";
import { SendEmailSchema } from "../../lib/schemas";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PasswordReset() {
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: SendEmailSchema,
    onSubmit: async (values) => {
      const { email } = values;
      
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/users/send-email-password`,
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
        setTimeout(() => {
            navigate("/");
          }, 3000 )

        if (!response.ok) {
          throw new Error(data.message || "Send Email failed");
        }

        // Show success notification
      } catch (err) {
        toast.error("Erro ao enviar o email!");
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (loading) {
    return (
      <div className="flex bg-bgp h-screen justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
      </div>
    );
  }

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
            Recuperar palavra-passe
          </h2>
          <p className="text-center mb-8 text-gray-800">
            Vai ser enviado um email
            <br />
            com a nova palavra passe.
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#73802A]"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
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
              </div>

              <div className="mt-12 space-y-4">
                <button
                  type="submit"
                  className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                >
                  Enviar
                </button>
                <p className="text-center text-sm">
                  Tem conta?{" "}
                  <a href="/" className="text-[#73802A] hover:underline">
                    Clique Aqui!
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

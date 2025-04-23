import { useState } from "react";
import logo from "../../images/logoEmpresa.png";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import { UpdatePasswordSchema } from "../../lib/schemas";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setError] = useState("");

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: UpdatePasswordSchema,
    onSubmit: async (values) => {
      const { newPassword, confirmPassword } = values;
      setError("");
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/users/update-password`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPassword, confirmPassword }),
            credentials: "include",
          }
        );

        const data = await response.json();

        toast.success("Palavra-Passe alterada!");
        setTimeout(() => {
          navigate("/account");
        }, 3000);

        if (!response.ok) {
          toast.error(data.message);
          throw new Error(data.message || "Update Password failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Update Password failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex h-screen items-center justify-center bg-[#e2e5b9]">
      <ToastContainer />
      <div className="relative mx-auto flex w-full max-w-4xl overflow-hidden rounded-3xl bg-[#24251D] p-6 shadow-xl">
        {/* Left side with logo and tagline */}
        <div className="hidden md:flex md:w-1/2 bg-[#24251D] flex-col items-center justify-center p-8">
          <div className="text-[#73802A] mb-4">
            <img src={logo} alt="logo" width={200} height={200} />
          </div>
          <p className="text-[#73802A] text-center text-lg">
            Entre vizinhos, tudo se
          </p>
          <p className="text-[#73802A] text-center text-lg">Aproveita!</p>
        </div>

        {/* Right side with form */}
        <div className="w-3/5">
          <div className="rounded-2xl bg-white p-8">
            <h2 className="mb-8 text-2xl font-medium text-[#73802A]">
              Nova Palavra-Passe
            </h2>

            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-6">
                {/* Campo Nova Palavra-Passe */}
                <div className="space-y-2">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-[#73802A]"
                  >
                    Nova Palavra-Passe:
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-md border ${
                        formik.touched.newPassword && formik.errors.newPassword
                          ? "border-red-500"
                          : "border-[#73802A]"
                      } bg-white px-4 py-2 pr-10 text-gray-800 focus:border-[#73802A] focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Campo Confirmar Palavra-Passe */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-[#73802A]"
                  >
                    Confirmar Palavra-Passe:
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-md border ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#73802A]"
                      } bg-white px-4 py-2 pr-10 text-gray-800 focus:border-[#73802A] focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
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

                <button
                  type="submit"
                  className="w-full text-white py-2 px-4 bg-[#CAAD7E] hover:bg-[#c2a478] text-black font-medium rounded-md transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar"}
                </button>

                {err && (
                  <div className="text-center text-red-600 font-medium">
                    {err}
                  </div>
                )}

                <div className="mt-4 text-center flex justify-center">
                  <a href="/account" className="text-txts hover:underline">
                    Voltar
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
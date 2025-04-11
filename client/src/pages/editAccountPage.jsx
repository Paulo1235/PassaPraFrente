import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Sidebar from "../components/sideBar";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { EditAccountSchema } from "../lib/schemas";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const EditAccountPage = () => {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=120&width=120");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const result = await response.json();
        setUserData(result.message);
        if (result.message?.Url) {
          setProfileImage(result.message.Url); // Atualiza a imagem de perfil com a URL do backend
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();

    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, dispatch, navigate]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verifica o tamanho do arquivo antes de atualizar o estado
    if (file.size > MAX_FILE_SIZE) {
      toast.error("A imagem é demasiado grande. Max 10MB.");
      return;
    }

    // Converte o arquivo de imagem para base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result; // A URL base64 gerada
      setProfileImage(base64Image);
      formik.setFieldValue("imageUrl", base64Image); // Atualiza o valor de imageUrl com base64
    };
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userData?.Nome || "",
      phone: userData?.Contacto || "",
      imageUrl: userData?.Url || "", // Garante que imageUrl nunca seja null
    },
    validationSchema: EditAccountSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:5000/api/users/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: values.name,
            contact: values.phone,
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar os dados.");
        }

        toast.success("Dados atualizados com sucesso!");
        setTimeout(() => {
          navigate("/account");
        }, 3000);
      } catch (error) {
        console.error("Erro ao submeter dados:", error);
        toast.error("Erro ao atualizar os dados.");
      }

      // Upload da imagem (se alterada)
      if (values.imageUrl && values.imageUrl !== userData?.Url) {
        try {
          const response = await fetch("http://localhost:5000/api/users/update-avatar", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ thumbnail: values.imageUrl }),
          });

          if (!response.ok) throw new Error("Erro ao atualizar a imagem.");

          toast.success("Imagem atualizada com sucesso!");
          setTimeout(() => {
            navigate("/account");
          }, 2000);
        } catch (error) {
          console.error("Erro ao submeter a foto:", error);
          toast.error("Erro ao atualizar a imagem.");
        }
      }
    },
  });

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">A carregar dados...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bgp">
      <Sidebar canAdd={true} Home={true} Account={true} LogOut={false} />
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-medium text-txtp mb-6">Editar Conta</h1>
          <button className="flex items-center text-txts" onClick={() => navigate("/account")}>
            <Undo2 />
            <span>Voltar</span>
          </button>
        </div>

        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <div className="w-[175px] h-[175px] rounded-full overflow-hidden bg-[#e6c9b3]">
                <img
                  src={profileImage || "/placeholder.svg"}
                  className="object-cover w-full h-full"
                  alt="Foto de perfil"
                />
              </div>
              <input type="file" accept="image/*" className="hidden" id="profileImageInput" onChange={imageHandler} />
              <label htmlFor="profileImageInput" className="mt-2 text-sm text-txts text-center block cursor-pointer">
                Alterar Foto Perfil
              </label>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-txtp">
                Nome
              </label>
              <input
                id="name"
                type="text"
                {...formik.getFieldProps("name")}
                className={`w-full px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-1 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-txtp focus:ring-txtp"
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-txtp">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                {...formik.getFieldProps("phone")}
                className={`w-full px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-1 ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-txtp focus:ring-txtp"
                }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm">{formik.errors.phone}</p>
              )}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                type="button"
                className="w-1/2 px-6 py-2 text-l text-[#73802A] border border-[#73802A] rounded-md bg-bgp hover:bg-[#e8ecc9]"
                onClick={() => navigate("/NewPassword")}
              >
                Alterar Password
              </button>

              <button type="submit" className="w-1/2 px-6 py-2 text-xl text-white bg-btnp rounded-md transition-colors">
                Guardar
              </button>
            </div>

            {userData?.ConfirmarEmail !== 1 && (
              <div>
                <button
                  type="button"
                  className="w-1/2 px-6 py-2 text-l text-[#73802A] border border-[#73802A] rounded-md bg-bgp hover:bg-[#e8ecc9]"
                  onClick={() => navigate("/confirm-account")}
                >
                  Confirmar Conta
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditAccountPage;

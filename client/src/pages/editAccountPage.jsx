import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { EditAccountSchema } from "../lib/schemas";
import { Helmet } from "react-helmet";

import "../components/css/sidebar.css";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";

import pessoaIco from "../images/pessoaIco.svg";
import Sidebar from "../components/sideBar";
import NavbarAccount from "../components/navbarAccount"; // Importação adicionada

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const EditAccountPage = () => {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(pessoaIco);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edit"); // Estado para controlar a aba ativa

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const result = await response.json();
        setUserData(result.message);
        if (result.message?.Url) setProfileImage(result.message.Url);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const imageHandler = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("A imagem é demasiado grande. Max 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result;
      setProfileImage(base64Image);
      setFieldValue("imageUrl", base64Image);
    };
  };

  if (!userData) {
    return (
      <div className="flex bg-bgp h-screen justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bgp">
      <Helmet><title>Detalhes da Conta</title></Helmet>
      <ToastContainer />
      <Sidebar canAdd={true} Home={true} Account={true} LogOut={false} />
      <div className="flex-1 overflow-y-auto">
        {/* NavbarAccount adicionado aqui */}
        <NavbarAccount activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="p-10">
          <div className="mb-12 md:mt-3 mt-5">
            <h1 className="text-2xl font-medium text-txtp mb-6">Detalhes da Conta</h1>
          </div>

          <div className="max-w-md mx-auto">
            <Formik
              enableReinitialize
              initialValues={{
                name: userData?.Nome || "",
                phone: userData?.Contacto || "",
                imageUrl: userData?.Url || "",
              }}
              validationSchema={EditAccountSchema}
              onSubmit={async (values) => {
                try {
                  const res = await fetch("http://localhost:5000/api/users/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ name: values.name, contact: values.phone }),
                  });

                  if (!res.ok) throw new Error("Erro ao atualizar os dados.");
                  toast.success("Dados atualizados com sucesso!");
                } catch {
                  toast.error("Erro ao atualizar os dados.");
                }

                if (values.imageUrl && values.imageUrl !== userData?.Url) {
                  try {
                    const imgRes = await fetch("http://localhost:5000/api/users/update-avatar", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ thumbnail: values.imageUrl }),
                    });

                    if (!imgRes.ok) throw new Error();
                    toast.success("Imagem atualizada com sucesso!");
                  } catch {
                    toast.error("Erro ao atualizar a imagem.");
                  }
                }

                setTimeout(() => navigate("/account"), 3000);
              }}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-4">
                  <div className="flex flex-col items-center mb-10">
                    <div className="relative">
                      <div className="w-[175px] h-[175px] rounded-full overflow-hidden bg-btnp">
                        <img
                          src={profileImage || "/placeholder.svg"}
                          className="object-cover w-full h-full"
                          alt="Foto de perfil"
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="profileImageInput"
                        onChange={(e) => imageHandler(e, setFieldValue)}
                      />
                      <label htmlFor="profileImageInput" className="mt-2 text-sm text-txts text-center block cursor-pointer">
                        Alterar Foto Perfil
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-txtp">Nome</label>
                    <Field
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-1 border-txtp"
                    />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-txtp">Telefone</label>
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-1 border-txtp"
                    />
                    <ErrorMessage name="phone" component="p" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => navigate("/NewPassword")}
                      className="w-1/2 px-6 py-2 text-l text-[#73802A] border border-[#73802A] rounded-md bg-bgp hover:bg-[#e8ecc9]"
                    >
                      Alterar Password
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 px-6 py-2 text-xl text-white bg-btnp rounded-md transition-colors"
                    >
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
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAccountPage;
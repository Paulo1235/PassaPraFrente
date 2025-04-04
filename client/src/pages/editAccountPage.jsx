import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Sidebar from "../components/sideBar";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string().required("O nome é obrigatório"),
  phone: Yup.string().required("O telefone é obrigatório"),
  address: Yup.string().required("A morada é obrigatória"),
});

const EditAccountPage = () => {
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=120&width=120"
  );

  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "Artur Ramalho",
      phone: "912 376 678",
      address: "Rua das 12 Casas nº14",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      console.log("Dados salvos:", values);
    },
  });

  return (
    <div className="flex h-screen bg-bgp">
      <Sidebar canAdd={true} Home={true} Account={true} LogOut={false} />

      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-medium text-txtp mb-6">Editar Conta</h1>
          <button
            className="flex items-center text-txts"
            onClick={() => navigate("/account")}
          >
            <Undo2 />
            <span>Voltar</span>
          </button>
        </div>

        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <div className="w-[175px] h-[175px] rounded-full overflow-hidden bg-[#e6c9b3]">
                <img
                  src={profileImage}
                  className="object-cover w-full h-full"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profileImageInput"
                onChange={handleImageChange}
              />
              <label
                htmlFor="profileImageInput"
                className="mt-2 text-sm text-txts text-center block cursor-pointer"
              >
                Alterar Foto Perfil
              </label>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-txtp"
              >
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
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-txtp"
              >
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

            <div className="space-y-1">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-txtp"
              >
                Morada
              </label>
              <input
                id="address"
                type="text"
                {...formik.getFieldProps("address")}
                className={`w-full px-3 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-1 ${
                  formik.touched.address && formik.errors.address
                    ? "border-red-500 focus:ring-red-500"
                    : "border-txtp focus:ring-txtp"
                }`}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-sm">{formik.errors.address}</p>
              )}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8 ">
              <button
                type="button"
                className="w-1/2 px-6 py-2 text-l text-[#73802A] border border-[#73802A] rounded-md bg-bgp hover:bg-[#e8ecc9]"
                onClick={() => navigate("/NewPassword")}
              >
                Alterar Password
              </button>

              <button
                type="submit"
                disabled={!formik.isValid}
                className={`w-1/2 px-6 py-2 text-xl text-white rounded-md transition-colors ${
                  !formik.isValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-btns hover:bg-[#c4a884]"
                }`}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccountPage;

import { useRef, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Undo2, Plus, X } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import { CreateSaleSchema } from "../../lib/schemas"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import "../../components/css/sidebar.css"
import "../../index.css"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function CreateSale() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Initial form values
  const initialValues = {
    title: "",
    description: "",
    price: 0,
    condition: "Novo",
    category: "Roupas",
    photos: [],
    photoUrls: [], // Array para armazenar as URLs base64
  }

  // Função para converter arquivo para base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsSubmitting(true)

      // Converter todas as fotos para base64
      const base64Promises = values.photos.map((photo) => convertToBase64(photo))
      const photoUrls = await Promise.all(base64Promises)

      // Criar o objeto de dados com as URLs base64
      const saleData = {
        title: values.title,
        description: values.description,
        price: values.price,
        condition: values.condition,
        category: values.category,
        thumbnails: photoUrls, // Enviar o array de URLs base64
      }

      const response = await fetch("http://localhost:5000/api/sales/create", {
        method: "POST",
        body: JSON.stringify(saleData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao criar a venda.")
      }

      toast.success("Venda criada com sucesso.")
      navigate("/index")
    } catch (error) {
      toast.error(error.message || "Erro desconhecido.")
      console.error("Erro ao enviar os dados:", error)
    } finally {
      setSubmitting(false)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-row">
      <ToastContainer />
      <div className="App w-screen flex flex-col">
        <div className="modal-sale w-full max-w-[1500px] h-auto min-h-[800px] bg-[#FFFAEE] mx-auto my-10 rounded-xl flex flex-col p-6">
          <div className="button-back flex flex-col items-end">
            <a href="/index">
              <button className="flex flex-row gap-2 items-center hover:underline">
                <Undo2 className="h-5 w-5" />
                <span>Voltar</span>
              </button>
            </a>
          </div>

          <h1 className="text-3xl font-medium text-[#CAAD7E] text-center my-6">
            Adicionar Venda
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={CreateSaleSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form className="w-full">
                <p className="text-center text-sm text-gray-500 mb-2">
                Mínimo 1 Foto, Máximo 3
                {values.photos.length > 0 && ` (${values.photos.length}/3)`}
              </p>
              
              {errors.photos && touched.photos && (
                <p className="text-red-500 text-center text-sm mb-4">
                  {errors.photos}
                </p>
              )}
              
              <div className="images flex flex-row gap-4 justify-center flex-wrap mb-10">
                {values.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-white rounded-md overflow-hidden border border-gray-200"
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      width={200}
                      height={200}
                      alt={`Product image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                      onClick={() => {
                        const newPhotos = [...values.photos];
                        newPhotos.splice(index, 1);
                        setFieldValue("photos", newPhotos);
                      }}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              
                {values.photos.length < 3 && (
                  <div
                    className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-gray-100 rounded-md flex items-center justify-center border border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <Plus className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                  
                      if (file.size > MAX_FILE_SIZE) {
                        toast.error("Imagem demasiado grande. Máx 10MB.");
                        return;
                      }
                  
                      if (values.photos.length >= 3) {
                        toast.error("Máximo de 3 fotos permitido.");
                        return;
                      }
                  
                      const newPhotos = [...values.photos, file];
                      setFieldValue("photos", newPhotos);
                    }
                  }}
                />
              </div>
              

                <div className="form-container space-y-6 max-w-3xl mx-auto w-full">
                  <div className="form-group">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-2"
                    >
                      Título:
                    </label>
                    <Field
                      id="title"
                      name="title"
                      type="text"
                      className={`w-full p-2 border ${
                        errors.title && touched.title
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-2"
                    >
                      Descrição:
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      className={`w-full p-2 border ${
                        errors.description && touched.description
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md min-h-[100px]`}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium mb-2"
                      >
                        Valor:
                      </label>
                      <div className="relative">
                        <Field
                          id="price"
                          name="price"
                          type="number"
                          className={`w-full p-2 border ${
                            errors.price && touched.price
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md pl-8`}
                        />
                        <span className="absolute left-3 top-2.5">€</span>
                      </div>
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="condition"
                        className="block text-sm font-medium mb-2"
                      >
                        Condição:
                      </label>
                      <Field
                        as="select"
                        id="condition"
                        name="condition"
                        className={`w-full p-2 border ${
                          errors.condition && touched.condition
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md appearance-none bg-white`}
                      >
                        <option value="Novo">Novo</option>
                        <option value="Quase Novo">Quase Novo</option>
                        <option value="Usado">Usado</option>
                      </Field>
                      <ErrorMessage
                        name="condition"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium mb-2"
                    >
                      Categoria:
                    </label>
                    <Field
                      as="select"
                      id="category"
                      name="category"
                      className={`w-full p-2 border ${
                        errors.category && touched.category
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md appearance-none bg-white`}
                    >
                      <option value="Calçado">Calçado</option>
                      <option value="Acessórios">Acessórios</option>
                      <option value="Outros">Outros</option>
                      <option value="Roupas">Roupas</option>
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-center mt-10">
                    <button
                      type="submit"
                      className="bg-[#CAAD7E] rounded-lg px-8 py-3 text-white font-medium hover:bg-[#b99c6f] transition-colors"
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

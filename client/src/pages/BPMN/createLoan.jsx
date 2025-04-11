import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Undo2, Plus, X, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CreateLoanSchema } from "../../lib/schemas";

export default function CreateLoan() {
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // Initial form values
  const initialValues = {
    title: "Furadeira elétrica Hilti-TE 70-ATC AVR. 110V",
    description:
      "Potente para furar paredes com opção martelo para furar os tijolos mais rápido e preciso",
    price: 5,
    condition: "Bastante Usado",
    category: "Ferramentas",
    startDate: "2025-03-28T12:30",
    endDate: "2025-03-28T14:30",
    // photos: [],
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append("condition", values.condition);
      formData.append("category", values.category);

      const response = await fetch("http://localhost:5000/api/loans/create", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar o empréstimo.");
      }

      toast.success("Empréstimo criado com sucesso.");
      setTimeout(() => {
        navigate("/index");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Erro desconhecido.");
      console.error("Erro ao enviar os dados:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="App w-screen flex flex-col">
        <ToastContainer />
        <div className="modal-sale w-full max-w-[1500px] h-auto min-h-[800px] bg-[#FFFAEE] mx-auto my-10 rounded-xl flex flex-col p-6">
          <div className="button-back flex flex-col items-end">
            <button className="flex flex-row gap-2 items-center hover:underline">
              <Undo2 className="h-5 w-5" />
              <span>Voltar</span>
            </button>
          </div>

          <h1 className="text-3xl font-medium text-[#CAAD7E] text-center my-6">
            Adicionar Empréstimo
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={CreateLoanSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form className="w-full">
                {/* <p className="text-center text-sm text-gray-500 mb-2">
                                    Mínimo 1 Foto, Máximo 3{" "}
                                    {values.photos.length > 0 &&
                                        ` (${values.photos.length}/3)`}
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
                                                src={photo || "/placeholder.svg"}
                                                alt={`Product image ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                                                onClick={() => {
                                                    const newPhotos = [...values.photos];
                                                    URL.revokeObjectURL(newPhotos[index]);
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

                                                if (values.photos.length >= 3) {
                                                    alert("Máximo de 3 fotos permitido.");
                                                    return;
                                                }

                                                const imageUrl = URL.createObjectURL(file);
                                                setFieldValue("photos", [...values.photos, imageUrl]);
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                </div> */}

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
                      htmlFor="startDate"
                      className="block text-sm font-medium mb-2"
                    >
                      Data Início:
                    </label>
                    <div className="relative">
                      <Field
                        id="startDate"
                        name="startDate"
                        type="datetime-local"
                        className={`w-full p-2 border ${
                          errors.startDate && touched.startDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                      />
                      {/* <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                    </div>
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium mb-2"
                    >
                      Data Fim:
                    </label>
                    <div className="relative">
                      <Field
                        id="endDate"
                        name="endDate"
                        type="datetime-local"
                        className={`w-full p-2 border ${
                          errors.endDate && touched.endDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                      />
                      {/* <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                    </div>
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
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
                      <option value="Ferramentas">Ferramentas</option>
                      <option value="Eletrônicos">Eletrônicos</option>
                      <option value="Esportes">Esportes</option>
                      <option value="Livros">Livros</option>
                      <option value="Outros">Outros</option>
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

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Undo2, Plus, X } from "lucide-react";
import { CreateDrawSchema } from "../../lib/schemas";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import "../../components/css/sidebar.css";
import "../../index.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function EditDraw() {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const convertBase64ToFile = (base64, fileName) => {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
  
    return new File([u8arr], fileName, { type: mime })
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/giveaways/id/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();
        // console.log(result.message);
        setData(result.message); // Ajusta conforme estrutura do retorno
        if (result.message?.Imagens?.length > 0) {
          const photoFiles = await result.message.Imagens.map((img, index) =>
            convertBase64ToFile(img, `foto${index + 1}.jpg`)          
          )
          result.message.PhotosAsFiles = await Promise.all(photoFiles)
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setIsLoading(false);
      }
    };

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    fetchData();
  }, [isAuthenticated, dispatch, navigate, id]);

  if (!isAuthenticated) return null;

  const handleSubmit = async (values) => {
    try {
      // Converter todas as fotos para base64
      const base64Promises = values.photos.map((photo) => convertToBase64(photo))
      const photoUrls = await Promise.all(base64Promises)


      const response = await fetch(
        `http://localhost:5000/api/giveaways/id/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            value: values.price,
            condition: values.condition,
            category: values.category,
            startDate: values.startDate,
            endDate: values.endDate,
            thumbnails: photoUrls,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o sorteio.");
      }

      const result = await response.json();

      toast.success("Sorteio atualizado com sucesso!");
      setTimeout(() => {
        navigate("/index");
      }, 2000);
    } catch (error) {
      console.error("Erro ao submeter dados:", error);
      toast.error("Erro ao atualizar o sorteio.");
    }
  };

  const pickWinner = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/winner-giveaway/create/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      // console.log(data.message);
      if (data.message == "Vencedor do sorteio criado com sucesso.") {
        toast.success("Vencedor do sorteio criado com sucesso!");
        setTimeout(() => {
          navigate("/index");
        }, 2000);
      }else
      {
        toast.error(data.message);
        setTimeout(() => {
          navigate("/index");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex bg-bgp h-screen justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
      </div>
    );
  }

  const initialValues = {
    title: data?.Titulo || "",
    description: data?.Descricao || "",
    price: data?.Valor || "",
    condition: data?.Condicao || "Como novo",
    category: data?.NomeCategoria || "Outros",
    startDate: data?.DataInicio
      ? new Date(data.DataInicio).toISOString().slice(0, 16)
      : "", // formatar para datetime-local
    endDate: data?.DataFim
      ? new Date(data.DataFim).toISOString().slice(0, 16)
      : "",
      photos: data?.PhotosAsFiles || [], // Ainda precisas tratar isto se estiveres a lidar com imagens reais
  };

  return (
    <div className="flex flex-row min-h-screen bg-[#FFFAEE]">
      <ToastContainer />
      <div className="App w-screen flex flex-col">
        <div className="modal-sale w-full max-w-[1500px] h-auto min-h-[800px] bg-[#FFFAEE] mx-auto my-10 rounded-xl flex flex-col p-6">
          <div className="button-back flex flex-col items-end">
            <a href="/account">
              <button className="flex flex-row gap-2 items-center hover:underline">
                <Undo2 className="h-5 w-5" />
                <span>Voltar</span>
              </button>
            </a>
          </div>

          <h1 className="text-3xl font-medium text-[#CAAD7E] text-center my-6">
            Editar Sorteio
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={CreateDrawSchema}
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

                  <div className="form-group">
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium mb-2"
                    >
                      Data Início:
                    </label>
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
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <option value="Brinquedos">Brinquedos</option>
                      <option value="Eletrónicos">Eletrónicos</option>
                      <option value="Ferramentas">Ferramentas</option>
                      <option value="Mobilia">Mobilia</option>
                      <option value="Roupas">Roupas</option>
                      </Field>
                      <ErrorMessage
                        name="category"
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
                        <option value="Como novo">Como novo</option>
                        <option value="Bom Estado">Bom Estado</option>
                        <option value="Usado">Usado</option>
                      </Field>
                      <ErrorMessage
                        name="condition"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-row gap-4 justify-between mt-10">
                    <div className="flex justify-center mt-10">
                      <button
                        type="submit"
                        className="bg-[#CAAD7E] rounded-lg px-8 py-3 text-white font-medium hover:bg-[#b99c6f] transition-colors"
                      >
                        Editar Publicação
                      </button>
                    </div>
                    <div className="flex justify-center mt-10">
                      <button
                        type="button"
                        onClick={pickWinner}
                        className="bg-[#CAAD7E] rounded-lg px-8 py-3 text-white font-medium hover:bg-[#b99c6f] transition-colors"
                      >
                        Sortear Vencedor
                      </button>
                    </div>
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

import { useEffect, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Undo2, ArrowRight, ShoppingBag, Image as ImageIcon } from "lucide-react"
import { CreateProposalSaleSchema } from "../../lib/schemas"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export default function VendaProposta() {
  const { id } = useParams()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [data, setData] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(`http://localhost:5000/api/sales/id/${id}`, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       credentials: "include",
    //     })
    //     const result = await response.json()
    //     console.log(result.message)
    //     setData(result.message)
    //     setIsLoading(false)
    //   } catch (error) {
    //     console.error("Erro ao buscar dados:", error)
    //     setIsLoading(false)
    //   }
    // }
    // if (!isAuthenticated) {
    //   navigate("/")
    //   return
    // }
    // fetchData()
  }, [isAuthenticated, navigate, id])

  const handleSubmit = async (values) => {
    // Código de submissão existente
    console.log(values)
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8E8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CAAD7E]"></div>
      </div>
    )

  const initialValues = {
    price: data?.Valor || 0, // ou 0 se preferires
  }

  // Imagem do produto - usar a real quando disponível ou placeholder
  const productImage = data?.ImagemURL || null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E8] to-[#FFFAEE] py-8 px-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#CAAD7E] px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Proposta de Venda</h1>
            <a href="/index" className="flex items-center gap-2 text-white hover:text-[#FFF8E8] transition-colors">
              <Undo2 className="h-5 w-5" />
              <span className="hidden sm:inline">Voltar</span>
            </a>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={CreateProposalSaleSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form className="w-full">
                  <div className="space-y-6">
                    {/* Produto Info Card */}
                    <div className="bg-[#FFF8E8] rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <ShoppingBag className="h-6 w-6 text-[#CAAD7E]" />
                        <h2 className="text-xl font-semibold text-[#8A7B61]">Detalhes do Produto</h2>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Imagem do Produto */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                          <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm aspect-square">
                            {productImage ? (
                              <img
                                src={productImage || "/placeholder.svg"}
                                alt={data?.Titulo || "Imagem do produto"}
                                width={300}
                                height={300}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <ImageIcon className="h-16 w-16 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Detalhes do Produto */}
                        <div className="w-full md:w-2/3 space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Título</h3>
                            <p className="text-lg font-medium text-gray-800">{data?.Titulo || "teste"}</p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                            <p className="text-gray-700">{data?.Descricao || "teste"}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Condição</h3>
                              <p className="text-gray-700">{data?.Condicao || "teste"}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
                              <p className="text-gray-700">{data?.NomeCategoria || "teste"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Proposta Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-[#8A7B61] mb-4">A sua Proposta</h2>

                      <p className="text-gray-600 mb-6 italic">
                        Ao enviar esta proposta, o comprador poderá aceitar ou recusar o preço oferecido.
                      </p>

                      <div className="form-group">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                          Valor da Proposta:
                        </label>
                        <div className="relative">
                          <Field
                            id="price"
                            name="price"
                            type="number"
                            className={`w-full p-3 border ${
                              errors.price && touched.price ? "border-red-500" : "border-gray-300"
                            } rounded-lg pl-10 text-lg focus:ring-2 focus:ring-[#CAAD7E] focus:border-[#CAAD7E] outline-none transition-all`}
                          />
                          <span className="absolute left-4 top-3.5 text-lg font-medium text-gray-500">€</span>
                        </div>
                        <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div className="flex justify-center pt-4">
                      <button
                        type="submit"
                        className="bg-[#CAAD7E] rounded-lg px-8 py-3.5 text-white font-medium hover:bg-[#b99c6f] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                      >
                        <span>Enviar Proposta</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Todas as propostas são revisadas antes de serem enviadas ao comprador.
        </p>
      </div>
    </div>
  )
}

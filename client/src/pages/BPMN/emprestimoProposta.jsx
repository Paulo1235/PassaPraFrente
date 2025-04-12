"use client"

import { useEffect, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Undo2, ArrowRight, ShoppingBag, Image as ImageIcon } from "lucide-react" // Import ImageIcon
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { ToastContainer } from "react-toastify"

// Schema de validação atualizado para incluir datas
const CreateProposalSaleSchema = Yup.object().shape({
  price: Yup.number()
    .required("O preço é obrigatório")
    .positive("O preço deve ser positivo")
    .typeError("O preço deve ser um número"),
  dataInicio: Yup.date().required("A data de início é obrigatória").typeError("Data inválida"),
  dataFim: Yup.date()
    .required("A data de fim é obrigatória")
    .min(Yup.ref("dataInicio"), "A data de fim deve ser posterior à data de início")
    .typeError("Data inválida"),
})

export default function EmprestimoProposta() {
  const { id } = useParams()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [data] = useState(null)
  const productImage = data?.ImagemURL || null // Define productImage as null or assign a valid image URL
  useDispatch()
  const navigate = useNavigate()
  const [isLoading] = useState(false)

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

  // Função para formatar data para o formato do input date
  const formatDateForInput = (date) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split("T")[0]
  }

  // Função para obter data atual formatada
  const getCurrentDate = () => {
    return formatDateForInput(new Date())
  }

  // Função para obter data futura (7 dias)
  const getFutureDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return formatDateForInput(date)
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8E8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CAAD7E]"></div>
      </div>
    )

  const initialValues = {
    price: data?.Valor || 0,
    dataInicio: "2025-04-12T10:30",
    dataFim: "2025-04-19T10:30",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E8] to-[#FFFAEE] py-8 px-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#CAAD7E] px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Proposta de Emprestimo</h1>
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
              {({ errors, touched }) => (
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
                        Ao enviar esta proposta, o comprador poderá aceitar ou recusar os termos oferecidos.
                      </p>

                      <div className="space-y-6">
                        {/* Preço */}
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

                        {/* Datas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Data Início */}
                          <div className="form-group">
                            <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-2">
                              Data de Início:
                            </label>
                            <div className="relative">
                              <Field
                                id="dataInicio"
                                name="dataInicio"
                                type="datetime-local" // ✅ CORRETO
                                className={`w-full p-3 border ${
                                  errors.dataInicio && touched.dataInicio ? "border-red-500" : "border-gray-300"
                                } rounded-lg pr-10 focus:ring-2 focus:ring-[#CAAD7E] focus:border-[#CAAD7E] outline-none transition-all`}
                              />
                            </div>
                            <ErrorMessage name="dataInicio" component="div" className="text-red-500 text-sm mt-1" />
                          </div>

                          {/* Data Fim */}
                          <div className="form-group">
                            <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-2">
                              Data de Fim:
                            </label>
                            <div className="relative">
                              <Field
                                id="dataFim"
                                name="dataFim"
                                type="datetime-local" // ✅ CORRETO
                                className={`w-full p-3 border ${
                                  errors.dataFim && touched.dataFim ? "border-red-500" : "border-gray-300"
                                } rounded-lg pr-10 focus:ring-2 focus:ring-[#CAAD7E] focus:border-[#CAAD7E] outline-none transition-all`}
                              />
                            </div>
                            <ErrorMessage name="dataFim" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
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

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Undo2,
  ArrowRight,
  ShoppingBag,
  Image as ImageIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CreateProposalLoanSchema } from "../../lib/schemas";

import { formatDateProposal } from "../../lib/utils";

import "../../components/css/sidebar.css";
import "../../index.css";

const LoanProposal = () =>  {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/loans/id/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        setData(data.message);
      } catch (error) {}
    };

    fetchData();
  }, [isAuthenticated, navigate, id, dispatch]);

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/proposal-loans/create/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            price: values.price,
            newStartDate: values.dataInicio,
            newEndDate: values.dataFim,
          }),
        }
      );
      const data = await response.json();
      
      if (data.message === "Proposta de empréstimo criada com sucesso.") {
        toast.success("Proposta enviada com sucesso!");
        setTimeout(() => {
          navigate("/index");
        }, 5000);
      } else {
        toast.error("Erro ao enviar proposta. Tente novamente mais tarde.");
        setTimeout(() => {
          navigate("/index");
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const initialValues = {
    price: data?.Valor || 0,
    dataInicio: formatDateProposal(data?.DataInicio) || "",
    dataFim: formatDateProposal(data?.DataFim) || "",
  };

  if (!isAuthenticated) return null;

  if (isLoading)
    return (
      <div className="flex bg-bgp h-screen justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#E0E5B6] py-8 px-4 font-sans">
      <Helmet>
        <title>Proposta de Emprestimo</title>
      </Helmet>
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Header sem quadrado branco */}
        <div className="bg-[#24251D] text-[#73802A] px-6 py-4 flex justify-between items-center rounded-2xl">
          <h1 className="text-2xl font-bold ">Proposta de Empréstimo</h1>
          <a
            href="/index"
            className="flex items-center gap-2 text-white hover:text-[#FFF8E8] transition-colors"
          >
            <Undo2 className="h-5 w-5 text-[#73802A]" />
            <span className="hidden sm:inline text-[#73802A]">Voltar</span>
          </a>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={CreateProposalLoanSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="w-full space-y-6">
                {/* Produto Info Card */}
                <div className="bg-[#FFFAEE] rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4 text-[#73802A] border-b border-[#24251D]">
                    <ShoppingBag className="h-6 w-6 mb-2" />
                    <h2 className="text-xl font-semibold mb-2">
                      Detalhes do Produto
                    </h2>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    {" "}
                    {/* Aqui foi adicionado justify-center e items-center */}
                    {/* Imagem do Produto */}
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200 aspect-square">
                        {data?.photos[0].Url ? (
                          <img
                            src={data?.photos[0].Url || null}
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
                    <div className="w-full md:w-2/3 space-y-4 text-[#4F4535]">
                      <div>
                        <h3 className="text-sm font-bold text-[#73802A]">
                          Título
                        </h3>
                        <p className="text-lg font-medium">
                          {data?.Titulo || "teste"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#73802A]">
                          Descrição
                        </h3>
                        <p>{data?.Descricao || "teste"}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-[#73802A]">
                            Condição
                          </h3>
                          <p>{data?.Condicao || "teste"}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-[#73802A]">
                            Categoria
                          </h3>
                          <p>{data?.NomeCategoria || "teste"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proposta Card */}
                <div className="bg-[#FFFAEE] rounded-xl p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-[#73802A] mb-4 border-b border-[#24251D] pb-2">
                    A sua Proposta
                  </h2>

                  <p className="text-gray-600 mb-6 italic">
                    Ao enviar esta proposta, o comprador poderá aceitar ou
                    recusar os termos oferecidos.
                  </p>

                  <div className="space-y-6">
                    {/* Preço */}
                    <div className="form-group">
                      <label
                        htmlFor="price"
                        className="block text-sm font-bold text-[#73802A] mb-2"
                      >
                        Valor da Proposta:
                      </label>
                      <div className="relative">
                        <Field
                          id="price"
                          name="price"
                          type="number"
                          className={`w-full p-3 border ${
                            errors.price && touched.price
                              ? "border-red-500"
                              : "border-[#73802A]"
                          } rounded-lg pl-10 text-lg focus:ring focus:ring-[#CAAD7E]/50 focus:border-[#CAAD7E] outline-none transition duration-300`}
                        />
                        <span className="absolute left-4 top-3.5 text-lg font-medium text-gray-500">
                          €
                        </span>
                      </div>
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label
                          htmlFor="dataInicio"
                          className="block text-sm font-bold text-[#73802A] mb-2"
                        >
                          Data de Início:
                        </label>
                        <Field
                          id="dataInicio"
                          name="dataInicio"
                          type="datetime-local"
                          className={`w-full p-3 border ${
                            errors.dataInicio && touched.dataInicio
                              ? "border-red-500"
                              : "border-[#73802A]"
                          } rounded-lg focus:ring focus:ring-[#CAAD7E]/50 focus:border-[#CAAD7E] outline-none transition-all`}
                        />
                        <ErrorMessage
                          name="dataInicio"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="form-group">
                        <label
                          htmlFor="dataFim"
                          className="block text-sm font-bold text-[#73802A] mb-2"
                        >
                          Data de Fim:
                        </label>
                        <Field
                          id="dataFim"
                          name="dataFim"
                          type="datetime-local"
                          className={`w-full p-3 border ${
                            errors.dataFim && touched.dataFim
                              ? "border-red-500"
                              : "border-[#73802A]"
                          } rounded-lg focus:ring focus:ring-[#CAAD7E]/50 focus:border-[#CAAD7E] outline-none transition-all`}
                        />
                        <ErrorMessage
                          name="dataFim"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de Submissão */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="bg-[#CAAD7E] rounded-lg px-8 py-3.5 text-white font-medium hover:bg-[#b99c6f] transition transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <span>Enviar Proposta</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Todas as propostas são revisadas antes de serem enviadas ao comprador.
        </p>
      </div>
    </div>
  );
}

export default LoanProposal;	
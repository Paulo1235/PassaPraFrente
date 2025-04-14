"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Modal from "../components/review"
import Footer from "../components/footer"
import Sidebar from "../components/sideBar"

export default function ReviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { id, category } = useParams();

  // Open modal automatically when page loads
  useEffect(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = () => {
    setIsModalOpen(false)
  }

return (
    <div className="bg-bgp min-h-screen flex flex-col">
        
        <div className="flex-grow p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Avaliação do Produto</h1>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Obrigado pela sua compra!</h2>
                    <p className="text-gray-600 mb-4">
                        Agradecemos a sua preferência e adoraríamos saber a sua opinião sobre o produto.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#CAAD7E] text-white px-4 py-2 rounded hover:bg-[#887455]"
                    >
                        Abrir Formulário de Avaliação
                    </button>
                </div>
            </div>
        </div>
        <Footer /> {/* Use seu componente Footer existente */}
        {isModalOpen && <Modal closeModal={closeModal} reviewId={id} category={category} />}
    </div>
)
}

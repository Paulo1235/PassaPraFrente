"use client"

import { useEffect, useState } from "react"
import { Undo2 } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { fetchUserInfo } from "../lib/authSlice"

//? CSS
import "../components/css/sidebar.css"
import "../index.css"

//? Components
import SideBar from "../components/sideBar"
import ProposalCard from "../components/proposalCard"
import Footer from "../components/footer"

export default function ProposalsPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [proposalData, setProposalData] = useState({
    sales: {
      title: "Vendas",
      items: [],
    },
    loans: {
      title: "Empréstimos",
      items: [],
    },
    raffles: {
      title: "Sorteios",
      items: [],
    },
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    // Só fetch do user info no início
    dispatch(fetchUserInfo())
  }, [isAuthenticated, dispatch, navigate])

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const userId = user?.message?.Utilizador_ID
        if (!userId) return

        // Fetch sales proposals
        const fetchSalesProposals = async () => {
          const responseSales = await fetch(`http://localhost:5000/api/proposal-sales/user/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })

          const dataSales = await responseSales.json()
          console.log("Sales proposal data:", dataSales)

          // If no sales data, initialize with empty arrays
          if (!dataSales?.message?.length) {
            return []
          }

          // Process each sale to get detailed information
          const salesPromises = dataSales.message.map(async (proposal) => {
            const saleId = proposal.Venda_ID
            const detailResponse = await fetch(`http://localhost:5000/api/sales/id/${saleId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            })

            const saleDetail = await detailResponse.json()
            return {
              proposal,
              saleDetail,
            }
          })

          const salesResults = await Promise.all(salesPromises)
          // Transform the sales data
          return salesResults.map((result) => {
            const { proposal, saleDetail } = result
            const item = saleDetail.message || {}
            
            // Use nullish coalescing operator (??) instead of logical OR (||)
            // This way, 0 will be preserved as 0 and not replaced with the default value
            console.log("Aceite value:", proposal.Aceite)
            
            return {
              title: item.Titulo || "Sem título",
              idVenda: proposal.Venda_ID || "ID",
              idEmprestimo: "ID",
              idSorteio: "ID",
              category: "Vendas",
              price: proposal.NovoValor ?? 0, // Use ?? instead of ||
              description: item.Descricao || "Sem descrição",
              status: proposal.Aceite ?? 0, // Use ?? instead of ||
              date: proposal.Data_Criacao || new Date().toISOString(),
            }
          })
        }

        // Fetch loan proposals
        const fetchLoanProposals = async () => {
          const responseLoans = await fetch(`http://localhost:5000/api/proposal-loans/user/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })

          const dataLoans = await responseLoans.json()
          console.log("Loans proposal data:", dataLoans)

          // If no loans data, initialize with empty arrays
          if (!dataLoans?.message?.length) {
            return []
          }

          // Process each loan to get detailed information
          const loansPromises = dataLoans.message.map(async (proposal) => {
            const loanId = proposal.Emprestimo_ID
            const detailResponse = await fetch(`http://localhost:5000/api/loans/id/${loanId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            })

            const loanDetail = await detailResponse.json()
            return {
              proposal,
              loanDetail,
            }
          })

          const loansResults = await Promise.all(loansPromises)

          // Transform the loans data
          return loansResults.map((result) => {
            const { proposal, loanDetail } = result
            const item = loanDetail.message || {}

            return {
              title: item.Titulo || "Sem título",
              idVenda: "ID",
              idEmprestimo: proposal.Emprestimo_ID || "ID",
              idSorteio: "ID",
              category: "Empréstimos",
              price: proposal.NovoValor ?? 0, // Use ?? instead of ||
              description: item.Descricao || "Sem descrição",
              status: proposal.Aceite ?? 0, // Use ?? instead of ||
              date: proposal.Data_Criacao || new Date().toISOString(),
              duration: item.Duracao || "Não especificado",
            }
          })
        }

        // Fetch both sales and loans data in parallel
        const [salesItems, loansItems] = await Promise.all([fetchSalesProposals(), fetchLoanProposals()])

        // Update state with the transformed data
        setProposalData((prev) => ({
          ...prev,
          sales: {
            ...prev.sales,
            items: salesItems,
          },
          loans: {
            ...prev.loans,
            items: loansItems,
          },
        }))
      } catch (error) {
        console.error("Error fetching shop data:", error)
      }
    }

    if (user?.message?.Utilizador_ID) {
      fetchShopData()
    }
  }, [user])

  // Combine all items for the "A Anunciar" section
  const announcingItems = [...proposalData.sales.items, ...proposalData.loans.items]

  return (
    <div className="flex h-screen bg-bgp overflow-hidden">
      <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Botão fixo no topo direito */}
        <button
          className="absolute top-4 right-4 sm:top-6 sm:right-10 flex items-center text-txts z-10"
          onClick={() => navigate("/account")}
        >
          <Undo2 />
          <span className="ml-1">Voltar</span>
        </button>

        {/* Cabeçalho */}
        <div className="p-6 sm:p-10 pb-0">
          <h1 className="text-2xl font-medium text-txtp">Propostas</h1>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          {/* A Anunciar */}
          <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto">
            <h2 className="text-gray-400 font-semibold mb-4">A Anunciar</h2>
          </div>

          {/* Divisória visível só em desktop */}
          <div className="hidden md:block w-px bg-[#8b9a41]" />

          {/* A Querer */}
          <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto flex flex-col">
            <h2 className="text-gray-400 font-semibold mb-4">A Querer</h2>
            {announcingItems.length > 0 ? (
              announcingItems.map((item, index) => <ProposalCard key={index} item={item} />)
            ) : (
              <p className="text-[#7b892f] font-semibold text-lg text-center">Nenhuma proposta ainda.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}

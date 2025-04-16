import { useEffect, useState } from "react"
import { Undo2 } from "lucide-react"
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
import { Helmet } from "react-helmet"
import ProposalCardAnnouce from "../components/proposalCardAnnouce"

export default function ProposalsPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const [proposalsMade, setProposalsMade] = useState({ sales: [], loans: [] })        // propostas que eu fiz
  const [proposalsReceived, setProposalsReceived] = useState({ sales: [], loans: [] }) // propostas que eu recebi

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/")
      return
    }
    dispatch(fetchUserInfo())
  }, [isAuthenticated, dispatch, navigate])

  // Fetch propostas que EU fiz (Efetuadas)
  useEffect(() => {
    const fetchProposalsMade = async () => {
      try {
        const userId = user?.message?.Utilizador_ID
        if (!userId) return

        const fetchSalesProposals = async () => {
          const response = await fetch(`http://localhost:5000/api/proposal-sales/user/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })

          const data = await response.json()
          if (!data?.message?.length) return []

          const results = await Promise.all(
            data.message.map(async (proposal) => {
              const detailRes = await fetch(`http://localhost:5000/api/sales/id/${proposal.Venda_ID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              })
              const saleDetail = await detailRes.json()
              const item = saleDetail.message || {}

              return {
                title: item.Titulo || "Sem título",
                idVenda: proposal.Venda_ID || "ID",
                idEmprestimo: "ID",
                idSorteio: "ID",
                category: "Vendas",
                price: proposal.NovoValor ?? 0,
                description: item.Descricao || "Sem descrição",
                status: proposal.Aceite ?? 0,
                date: proposal.Data_Criacao || new Date().toISOString(),
              }
            })
          )
          return results
        }

        const fetchLoanProposals = async () => {
          const response = await fetch(`http://localhost:5000/api/proposal-loans/user/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })

          const data = await response.json()
          if (!data?.message?.length) return []

          const results = await Promise.all(
            data.message.map(async (proposal) => {
              const detailRes = await fetch(`http://localhost:5000/api/loans/id/${proposal.Emprestimo_ID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              })
              const loanDetail = await detailRes.json()
              const item = loanDetail.message || {}

              return {
                title: item.Titulo || "Sem título",
                idVenda: "ID",
                idEmprestimo: proposal.Emprestimo_ID || "ID",
                idSorteio: "ID",
                category: "Empréstimos",
                price: proposal.NovoValor ?? 0,
                description: item.Descricao || "Sem descrição",
                status: proposal.Aceite ?? 0,
                date: proposal.Data_Criacao || new Date().toISOString(),
                duration: (() => {
                  const start = new Date(proposal.NovaDataInicio || new Date())
                  const end = new Date(proposal.NovaDataFim || new Date())
                  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
                  return `${diffDays} dia(s)`
                })(),
              }
            })
          )
          return results
        }

        const [salesItems, loanItems] = await Promise.all([
          fetchSalesProposals(),
          fetchLoanProposals()
        ])

        setProposalsMade({ sales: salesItems, loans: loanItems })
      } catch (error) {
        console.error("Erro ao buscar propostas efetuadas:", error)
      }
    }

    if (user?.message?.Utilizador_ID) {
      fetchProposalsMade()
    }
  }, [user])

  // Fetch propostas que EU RECEBI (Recebidas)
  useEffect(() => {
    const fetchProposalsReceived = async () => {
      try {
        const userId = user?.message?.Utilizador_ID
        if (!userId) return

        const fetchSalesProposalsAnnounce = async () => {
          const response = await fetch(`http://localhost:5000/api/proposal-sales/sales/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })

          const data = await response.json()
          if (!data?.message?.length) return []

          const results = await Promise.all(
            data.message.map(async (proposal) => {
              const detailRes = await fetch(`http://localhost:5000/api/sales/id/${proposal.Venda_ID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              })
              const saleDetail = await detailRes.json()
              const item = saleDetail.message || {}

              return {
                title: item.Titulo || "Sem título",
                idVenda: proposal.Venda_ID || "ID",
                idEmprestimo: "ID",
                idSorteio: "ID",
                category: "Vendas",
                price: proposal.NovoValor ?? 0,
                description: item.Descricao || "Sem descrição",
                status: proposal.Aceite ?? 0,
                date: proposal.Data_Criacao || new Date().toISOString(),
              }
            })
          )
          return results
        }

        const fetchLoanProposalsAnnounce = async () => {
          const response = await fetch(`http://localhost:5000/api/proposal-loans/loans/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })

          const data = await response.json()
          if (!data?.message?.length) return []

          const results = await Promise.all(
            data.message.map(async (proposal) => {
              const detailRes = await fetch(`http://localhost:5000/api/loans/id/${proposal.Emprestimo_ID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              })
              const loanDetail = await detailRes.json()
              const item = loanDetail.message || {}

              return {
                title: item.Titulo || "Sem título",
                idVenda: "ID",
                idEmprestimo: proposal.Emprestimo_ID || "ID",
                idSorteio: "ID",
                category: "Empréstimos",
                price: proposal.NovoValor ?? 0,
                description: item.Descricao || "Sem descrição",
                status: proposal.Aceite ?? 0,
                date: proposal.Data_Criacao || new Date().toISOString(),
                duration: (() => {
                  const start = new Date(proposal.NovaDataInicio || new Date())
                  const end = new Date(proposal.NovaDataFim || new Date())
                  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
                  return `${diffDays} dia(s)`
                })(),
              }
            })
          )
          return results
        }

        const [salesItems, loanItems] = await Promise.all([
          fetchSalesProposalsAnnounce(),
          fetchLoanProposalsAnnounce()
        ])

        setProposalsReceived({ sales: salesItems, loans: loanItems })
      } catch (error) {
        console.error("Erro ao buscar propostas recebidas:", error)
      }
    }

    if (user?.message?.Utilizador_ID) {
      fetchProposalsReceived()
    }
  }, [user])

  const announcingItems = [...proposalsMade.sales, ...proposalsMade.loans]           // Efetuadas
  const announcingItemsAnnounce = [...proposalsReceived.sales, ...proposalsReceived.loans] // Recebidas

  return (
    <div className="flex h-screen bg-bgp overflow-hidden">
      <Helmet>
        <title>Propostas</title>
      </Helmet>
      <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <button
          className="absolute top-4 right-4 sm:top-6 sm:right-10 flex items-center text-txts z-10"
          onClick={() => navigate("/account")}
        >
          <Undo2 />
          <span className="ml-1">Voltar</span>
        </button>

        <div className="p-6 sm:p-10 pb-0">
          <h1 className="text-2xl font-medium text-txtp">Propostas</h1>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto">
            <h2 className="text-gray-400 font-semibold mb-4 text-xl">Recebidas</h2>
            {announcingItemsAnnounce.length > 0 ? (
              announcingItemsAnnounce.map((item, index) => (
                <ProposalCardAnnouce key={index} item={item} />
              ))
            ) : (
              <p className="text-[#7b892f] font-semibold text-lg text-center">Nenhuma proposta ainda.</p>
            )}
          </div>

          <div className="hidden md:block w-px bg-[#8b9a41]" />

          <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto flex flex-col">
            <h2 className="text-gray-400 font-semibold mb-4 text-xl">Efetuadas</h2>
            {announcingItems.length > 0 ? (
              announcingItems.map((item, index) => (
                <ProposalCard key={index} item={item} />
              ))
            ) : (
              <p className="text-[#7b892f] font-semibold text-lg text-center">Nenhuma proposta ainda.</p>
            )}
          </div>
        </div>

        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}

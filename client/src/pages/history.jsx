import { useEffect, useState } from "react"
import { Search, Filter, ChevronDown, ChevronUp, Calendar } from "lucide-react"
import Footer from "../components/footer"
import Sidebar from "../components/sideBar"
import NavbarAccount from "../components/navbarAccount" // Importação adicionada

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("history") // Estado para controlar a aba ativa

  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  })

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Create an array to store all transactions
        let allTransactions = []

        // Fetch sales transactions
        try {
          const salesResponse = await fetch("http://localhost:5000/api/transaction-sales/user", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })

          if (salesResponse.ok) {
            const salesDataResponse = await salesResponse.json()
            console.log("Sales API Response:", salesDataResponse)

            // Check if the response has the expected structure
            if (salesDataResponse && salesDataResponse.success) {
              let salesData = []

              // Handle both array and single object responses
              if (Array.isArray(salesDataResponse.message)) {
                salesData = salesDataResponse.message
              } else if (salesDataResponse.message && typeof salesDataResponse.message === "object") {
                salesData = [salesDataResponse.message]
              }

              // Filter out any undefined or null items
              salesData = salesData.filter((item) => item)

              // Transform sales data to our transaction format
              const salesTransactions = salesData.map((sale) => ({
                date: sale.DataTransacao || sale.createdAt || new Date().toISOString(),
                description: sale.Titulo || sale.name || "Venda",
                amount: sale.ValorFinal || sale.value || 0,
                category: sale.NomeCategoria || sale.category || "Vendas",
                transactionType: "Compra", // Add transaction type
              }))

              allTransactions = [...allTransactions, ...salesTransactions]
            }
          } else {
            console.warn("Sales API returned an error:", salesResponse.status)
          }
        } catch (err) {
          console.error("Error fetching sales data:", err)
          // Continue with other API calls even if this one fails
        }

        // Fetch loans transactions
        try {
          const loansResponse = await fetch("http://localhost:5000/api/transaction-loans/user/user", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })

          if (loansResponse.ok) {
            const loansDataResponse = await loansResponse.json()
            console.log("Loans API Response:", loansDataResponse)

            // Check if the response has the expected structure
            if (loansDataResponse && loansDataResponse.success) {
              let loansData = []

              // Handle both array and single object responses
              if (Array.isArray(loansDataResponse.message)) {
                loansData = loansDataResponse.message
              } else if (loansDataResponse.message && typeof loansDataResponse.message === "object") {
                loansData = [loansDataResponse.message]
              }

              // Filter out any undefined or null items
              loansData = loansData.filter((item) => item)

              // Transform loans data to our transaction format
              const loansTransactions = loansData.map((loan) => ({
                date: loan.DataTransacao || loan.createdAt || new Date().toISOString(),
                description: loan.Titulo || loan.name || "Empréstimo",
                amount: loan.ValorFinal || loan.value || 0,
                category: loan.NomeCategoria || loan.category || "Empréstimos",
                transactionType: "Emprestimo", // Add transaction type
              }))

              allTransactions = [...allTransactions, ...loansTransactions]
            }
          } else {
            console.warn("Loans API returned an error:", loansResponse.status)
          }
        } catch (err) {
          console.error("Error fetching loans data:", err)
          // Continue with other API calls even if this one fails
        }

        // Fetch giveaways transactions
        try {
          const giveawaysResponse = await fetch("http://localhost:5000/api/winner-giveaway/user", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          })

          if (giveawaysResponse.ok) {
            const giveawaysDataResponse = await giveawaysResponse.json()
            console.log("Giveaways API Response:", giveawaysDataResponse)

            // Check if the response has the expected structure
            if (giveawaysDataResponse && giveawaysDataResponse.success) {
              let giveawaysData = []

              // Handle both array and single object responses
              if (Array.isArray(giveawaysDataResponse.message)) {
                giveawaysData = giveawaysDataResponse.message
              } else if (giveawaysDataResponse.message && typeof giveawaysDataResponse.message === "object") {
                giveawaysData = [giveawaysDataResponse.message]
              }

              // Filter out any undefined or null items
              giveawaysData = giveawaysData.filter((item) => item)

              // Transform giveaways data to our transaction format
              const giveawaysTransactions = giveawaysData.map((giveaway) => ({
                date: giveaway.DataTransacao || giveaway.createdAt || new Date().toISOString(),
                description: giveaway.Titulo || giveaway.name || "Sorteio",
                amount: giveaway.ValorFinal || giveaway.value || 0,
                category: giveaway.NomeCategoria || "Sorteios",
                transactionType: "Sorteio", // Add transaction type
              }))

              allTransactions = [...allTransactions, ...giveawaysTransactions]
            }
          } else {
            console.warn("Giveaways API returned an error:", giveawaysResponse.status)
          }
        } catch (err) {
          console.error("Error fetching giveaways data:", err)
          // Continue even if this API call fails
        }

        // Set transactions state with all collected transactions
        setTransactions(allTransactions)

        // If no transactions were found but no errors occurred, show a message
        if (allTransactions.length === 0) {
          setError("Nenhuma transação encontrada. Tente novamente mais tarde.")
        }
      } catch (err) {
        console.error("Error fetching transaction data:", err)
        setError("Erro ao carregar transações. Por favor, tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter((transaction) => {
    if (
      searchQuery &&
      !transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    if (dateFilter !== "all") {
      const today = new Date()
      const transactionDate = new Date(transaction.date)
      const diffTime = Math.abs(today.getTime() - transactionDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (dateFilter === "last7days" && diffDays > 7) return false
      if (dateFilter === "last30days" && diffDays > 30) return false
      if (dateFilter === "last90days" && diffDays > 90) return false
    }

    return true
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig) return 0

    if (sortConfig.key === "amount") {
      return sortConfig.direction === "asc" ? a.amount - b.amount : b.amount - a.amount
    }

    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }

    const aValue = a[sortConfig.key]?.toString().toLowerCase() || ""
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || ""

    if (sortConfig.direction === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  // Handle sort
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Data inválida"
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bgp">
      <Sidebar canAdd={true} Home={true} Account={true} LogOut={false} />
      
      <div className="flex flex-col flex-grow w-full md:ml-0">
        {/* NavbarAccount adicionado aqui */}
        <NavbarAccount activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Header */}
        <div className="pt-6 px-4">
          <h1 className="text-2xl font-semibold text-[#73802A] text-center">Histórico de Transações</h1>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 mt-6 w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por descrição"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center text-gray-600 hover:text-gray-800 bg-white px-3 py-2 rounded-md border border-gray-300 w-full sm:w-auto justify-center"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  <span>Filtros</span>
                </button>
              </div>
            </div>

            {/* Filter options */}
            {filterOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="sm:col-start-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
                  >
                    <option value="all">Todos os períodos</option>
                    <option value="last7days">Últimos 7 dias</option>
                    <option value="last30days">Últimos 30 dias</option>
                    <option value="last90days">Últimos 90 dias</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex-grow w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Carregando transações...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-[#73802A] text-white rounded-md hover:bg-[#5a6421] transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            ) : sortedTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Nenhuma transação encontrada.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("date")}
                      >
                        <div className="flex items-center">
                          <span>Data</span>
                          {sortConfig?.key === "date" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("transactionType")}
                      >
                        <div className="flex items-center">
                          <span>Tipo</span>
                          {sortConfig?.key === "transactionType" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("description")}
                      >
                        <div className="flex items-center">
                          <span>Descrição</span>
                          {sortConfig?.key === "description" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("amount")}
                      >
                        <div className="flex items-center">
                          <span>Preço</span>
                          {sortConfig?.key === "amount" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("category")}
                      >
                        <div className="flex items-center">
                          <span>Categoria</span>
                          {sortConfig?.key === "category" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(transaction.date)}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm">{transaction.transactionType}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="truncate max-w-[120px] sm:max-w-none">{transaction.description}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span>
                            {transaction.amount.toLocaleString("pt-PT", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            €
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default TransactionHistory
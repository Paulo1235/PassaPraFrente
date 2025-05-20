import { Helmet } from "react-helmet"
import { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"

//? CSS
import "../components/css/sidebar.css"
import "../index.css"

//? Components
import SideBar from "../components/sideBar"
import ContentMain from "../components/contentMain"
import Footer from "../components/footer"

const Main = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [shopData, setShopData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterLoading, setFilterLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Parse URL search params for filters
  const getInitialFilters = useCallback(() => {
    const searchParams = new URLSearchParams(location.search)
    const filters = {}

    if (searchParams.has("category")) {
      filters.category = searchParams.get("category")
    }

    if (searchParams.has("priceRange")) {
      filters.priceRange = searchParams.get("priceRange")
    }

    if (searchParams.has("condition")) {
      filters.condition = searchParams.get("condition")
    }

    if (searchParams.has("search")) {
      filters.search = searchParams.get("search")
    }

    return filters
  }, [location.search])

  const [activeFilters, setActiveFilters] = useState(getInitialFilters)

  useEffect(() => {
    const searchParams = new URLSearchParams()

    Object.entries(activeFilters).forEach(([key, value]) => {
      searchParams.set(key, value)
    })

    const newSearch = searchParams.toString()
    const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname

    // Use replace to avoid creating new history entries for every filter change
    navigate(newUrl, { replace: true })
  }, [activeFilters, location.pathname, navigate])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    const fetchShopData = async () => {
      try {
        setLoading(true)

        const responseSales = await fetch("http://localhost:5000/api/sales/available", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        const responseLoans = await fetch("http://localhost:5000/api/loans/available", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        const responseGiveaways = await fetch("http://localhost:5000/api/giveaways/available", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!responseSales.ok || !responseGiveaways.ok || !responseLoans.ok) {
          throw new Error("Failed to fetch shop data")
        }

        const dataSales = await responseSales.json()
        const dataLoans = await responseLoans.json()
        const dataGiveaways = await responseGiveaways.json()

        // For debugging - log the first item from each response to see the structure
        // if (dataSales.message && dataSales.message.length > 0) {
        //   console.log("Sample sales item:", dataSales.message[0])
        // }
        // if (dataLoans.message && dataLoans.message.length > 0) {
        //   console.log("Sample loans item:", dataLoans.message[0])
        // }
        // if (dataGiveaways.message && dataGiveaways.message.length > 0) {
        //   console.log("Sample giveaways item:", dataGiveaways.message[0])
        // }

        const transformItems = (items) => {
          return items.message.map((item) => {
            const itemCategory =
              item.NomeCategoria

            return {
              name: item.Titulo || item.titulo || item.title || "Sem título",
              description: item.Descricao || item.descricao || item.description || "Sem descrição",
              condition: item.Condicao || item.condicao || item.condition || "Sem condição",
              value: Number.parseFloat(item.Valor || item.valor || item.value || 0),
              idVenda: item.Venda_ID || item.venda_id || null,
              idEmprestimo: item.Emprestimo_ID || item.emprestimo_id || null,
              idSorteio: item.Sorteio_ID || item.sorteio_id || null,
              foto: item.photos || item.fotos || item.imagens || "",
              category: itemCategory || "Sem categoria",
            }
          })
        }

        const shopData = {
          sales: {
            title: "Compras/Vendas",
            items: transformItems(dataSales, "Compras", 0),
          },
          loans: {
            title: "Empréstimos",
            items: transformItems(dataLoans, "Empréstimos", 1),
          },
          giveaways: {
            title: "Sorteios",
            items: transformItems(dataGiveaways, "Sorteios", 2),
          },
        }
        setShopData(shopData)
      } catch (error) {
        console.error("Error fetching shop data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShopData()
  }, [isAuthenticated, dispatch, navigate])

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    // Don't trigger loading state for search to avoid flickering
    const isSearchFilter = filterType === "search"

    if (!isSearchFilter) {
      setFilterLoading(true)
    }

    // Check if the value is actually different from current
    if (value === "all") {
      if (activeFilters[filterType]) {
        const newFilters = { ...activeFilters }
        delete newFilters[filterType]
        setActiveFilters(newFilters)
      }
    } else if (activeFilters[filterType] !== value) {
      setActiveFilters({
        ...activeFilters,
        [filterType]: value,
      })
    }

    // Simulate filter loading effect (only for non-search filters)
    if (!isSearchFilter) {
      setTimeout(() => {
        setFilterLoading(false)
      }, 300)
    }
  }

  const clearAllFilters = () => {
    setFilterLoading(true)
    setActiveFilters({})

    // Simulate filter loading effect
    setTimeout(() => {
      setFilterLoading(false)
    }, 300)
  }

  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="flex bg-bgp h-screen justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
      </div>
    )
  }

  return (
    <div className="bg-bgp flex flex-col md:flex-row min-h-screen">
      <Helmet>
        <title>Loja{Object.keys(activeFilters).length > 0 ? " - Filtrado" : ""}</title>
      </Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />
      </div>

      {filterLoading ? (
        <div className="flex-1 flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7b892f]"></div>
        </div>
      ) : (
        <ContentMain
          shopData={shopData}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAllFilters={clearAllFilters}
        />
      )}
    </div>
  )
}

export default Main
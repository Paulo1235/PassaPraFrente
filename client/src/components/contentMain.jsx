import { useState, useEffect } from "react"
import Card from "./card"
import Footer from "./footer"
import { ChevronDown, Search, X, SlidersHorizontal, Tag } from "lucide-react"

//? CSS
import "../index.css"

const ContentMainSection = ({ title, items, activeFilters }) => {
  // Apply filters to the items
  const filteredItems = items.filter((item) => {
    // If no filters are active, show all items
    if (Object.keys(activeFilters).length === 0) return true

    // Check category filter - use item.category instead of section title
    if (
      activeFilters.category &&
      activeFilters.category !== "all" &&
      item.category.toLowerCase() !== activeFilters.category.toLowerCase()
    ) {
      return false
    }

    // Check price range filter
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange.split("-")
      if (min && item.value < Number.parseFloat(min)) return false
      if (max && max !== "max" && item.value > Number.parseFloat(max)) return false
    }

    // Check condition filter
    if (
      activeFilters.condition &&
      activeFilters.condition !== "all" &&
      item.condition.toLowerCase() !== activeFilters.condition.toLowerCase()
    ) {
      return false
    }

    // Check search query
    if (
      activeFilters.search &&
      !item.name.toLowerCase().includes(activeFilters.search.toLowerCase()) &&
      !item.description.toLowerCase().includes(activeFilters.search.toLowerCase())
    ) {
      return false
    }

    return true
  })

  if (Object.keys(activeFilters).length > 0 && filteredItems.length === 0) {
    return null
  }

  return (
    <div className="bg-bgp flex flex-col mb-8">
      <section className="mt-4 w-full px-4 md:px-6 lg:px-8">
        {/* Header da seção */}
        <h2 className="text-[#73802A] text-2xl md:text-3xl md:text-start text-center font-medium mb-4 md:mb-6">
          {title}
        </h2>

        {/* Grid de cards ou estado vazio */}
        {filteredItems.length === 0 ? (
          <div className="bg-bgp p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-center text-lg">Sem {title.toLowerCase()} disponíveis no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:place-items-start place-items-center">
            {filteredItems.map((item, index) => {
              return (
                <div key={`${item.idVenda || item.idEmprestimo || item.idSorteio || index}`} className="relative">
                  <Card
                    mainPage={true}
                    name={item.name}
                    description={item.description}
                    condition={item.condition}
                    value={item.value}
                    category={item.category}
                    image={item.foto}
                    idVenda={item.idVenda}
                    idEmprestimo={item.idEmprestimo}
                    idSorteio={item.idSorteio}
                  />
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

const FilterDropdown = ({ label, options, value, onChange, clearFilter, itemCounts = {} }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {value && (
          <button onClick={clearFilter} className="text-xs text-gray-500 hover:text-gray-700">
            Limpar
          </button>
        )}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>{value ? options.find((opt) => opt.value === value)?.label : "Selecionar"}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="py-1 overflow-auto text-base max-h-60">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                  value === option.value ? "bg-gray-100 font-medium" : ""
                } flex justify-between items-center`}
              >
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const ContentMain = ({ shopData, activeFilters = {}, onFilterChange, onClearAllFilters }) => {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(activeFilters.search || "")

  // Extract all items from all sections
  const allItems = Object.values(shopData).flatMap((section) => section.items)

  // Extract all unique categories from items
  const uniqueCategories = [...new Set(allItems.map((item) => item.category))]
    .filter((category) => category && category !== "Sem categoria") // Filter out empty or "Sem categoria"
    .sort() // Sort alphabetically

  // Add "Todas Categorias" at the beginning and "Sem categoria" at the end if it exists
  const hasSemCategoria = allItems.some((item) => item.category === "Sem categoria")

  // Count items per category
  const categoryCounts = allItems.reduce((counts, item) => {
    const category = item.category.toLowerCase()
    counts[category] = (counts[category] || 0) + 1
    counts["all"] = (counts["all"] || 0) + 1
    return counts
  }, {})

  const categories = [
    { value: "all", label: "Todas Categorias" },
    ...uniqueCategories.map((category) => ({
      value: category.toLowerCase(),
      label: category,
    })),
  ]

  // Add "Sem categoria" at the end if it exists
  if (hasSemCategoria) {
    categories.push({ value: "sem categoria", label: "Sem categoria" })
  }

  // Create price range options
  const priceRanges = [
    { value: "all", label: "Todos os Preços" },
    { value: "0-50", label: "Até 50€" },
    { value: "50-100", label: "50€ - 100€" },
    { value: "100-200", label: "100€ - 200€" },
    { value: "200-max", label: "Acima de 200€" },
  ]

  // Count items per price range
  const priceRangeCounts = allItems.reduce((counts, item) => {
    const value = item.value

    if (value < 50) {
      counts["0-50"] = (counts["0-50"] || 0) + 1
    } else if (value < 100) {
      counts["50-100"] = (counts["50-100"] || 0) + 1
    } else if (value < 200) {
      counts["100-200"] = (counts["100-200"] || 0) + 1
    } else {
      counts["200-max"] = (counts["200-max"] || 0) + 1
    }

    counts["all"] = (counts["all"] || 0) + 1
    return counts
  }, {})

  // Extract all unique conditions from items
  const uniqueConditions = [...new Set(allItems.map((item) => item.condition))]
    .filter((condition) => condition && condition !== "Sem condição")
    .sort()

  // Count items per condition
  const conditionCounts = allItems.reduce((counts, item) => {
    const condition = item.condition.toLowerCase()
    counts[condition] = (counts[condition] || 0) + 1
    counts["all"] = (counts["all"] || 0) + 1
    return counts
  }, {})

  const conditions = [
    { value: "all", label: "Todas as Condições" },
    ...uniqueConditions.map((condition) => ({
      value: condition.toLowerCase(),
      label: condition,
    })),
  ]

  // Add "Sem condição" at the end if it exists
  if (allItems.some((item) => item.condition === "Sem condição")) {
    conditions.push({ value: "sem condição", label: "Sem condição" })
  }

  const handleFilterChange = (filterType, value) => {
    if (onFilterChange) {
      onFilterChange(filterType, value)
    }
  }

  const clearFilter = (filterType) => {
    if (onFilterChange) {
      onFilterChange(filterType, "all")
    }
  }

  const clearAllFilters = () => {
    if (onClearAllFilters) {
      onClearAllFilters()
    }
    setSearchQuery("")
  }

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Apply search filter when user stops typing (with improved debounce)
  useEffect(() => {
    // Only set up the timer if the search query has changed from the active filter
    if (searchQuery !== activeFilters.search) {
      const timer = setTimeout(() => {
        if (searchQuery) {
          handleFilterChange("search", searchQuery)
        } else if (activeFilters.search) {
          clearFilter("search")
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    // Only update if they're different to avoid loops
    if (activeFilters.search !== searchQuery) {
      setSearchQuery(activeFilters.search || "")
    }
  }, [activeFilters.search])

  // Count total items after filtering
  const totalFilteredItems = Object.values(shopData).reduce((total, section) => {
    const filteredItems = section.items.filter((item) => {
      if (Object.keys(activeFilters).length === 0) return true

      // Check category filter - use item.category
      if (
        activeFilters.category &&
        activeFilters.category !== "all" &&
        item.category.toLowerCase() !== activeFilters.category.toLowerCase()
      ) {
        return false
      }

      if (activeFilters.priceRange) {
        const [min, max] = activeFilters.priceRange.split("-")
        if (min && item.value < Number.parseFloat(min)) return false
        if (max && max !== "max" && item.value > Number.parseFloat(max)) return false
      }

      if (
        activeFilters.condition &&
        activeFilters.condition !== "all" &&
        item.condition.toLowerCase() !== activeFilters.condition.toLowerCase()
      ) {
        return false
      }

      if (
        activeFilters.search &&
        !item.name.toLowerCase().includes(activeFilters.search.toLowerCase()) &&
        !item.description.toLowerCase().includes(activeFilters.search.toLowerCase())
      ) {
        return false
      }

      return true
    })

    return total + filteredItems.length
  }, 0)

  return (
    <div className="flex flex-col w-full">
      {/* Top search bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 md:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md mx-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar por nome ou descrição"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  clearFilter("search")
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            className="flex items-center text-gray-600 hover:text-gray-800 bg-white px-3 py-2 rounded-md border border-gray-300"
          >
            <SlidersHorizontal className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1 py-4 overflow-y-auto">

          {Object.values(shopData).map((section, index) => (
            <ContentMainSection
              key={`${section.title}-${index}`}
              title={section.title}
              items={section.items}
              activeFilters={activeFilters}
            />
          ))}

          {/* No results message */}
          {totalFilteredItems === 0 && Object.keys(activeFilters).length > 0 && (
            <div className="bg-bgp p-8 rounded-lg border border-gray-200 max-w-7xl mx-auto my-8 text-center">
              <p className="text-gray-600 text-lg mb-4">Nenhum item encontrado com os filtros selecionados.</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#73802A] text-white rounded-md hover:bg-[#5a6421] transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </main>

        {/* Filter sidebar - right side */}
        <aside
          className={`mt-2 fixed inset-y-0 right-0 z-30 w-64 bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isFilterSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:relative md:translate-x-0 md:shadow-none md:w-72 md:flex md:flex-col md:border-l md:border-gray-200 md:z-0`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-medium text-lg">Filtros</h3>
            <button
              onClick={() => setIsFilterSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <FilterDropdown
              label="Categoria"
              options={categories}
              value={activeFilters.category}
              onChange={(value) => handleFilterChange("category", value)}
              clearFilter={() => clearFilter("category")}
              itemCounts={categoryCounts}
            />

            <FilterDropdown
              label="Preço"
              options={priceRanges}
              value={activeFilters.priceRange}
              onChange={(value) => handleFilterChange("priceRange", value)}
              clearFilter={() => clearFilter("priceRange")}
              itemCounts={priceRangeCounts}
            />

            <FilterDropdown
              label="Condição"
              options={conditions}
              value={activeFilters.condition}
              onChange={(value) => handleFilterChange("condition", value)}
              clearFilter={() => clearFilter("condition")}
              itemCounts={conditionCounts}
            />

            {Object.keys(activeFilters).length > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 w-full px-4 py-2 bg-[#73802A] text-white rounded-md hover:bg-[#5a6421] transition-colors"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  )
}

export default ContentMain
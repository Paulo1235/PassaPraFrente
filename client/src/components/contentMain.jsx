import { useState, useEffect } from "react"
import Card from "./card"
import Footer from "./footer"
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'

//? CSS
import "../index.css"

const ContentMainSection = ({ title, items, activeFilters }) => {
  const filteredItems = items.filter((item) => {
    if (Object.keys(activeFilters).length === 0) return true

    if (activeFilters.category && activeFilters.category !== "all" &&
      item.category.toLowerCase() !== activeFilters.category.toLowerCase()) return false

    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange.split("-")
      if (min && item.value < Number.parseFloat(min)) return false
      if (max && max !== "max" && item.value > Number.parseFloat(max)) return false
    }

    if (activeFilters.condition && activeFilters.condition !== "all" &&
      item.condition.toLowerCase() !== activeFilters.condition.toLowerCase()) return false

    if (activeFilters.search &&
      !item.name.toLowerCase().includes(activeFilters.search.toLowerCase()) &&
      !item.description.toLowerCase().includes(activeFilters.search.toLowerCase())) return false

    return true
  })

  if (Object.keys(activeFilters).length > 0 && filteredItems.length === 0) {
    return null
  }

  return (
    <div className="bg-bgp flex flex-col mb-8">
      <section className="mt-4 w-full px-4 md:px-6 lg:px-8">
        <h2 className="text-[#73802A] text-2xl md:text-3xl md:text-start text-center font-medium ml-5 mb-4 md:mb-6">
          {title}
        </h2>

        {filteredItems.length === 0 ? (
          <div className="bg-bgp p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-center text-lg">Sem {title.toLowerCase()} disponíveis no momento.</p>
          </div>
        ) : (
          <div className="max-w-2xl px-4 py-8 sm:px-6 sm:py-1 lg:max-w-7xl lg:px-8">
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-10">
              {filteredItems.map((item, index) => (
                <Card
                  key={`${item.idVenda || item.idEmprestimo || item.idSorteio || index}`}
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
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

const FilterDropdown = ({ label, options, value, onChange, clearFilter }) => {
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
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
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

  const allItems = Object.values(shopData).flatMap((section) => section.items)

  const uniqueCategories = [...new Set(allItems.map((item) => item.category))]
    .filter((c) => c && c !== "Sem categoria").sort()

  const hasSemCategoria = allItems.some((item) => item.category === "Sem categoria")

  const categories = [
    { value: "all", label: "Todas Categorias" },
    ...uniqueCategories.map((category) => ({
      value: category.toLowerCase(),
      label: category,
    })),
  ]
  if (hasSemCategoria) {
    categories.push({ value: "sem categoria", label: "Sem categoria" })
  }

  const priceRanges = [
    { value: "all", label: "Todos os Preços" },
    { value: "0-50", label: "Até 50€" },
    { value: "50-100", label: "50€ - 100€" },
    { value: "100-200", label: "100€ - 200€" },
    { value: "200-max", label: "Acima de 200€" },
  ]

  const uniqueConditions = [...new Set(allItems.map((item) => item.condition))]
    .filter((c) => c && c !== "Sem condição").sort()

  const conditions = [
    { value: "all", label: "Todas as Condições" },
    ...uniqueConditions.map((condition) => ({
      value: condition.toLowerCase(),
      label: condition,
    })),
  ]
  if (allItems.some((item) => item.condition === "Sem condição")) {
    conditions.push({ value: "sem condição", label: "Sem condição" })
  }

  const handleFilterChange = (type, value) => {
    if (onFilterChange) onFilterChange(type, value)
  }

  const clearFilter = (type) => {
    if (onFilterChange) onFilterChange(type, "all")
  }

  const clearAllFilters = () => {
    if (onClearAllFilters) onClearAllFilters()
    setSearchQuery("")
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
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
    if (activeFilters.search !== searchQuery) {
      setSearchQuery(activeFilters.search || "")
    }
  }, [activeFilters.search])

  return (
    <div className="flex flex-col w-full">
      {/* Topbar com botão de filtros e busca */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 md:px-6 lg:px-8 flex items-center justify-between">
          {/* Botão de filtros */}
          <button
            onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            className="text-gray-600 hover:text-[#73802A] flex items-center"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filtros
          </button>

          {/* Barra de pesquisa */}
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
          </div>
        </div>

        {/* Seção de filtros condicional */}
        {isFilterSidebarOpen && (
          <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 grid md:grid-cols-3 gap-4">
            <FilterDropdown
              label="Categoria"
              options={categories}
              value={activeFilters.category}
              onChange={(v) => handleFilterChange("category", v)}
              clearFilter={() => clearFilter("category")}
            />
            <FilterDropdown
              label="Preço"
              options={priceRanges}
              value={activeFilters.priceRange}
              onChange={(v) => handleFilterChange("priceRange", v)}
              clearFilter={() => clearFilter("priceRange")}
            />
            <FilterDropdown
              label="Condição"
              options={conditions}
              value={activeFilters.condition}
              onChange={(v) => handleFilterChange("condition", v)}
              clearFilter={() => clearFilter("condition")}
            />
            {Object.keys(activeFilters).length > 0 && (
              <div className="md:col-span-3 text-right mt-2">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#73802A] hover:underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Renderiza todas as seções com seus respectivos itens */}
      {Object.values(shopData).map((section, index) => (
        <ContentMainSection
          key={`${section.title}-${index}`}
          title={section.title}
          items={section.items}
          activeFilters={activeFilters}
        />
      ))}

      <Footer />
    </div>
  )
}

export default ContentMain

import { useState, useEffect } from "react"
import { Menu, X, Home, User, Plus } from "lucide-react"

// You can still use your logo image
import logo from '../images/logoEmpresa.png' // Replace with actual logo path

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile when component mounts and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      }
    }
    // Set initial state
    checkIfMobile()
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Sidebar classes based on state
  const sidebarClasses = `min-h-screen flex flex-col bg-[#FFFAEE] items-center py-4 bg-white z-40 transition-all duration-300 ease-in-out ${
    isOpen ? "fixed left-0 w-64 shadow-lg" : "fixed -left-64 w-64 md:left-0"
  } md:w-64 md:fixed`

  // Main content wrapper classes
  const contentWrapperClasses = `transition-all duration-300 ease-in-out ${isOpen ? "md:ml-64" : "ml-0"}`

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#FFFAEE] shadow-md md:hidden"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X className="h-6 w-6 text-[#CAAD7E]" /> : <Menu className="h-6 w-6 text-[#CAAD7E]" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={toggleSidebar} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="mb-10 mx-2 mt-12 md:mt-0">
          <span>
            <img src={logo || "/placeholder.svg"} width={116} height={122} alt="logo" />
          </span>
        </div>

        <nav className="flex flex-col justify-center space-y-4 flex-1 w-full px-4">
          <button
            type="button"
            className="text-[#ADADAD] bg-[#FFFAEE] hover:bg-[#D4CFC3]/90 focus:ring-4 focus:outline-none focus:ring-[#FFFAEE]/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55"
          >
            <Home className="w-6 h-6 mr-3 text-[#ADADAD]" />
            <a href="/index">Inicial</a>
          </button>

          <button
            type="button"
            className="text-[#ADADAD] bg-[#FFFAEE] hover:bg-[#D4CFC3]/90 focus:ring-4 focus:outline-none focus:ring-[#FFFAEE]/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55"
          >
            <User className="w-6 h-6 mr-3 text-[#ADADAD]" />
            <a href="/account">Conta</a>
          </button>
        </nav>

        <button className="bg-[#CAAD7E] rounded-lg px-4 py-2 mt-4 mb-20 flex items-center space-x-2">
          <Plus className="w-6 h-6 mr-3 text-white" />
          <span className="text-xl text-white">Adicionar</span>
        </button>
      </aside>

      {/* Main content wrapper - pushes content to the right when sidebar is open on desktop */}
      <div className={contentWrapperClasses}>{/* Your main content goes here */}</div>
    </>
  )
}

export default Sidebar


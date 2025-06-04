import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, User, ChevronDown, LogOut, ShieldUser } from "lucide-react";
// You can still use your logo image
import logo from "../images/logoEmpresa.png"; // Replace with actual logo path
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, logout } from "../lib/authSlice"; // Import the action

const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  // Check if we're on mobile when component mounts and when window resizes
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserInfo());
    };

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    fetchData();
    // console.log(user)
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);


  }, [dispatch]);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    // Only add the event listener if the dropdown is open
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleAddButtonClick = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionSelect = (path) => {
    navigate(path);
    setDropdownOpen(false);
    // Add your logic for handling the selected option here
  };

  // Sidebar classes based on state
  const sidebarClasses = `min-h-screen flex flex-col bg-[#FFFAEE] items-center py-4 bg-white z-40 transition-all duration-300 ease-in-out ${
    isOpen ? "fixed left-0 w-64 shadow-lg" : "fixed -left-64 w-64 md:left-0"
  } md:w-64 md:fixed`;

  // Main content wrapper classes
  const contentWrapperClasses = `transition-all duration-300 ease-in-out ${
    isOpen ? "md:ml-64" : "ml-0"
  }`;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent and removed
      });

      if (response.ok) {
        dispatch(logout()); // Log the user out in Redux store
        navigate("/"); // Redirect to the home page
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#FFFAEE] shadow-md md:hidden"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-[#CAAD7E]" />
        ) : (
          <Menu className="h-6 w-6 text-[#CAAD7E]" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="mb-10 mx-2 mt-12 md:mt-0">
          <span>
            <img
              src={logo || "/placeholder.svg"}
              width={116}
              height={122}
              alt="logo"
            />
          </span>
        </div>

        <nav className="flex flex-col justify-center space-y-4 flex-1 w-full px-4">
          {props.Home && (
            <button
              type="button"
              onClick={() => navigate("/index")}
              className="text-[#ADADAD] bg-[#FFFAEE] hover:bg-[#D4CFC3]/90 focus:ring-4 focus:outline-none focus:ring-[#FFFAEE]/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55"
            >
              <Home className="w-6 h-6 mr-3 text-[#ADADAD]" />
              Inicial
            </button>
          )}

          {props.Account && (
            <button
              type="button"
              onClick={() => navigate("/account")}
              className="text-[#ADADAD] bg-[#FFFAEE] hover:bg-[#D4CFC3]/90 focus:ring-4 focus:outline-none focus:ring-[#FFFAEE]/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55"
            >
              <User className="w-6 h-6 mr-3 text-[#ADADAD]" />
              A Minha Conta
            </button>
          )}

          {user?.message?.TipoUtilizador == "admin" && (
            <button
              type="button"
              onClick={() => navigate("/indexadmin")}
              className="text-[#ADADAD] bg-[#FFFAEE] hover:bg-[#D4CFC3]/90 focus:ring-4 focus:outline-none focus:ring-[#FFFAEE]/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55"
            >
              <ShieldUser className="w-6 h-6 mr-3 text-[#ADADAD]" />
              Admin
            </button>
          )}
        </nav>

        {props.canAdd && (
          <div className="relative mb-48" ref={dropdownRef}>
            <button
              onClick={handleAddButtonClick}
              className="bg-btns hover:bg-[#c4a884] font-medium rounded-lg text-xl px-12 py-2.5 text-center flex items-center"
            >
              <span className="text-xl text-white">Adicionar</span>
              <ChevronDown
                className={`w-5 h-5 ml-2 text-white transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 border border-[#FFFAEE]">
                <div className="py-1">
                  <button
                    onClick={() => handleOptionSelect("/createsale")}
                    className="block w-full text-left px-4 py-2 text-[#ADADAD] hover:bg-[#FFFAEE] text-lg"
                  >
                    Venda
                  </button>
                  <button
                    onClick={() => handleOptionSelect("/createloan")}
                    className="block w-full text-left px-4 py-2 text-[#ADADAD] hover:bg-[#FFFAEE] text-lg"
                  >
                    Empréstimo
                  </button>
                  <button
                    onClick={() => handleOptionSelect("/createdraw")}
                    className="block w-full text-left px-4 py-2 text-[#ADADAD] hover:bg-[#FFFAEE] text-lg"
                  >
                    Sorteio
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {props.LogOut && (
          <div
            onClick={handleLogout}
            className="logout flex flex-row items-center cursor-pointer text-red-600 mb-8"
          >
            <LogOut />
            <span className="ml-2  text-sm md:text-base text-red-600">
              Logout
            </span>
          </div>
        )}
      </aside>
      <div className={contentWrapperClasses}>
      </div>
    </>
  );
};

export default Sidebar;

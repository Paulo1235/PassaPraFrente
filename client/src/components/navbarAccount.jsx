import { useNavigate } from "react-router-dom";
import { UserCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import "../index.css"
 

const NavbarAccount = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "account", label: "Conta", path: "/account" },
    { id: "notifications", label: "Notificações", path: "/notifications" },
    { id: "proposals", label: "Propostas", path: "/proposals" },
    { id: "history", label: "Histórico", path: "/history" },
    { id: "edit", label: "Detalhes da Conta", path: "/editaccount" },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-bgp border-b border-txtp shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          
          {/* Menu para desktop - ALINHADO À ESQUERDA */}
          <div className="hidden md:flex flex-1"> {/* Adicionado flex-1 */}
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-l font-medium ${
                    activeTab === tab.id
                      ? "border-[#73802A] text-[#73802A]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Botão do menu móvel - ALINHADO À DIREITA APENAS EM MOBILE */}
          <div className="md:hidden ml-auto"> {/* Adicionado ml-auto para alinhar à direita */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <UserCircle className="h-8 w-8 text-[#73802A]" />
              {mobileMenuOpen ? (
                <ChevronUp className="ml-1 h-5 w-5 text-[#73802A]" />
              ) : (
                <ChevronDown className="ml-1 h-5 w-5 text-[#73802A]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu móvel - aparece à direita */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute right-4 z-50 w-56 shadow-lg rounded-md border border-gray-100">
          <div className="py-1">
            {tabs.map((tab) => (
              <button
                key={`mobile-${tab.id}`}
                onClick={() => handleTabClick(tab)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-[#73802A]/10 text-[#73802A]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarAccount;
// import { useEffect, useState } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import Footer from "../components/footer";
// import Sidebar from "../components/sideBar";
// import NavbarAccount from "../components/navbarAccount";

// const TransactionHistory = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("history");
//   const [dateFilter, setDateFilter] = useState("all");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [sortConfig, setSortConfig] = useState({
//     key: "date",
//     direction: "desc",
//   });

//   const categories = [
//     { id: 1, name: "Mobilia" },
//     { id: 2, name: "Eletrónicos" },
//     { id: 3, name: "Roupas" },
//     { id: 4, name: "Bringuedos" },
//     { id: 5, name: "Ferramentas" },
//   ];

//   useEffect(() => {
//     const fetchHistory = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         let allTransactions = [];

//         const fetchData = async (url, type, fallbackCategory) => {
//           const response = await fetch(url, {
//             method: "GET",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//           });
//           if (!response.ok) return;

//           const data = await response.json();
//           if (!data.success) return;

//           const items = Array.isArray(data.message)
//             ? data.message
//             : [data.message];

//           const transactions = items.filter(Boolean).map((item) => ({
//             date:
//               item.DataTransacao || item.createdAt || new Date().toISOString(),
//             description: item.Titulo || item.name || type,
//             amount: item.ValorFinal || item.value || 0,
//             category: item.NomeCategoria || fallbackCategory,
//             transactionType: type,
//             categoryId: item.Categoria_ID || null,
//           }));

//           allTransactions = [...allTransactions, ...transactions];
//         };

//         await fetchData(
//           "http://localhost:5000/api/transaction-sales/user",
//           "Compra",
//           "Vendas"
//         );
//         await fetchData(
//           "http://localhost:5000/api/transaction-loans/user/user",
//           "Emprestimo",
//           "Empréstimos"
//         );
//         await fetchData(
//           "http://localhost:5000/api/winner-giveaway/user",
//           "Sorteio",
//           "Sorteios"
//         );

//         setTransactions(allTransactions);
//         if (allTransactions.length === 0) {
//           setError("Nenhuma transação encontrada. Tente novamente mais tarde.");
//         }
//       } catch {
//         setError("Erro ao carregar transações. Por favor, tente novamente.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchHistory();
//   }, []);

//   const filteredTransactions = transactions.filter((transaction) => {
//     if (dateFilter !== "all") {
//       const today = new Date();
//       const transactionDate = new Date(transaction.date);
//       const diffDays = Math.ceil(
//         Math.abs(today - transactionDate) / (1000 * 60 * 60 * 24)
//       );
//       if (dateFilter === "last7days" && diffDays > 7) return false;
//       if (dateFilter === "last30days" && diffDays > 30) return false;
//       if (dateFilter === "last90days" && diffDays > 90) return false;
//     }

//     if (categoryFilter !== "all") {
//       if (transaction.categoryId) {
//         if (parseInt(categoryFilter) !== transaction.categoryId) return false;
//       } else if (transaction.category !== categoryFilter) {
//         return false;
//       }
//     }

//     return true;
//   });

//   const sortedTransactions = [...filteredTransactions].sort((a, b) => {
//     if (!sortConfig) return 0;
//     if (sortConfig.key === "amount") {
//       return sortConfig.direction === "asc"
//         ? a.amount - b.amount
//         : b.amount - a.amount;
//     }
//     if (sortConfig.key === "date") {
//       return sortConfig.direction === "asc"
//         ? new Date(a.date).getTime() - new Date(b.date).getTime()
//         : new Date(b.date).getTime() - new Date(a.date).getTime();
//     }

//     const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
//     const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
//     return sortConfig.direction === "asc"
//       ? aValue.localeCompare(bValue)
//       : bValue.localeCompare(aValue);
//   });

//   const requestSort = (key) => {
//     let direction = "asc";
//     if (sortConfig?.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-bgp">
//       <Sidebar canAdd={true} Home={true} Account={true} LogOut={false} />

//       <div className="flex flex-col flex-grow w-full md:ml-0">
//         <NavbarAccount activeTab={activeTab} setActiveTab={setActiveTab} />

//         {/* Header */}
//         <div className="pt-6 px-4">
//           <h1 className="text-2xl font-semibold text-[#73802A] text-left">
//             Histórico
//           </h1>
//         </div>

//         {/* Filters */}
//         <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 mt-6 w-full">
//           <div className="bg-bgp rounded-lg p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-1">
//                   Período
//                 </label>
//                 <select
//                   value={dateFilter}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                   className="w-full text-txts border border-txtp rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
//                 >
//                   <option value="all">Todos os períodos</option>
//                   <option value="last7days">Últimos 7 dias</option>
//                   <option value="last30days">Últimos 30 dias</option>
//                   <option value="last90days">Últimos 90 dias</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-1">
//                   Categoria
//                 </label>
//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                   className="w-full text-txts border border-txtp rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
//                 >
//                   <option value="all">Todas as categorias</option>
//                   {categories.map((category) => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Transactions Table */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex-grow w-full">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//             {/* Top Red Bar */}

//             {isLoading ? (
//               <div className="p-8 text-center">
//                 <p className="text-gray-500">Carregando transações...</p>
//               </div>
//             ) : error ? (
//               <div className="p-8 text-center">
//                 <p className="text-red-500">{error}</p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-4 px-4 py-2 bg-[#73802A] text-white rounded-md hover:bg-[#5a6421] transition-colors"
//                 >
//                   Tentar novamente
//                 </button>
//               </div>
//             ) : sortedTransactions.length === 0 ? (
//               <div className="p-8 text-center">
//                 <p className="text-gray-500">
//                   Nenhuma transação encontrada com os filtros atuais.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       {[
//                         "transactionType",
//                         "description",
//                         "amount",
//                         "category",
//                       ].map((key, index) => (
//                         <th
//                           key={key}
//                           scope="col"
//                           className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${
//                             key === "category" ? "hidden md:table-cell" : ""
//                           }`}
//                           onClick={() => requestSort(key)}
//                         >
//                           <div className="flex items-center">
//                             <span>
//                               {
//                                 {
//                                   transactionType: "Tipo",
//                                   description: "Descrição",
//                                   amount: "Preço",
//                                   category: "Categoria",
//                                 }[key]
//                               }
//                             </span>
//                             {sortConfig?.key === key && (
//                               <span className="ml-1">
//                                 {sortConfig.direction === "asc" ? (
//                                   <ChevronUp className="w-4 h-4" />
//                                 ) : (
//                                   <ChevronDown className="w-4 h-4" />
//                                 )}
//                               </span>
//                             )}
//                           </div>
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {sortedTransactions.map((transaction, index) => (
//                       <tr
//                         key={`${transaction.id}-${index}`}
//                         className="hover:bg-gray-50"
//                       >
//                         <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm">
//                             {transaction.transactionType}
//                           </span>
//                         </td>
//                         <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
//                           {transaction.description}
//                         </td>
//                         <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           {transaction.amount.toLocaleString("pt-PT", {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                           €
//                         </td>
//                         <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {transaction.category}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Footer from "../components/footer";
import Sidebar from "../components/sideBar";
import NavbarAccount from "../components/navbarAccount";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const categories = [
    { id: 1, name: "Mobilia" },
    { id: 2, name: "Eletrónicos" },
    { id: 3, name: "Roupas" },
    { id: 4, name: "Bringuedos" },
    { id: 5, name: "Ferramentas" },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let allTransactions = [];

        const fetchData = async (url, type, fallbackCategory) => {
          const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!response.ok) return;

          const data = await response.json();
          if (!data.success) return;

          const items = Array.isArray(data.message)
            ? data.message
            : [data.message];

          const transactions = items.filter(Boolean).map((item) => ({
            date:
              item.DataTransacao || item.createdAt || new Date().toISOString(),
            description: item.Titulo || item.name || type,
            amount: item.ValorFinal || item.value || 0,
            category: item.NomeCategoria || fallbackCategory,
            transactionType: type,
            categoryId: item.Categoria_ID || null,
          }));

          allTransactions = [...allTransactions, ...transactions];
        };

        await fetchData(
          "http://localhost:5000/api/transaction-sales/user",
          "Compra",
          "Vendas"
        );
        await fetchData(
          "http://localhost:5000/api/transaction-loans/user/user",
          "Emprestimo",
          "Empréstimos"
        );
        await fetchData(
          "http://localhost:5000/api/winner-giveaway/user",
          "Sorteio",
          "Sorteios"
        );

        setTransactions(allTransactions);
        if (allTransactions.length === 0) {
          setError("Nenhuma transação encontrada. Tente novamente mais tarde.");
        }
      } catch {
        setError("Erro ao carregar transações. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    if (typeFilter !== "all" && transaction.transactionType !== typeFilter) {
      return false;
    }

    if (categoryFilter !== "all") {
      if (transaction.categoryId) {
        if (parseInt(categoryFilter) !== transaction.categoryId) return false;
      } else if (transaction.category !== categoryFilter) {
        return false;
      }
    }

    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig) return 0;
    if (sortConfig.key === "amount") {
      return sortConfig.direction === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
    const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
    return sortConfig.direction === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bgp">
      <Sidebar canAdd={true} Home={true} Account={true} LogOut={false} />

      <div className="flex flex-col flex-grow w-full md:ml-0">
        <NavbarAccount activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Header */}
        <div className="pt-6 px-4">
          <h1 className="text-2xl font-semibold text-[#73802A] text-left">
            Histórico
          </h1>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 mt-6 w-full">
          <div className="bg-bgp rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Transação
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full text-txts border border-txtp rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="Compra">Compra</option>
                  <option value="Emprestimo">Emprestimo</option>
                  <option value="Sorteio">Sorteio</option>
                </select>
              </div>

              <div className="rounded-md p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-txts border border-txtp rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
                <p className="text-gray-500">
                  Nenhuma transação encontrada com os filtros atuais.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["transactionType", "description", "amount", "category"].map(
                        (key) => (
                          <th
                            key={key}
                            scope="col"
                            className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${
                              key === "category" ? "hidden md:table-cell" : ""
                            }`}
                            onClick={() => requestSort(key)}
                          >
                            <div className="flex items-center">
                              <span>
                                {
                                  {
                                    transactionType: "Tipo",
                                    description: "Descrição",
                                    amount: "Preço",
                                    category: "Categoria",
                                  }[key]
                                }
                              </span>
                              {sortConfig?.key === key && (
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
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTransactions.map((transaction, index) => (
                      <tr
                        key={`${transaction.id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">
                            {transaction.transactionType}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                          {transaction.description}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {transaction.amount.toLocaleString("pt-PT", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          €
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

        <Footer />
      </div>
    </div>
  );
};

export default TransactionHistory;

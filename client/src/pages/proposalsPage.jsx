import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../lib/authSlice";
import SideBar from "../components/sideBar";
import ProposalCard from "../components/proposalCard";
import Footer from "../components/footer";
import { Helmet } from "react-helmet";
import ProposalCardAnnouce from "../components/proposalCardAnnouce";
import NavbarAccount from "../components/navbarAccount";
import "../components/css/sidebar.css";
import "../index.css";

const ProposalsPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState({ made: false, received: false });
  const [proposalsMade, setProposalsMade] = useState([]);
  const [proposalsReceived, setProposalsReceived] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("proposals");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    dispatch(fetchUserInfo());
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (!user?.message?.Utilizador_ID) {
      setProposalsMade([]);
      setProposalsReceived([]);
    }
  }, [user]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading({ made: true, received: true });
        setError(null);

        const userId = user?.message?.Utilizador_ID;
        if (!userId) return;

        const fetchProposalList = async (url, type, isReceived = false) => {
          const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!res.ok) throw new Error("Erro ao buscar propostas");
          const data = await res.json();

          return await Promise.all(data.message.map(async (proposal) => {
            const id = type === "sales" ? proposal.Venda_ID : proposal.Emprestimo_ID;
            const endpoint = type === "sales" ? "sales" : "loans";
            const detailRes = await fetch(`http://localhost:5000/api/${endpoint}/id/${id}`, {
              credentials: 'include',
              headers: { "Content-Type": "application/json" }
            });
            const detail = await detailRes.json();

            return {
              title: detail.message?.Titulo || "Sem título",
              category: type === "sales" ? "Vendas" : "Empréstimos",
              price: proposal.NovoValor ?? 0,
              description: detail.message?.Descricao || "Sem descrição",
              status: proposal.Aceite,
              date: proposal.Data_Criacao,
              rawDate: new Date(proposal.Data_Criacao),
              proposerId: isReceived ? proposal.Utilizador_ID : undefined,
              ...(type === "sales"
                ? { idVenda: proposal.Venda_ID }
                : {
                    idEmprestimo: proposal.Emprestimo_ID,
                    duration: `${Math.ceil((new Date(proposal.NovaDataFim) - new Date(proposal.NovaDataInicio)) / (1000 * 60 * 60 * 24))} dia(s)`
                  })
            };
          }));
        };

        const [madeSales, madeLoans, recSales, recLoans] = await Promise.all([
          fetchProposalList("http://localhost:5000/api/proposal-sales/user/user", "sales"),
          fetchProposalList("http://localhost:5000/api/proposal-loans/user/user", "loans"),
          fetchProposalList("http://localhost:5000/api/proposal-sales/sales/user", "sales", true),
          fetchProposalList("http://localhost:5000/api/proposal-loans/loans/user", "loans", true)
        ]);

        setProposalsMade([...madeSales, ...madeLoans]);
        setProposalsReceived([...recSales, ...recLoans]);

      } catch (err) {
        console.error("Erro:", err);
        setError("Erro ao carregar propostas");
      } finally {
        setLoading({ made: false, received: false });
      }
    };

    if (user?.message?.Utilizador_ID) fetchProposals();
  }, [user]);

  const filterAndSortProposals = (proposals) => {
    let filtered = [...proposals];

    if (statusFilter !== "all") {
      filtered = filtered.filter(p => {
        const status = p.status;
        if (statusFilter === "pending") return status === 1;
        if (statusFilter === "accepted") return status === 2;
        if (statusFilter === "rejected") return status === 3;
        return true;
      });
    }

    if (categoryFilter !== "all") {
      const catMap = { sales: "Vendas", loans: "Empréstimos" };
      filtered = filtered.filter(p => p.category === catMap[categoryFilter]);
    }

    filtered.sort((a, b) => b.rawDate - a.rawDate);

    return filtered;
  };

  const filteredMade = filterAndSortProposals(proposalsMade);
  const filteredReceived = filterAndSortProposals(proposalsReceived);

  if (!isAuthenticated) return null;

  return (
    <div className="bg-bgp flex flex-col md:flex-row min-h-screen">
      <Helmet><title>Propostas</title></Helmet>
      <div className="md:sticky md:top-0 md:h-screen">
        <SideBar canAdd={true} Home={true} Account={true} LogOut={false} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavbarAccount activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="p-6 sm:p-10 pb-0">
          <h1 className="text-2xl font-medium text-txtp">Propostas</h1>
        </div>
        
        {/* Updated Filters Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 mt-2 w-full">
          <div className="bg-bgp rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md p-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-txts border border-txtp rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendentes</option>
                  <option value="accepted">Aceites</option>
                  <option value="rejected">Rejeitadas</option>
                </select>
              </div>
              <div className="rounded-md p-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-txts border border-txtp rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#73802A] focus:border-[#73802A]"
                >
                  <option value="all">Todas</option>
                  <option value="sales">Vendas</option>
                  <option value="loans">Empréstimos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 sm:mx-10 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 p-4 md:p-6">
              <h2 className="text-gray-400 font-semibold mb-4 text-xl">Recebidas</h2>
              {loading.received ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-[#7b892f]">Carregando...</p>
                </div>
              ) : filteredReceived.length > 0 ? (
                <div className="space-y-4">
                  {filteredReceived.map((item, i) => (
                    <ProposalCardAnnouce key={`rec-${i}`} item={item} proposerId={item.proposerId} />
                  ))}
                </div>
              ) : (
                <p className="text-[#7b892f] font-semibold text-lg text-center">Nenhuma proposta recebida.</p>
              )}
            </div>
            <div className="hidden md:block w-px bg-[#8b9a41]" />
            <div className="w-full md:w-1/2 p-4 md:p-6">
              <h2 className="text-gray-400 font-semibold mb-4 text-xl">Efetuadas</h2>
              {loading.made ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-[#7b892f]">Carregando...</p>
                </div>
              ) : filteredMade.length > 0 ? (
                <div className="space-y-4">
                  {filteredMade.map((item, i) => (
                    <ProposalCard key={`made-${i}`} item={item} />
                  ))}
                </div>
              ) : (
                <p className="text-[#7b892f] font-semibold text-lg text-center">Nenhuma proposta efetuada.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProposalsPage;
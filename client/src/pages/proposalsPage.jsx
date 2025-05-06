import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../lib/authSlice";
import SideBar from "../components/sideBar";
import ProposalCard from "../components/proposalCard";
import Footer from "../components/footer";
import { Helmet } from "react-helmet";
import ProposalCardAnnouce from "../components/proposalCardAnnouce";
import "../components/css/sidebar.css";
import "../index.css";

const ProposalsPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState({ made: false, received: false });
  const [proposalsMade, setProposalsMade] = useState({ sales: [], loans: [] });
  const [proposalsReceived, setProposalsReceived] = useState({ sales: [], loans: [] });
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check authentication and fetch user data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    dispatch(fetchUserInfo());
  }, [isAuthenticated, dispatch, navigate]);

  // Clear states when no user
  useEffect(() => {
    if (!user?.message?.Utilizador_ID) {
      setProposalsMade({ sales: [], loans: [] });
      setProposalsReceived({ sales: [], loans: [] });
    }
  }, [user]);

  // Fetch proposals I made (Sent proposals)
  useEffect(() => {
    const fetchProposalsMade = async () => {
      try {
        setLoading(prev => ({...prev, made: true}));
        setError(null);
        
        const userId = user?.message?.Utilizador_ID;
        if (!userId) return;

        const fetchSalesProposals = async () => {
          const response = await fetch(`http://localhost:5000/api/proposal-sales/user/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (!response.ok) throw new Error("Erro ao buscar propostas de venda");

          const data = await response.json();
          if (!data?.message || !Array.isArray(data.message)) return [];

          return await Promise.all(
            data.message.map(async (proposal) => {
              const detailRes = await fetch(`http://localhost:5000/api/sales/id/${proposal.Venda_ID}}`, {
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
              });
              
              const saleDetail = await detailRes.json();
              
              return {
                title: saleDetail.message?.Titulo || "Sem título",
                Titulo: saleDetail.message?.Titulo || "Sem título",
                idVenda: proposal.Venda_ID || null,
                category: "Vendas",
                price: proposal.NovoValor ?? 0,
                description: saleDetail.message?.Descricao || "Sem descrição",
                Descricao: saleDetail.message?.Descricao || "Sem descrição",
                status: proposal.Aceite ?? 0,
                date: proposal.Data_Criacao || new Date().toISOString(),
              };
            })
          );
        };

        const fetchLoanProposals = async () => {
          const response = await fetch(`http://localhost:5000/api/proposal-loans/user/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (!response.ok) throw new Error("Erro ao buscar propostas de empréstimo");

          const data = await response.json();
          if (!data?.message || !Array.isArray(data.message)) return [];

          return await Promise.all(
            data.message.map(async (proposal) => {
              const detailRes = await fetch(`http://localhost:5000/api/loans/id/${proposal.Emprestimo_ID}`, {
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
              });
              
              const loanDetail = await detailRes.json();
              
              return {
                title: loanDetail.message?.Titulo || "Sem título",
                Titulo: loanDetail.message?.Titulo || "Sem título",
                idEmprestimo: proposal.Emprestimo_ID || null,
                category: "Empréstimos",
                price: proposal.NovoValor ?? 0,
                description: loanDetail.message?.Descricao || "Sem descrição",
                Descricao: loanDetail.message?.Descricao || "Sem descrição",
                status: proposal.Aceite ?? 0,
                date: proposal.Data_Criacao || new Date().toISOString(),
                duration: (() => {
                  const start = new Date(proposal.NovaDataInicio || new Date());
                  const end = new Date(proposal.NovaDataFim || new Date());
                  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                  return `${diffDays} dia(s)`;
                })(),
              };
            })
          );
        };

        const [salesItems, loanItems] = await Promise.all([
          fetchSalesProposals(),
          fetchLoanProposals()
        ]);

        setProposalsMade({
          sales: salesItems.filter(item => item !== null),
          loans: loanItems.filter(item => item !== null)
        });
      } catch (err) {
        console.error("Erro ao buscar propostas efetuadas:", err);
        setError("Erro ao carregar propostas efetuadas");
      } finally {
        setLoading(prev => ({...prev, made: false}));
      }
    };

    if (user?.message?.Utilizador_ID) fetchProposalsMade();
  }, [user]);

  // Fetch proposals I received
  useEffect(() => {
    const fetchProposalsReceived = async () => {
      try {
        setLoading(prev => ({...prev, received: true}));
        setError(null);
        
        const userId = user?.message?.Utilizador_ID;
        if (!userId) return;

        const fetchSalesProposalsAnnounce = async () => {
          const response = await fetch(`http://localhost:5000/api/proposal-sales/sales/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
        
          if (!response.ok) throw new Error("Erro ao buscar propostas de venda recebidas");
        
          const data = await response.json();
          if (!data?.message || !Array.isArray(data.message)) return [];
        
          return await Promise.all(
            data.message.map(async (proposal) => {
              const detailRes = await fetch(`http://localhost:5000/api/sales/id/${proposal.Venda_ID}`, {
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
              });
              
              if (!detailRes.ok) {
                console.error("Falha ao buscar detalhes da venda", detailRes.status);
                return null;
              }
        
              const saleDetail = await detailRes.json();
              
              return {
                title: saleDetail.message?.Titulo || "Sem título",
                idVenda: proposal.Venda_ID || null,
                category: "Vendas",
                price: proposal.NovoValor ?? 0,
                description: saleDetail.message?.Descricao || "Sem descrição",
                status: proposal.Aceite ?? 0,
                date: proposal.Data_Criacao || new Date().toISOString(),
                proposerId: proposal.Utilizador_ID || null
              };
            })
          );
        };

        const fetchLoanProposalsAnnounce = async () => {
          const response = await fetch(`http://localhost:5000/api/proposal-loans/loans/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (!response.ok) throw new Error("Erro ao buscar propostas de empréstimo recebidas");

          const data = await response.json();
          if (!data?.message || !Array.isArray(data.message)) return [];

          return await Promise.all(
            data.message.map(async (proposal) => {
              const detailRes = await fetch(`http://localhost:5000/api/loans/id/${proposal.Emprestimo_ID}`, {
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
              });
              
              const loanDetail = await detailRes.json();
              
              return {
                title: loanDetail.message?.Titulo || "Sem título",
                idEmprestimo: proposal.Emprestimo_ID || null,
                category: "Empréstimos",
                price: proposal.NovoValor ?? 0,
                description: loanDetail.message?.Descricao || "Sem descrição",
                status: proposal.Aceite ?? 0,
                date: proposal.Data_Criacao || new Date().toISOString(),
                proposerId: proposal.Utilizador_ID || null,
                duration: (() => {
                  const start = new Date(proposal.NovaDataInicio || new Date());
                  const end = new Date(proposal.NovaDataFim || new Date());
                  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                  return `${diffDays} dia(s)`;
                })(),
              };
            })
          );
        };

        const [salesItems, loanItems] = await Promise.all([
          fetchSalesProposalsAnnounce(),
          fetchLoanProposalsAnnounce()
        ]);

        setProposalsReceived({
          sales: salesItems.filter(item => item !== null),
          loans: loanItems.filter(item => item !== null)
        });
      } catch (err) {
        console.error("Erro ao buscar propostas recebidas:", err);
        setError("Erro ao carregar propostas recebidas");
      } finally {
        setLoading(prev => ({...prev, received: false}));
      }
    };

    if (user?.message?.Utilizador_ID) fetchProposalsReceived();
  }, [user]);

  const announcingItems = [...proposalsMade.sales, ...proposalsMade.loans];
  const announcingItemsAnnounce = [...proposalsReceived.sales, ...proposalsReceived.loans];

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

        {error && (
          <div className="mx-6 sm:mx-10 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          {/* Received Proposals */}
          <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto">
            <h2 className="text-gray-400 font-semibold mb-4 text-xl">Recebidas</h2>
            
            {loading.received ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-[#7b892f]">Carregando...</p>
              </div>
            ) : announcingItemsAnnounce && announcingItemsAnnounce.length > 0 ? (
              announcingItemsAnnounce.map((item, index) => (
                <ProposalCardAnnouce 
                  key={`received-${index}`} 
                  item={item} 
                  proposerId={item.proposerId}
                />
              ))
            ) : (
              <p className="text-[#7b892f] font-semibold text-lg text-center">
                Nenhuma proposta recebida.
              </p>
            )}
          </div>

          <div className="hidden md:block w-px bg-[#8b9a41]" />

          {/* Sent Proposals */}
          <div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto">
            <h2 className="text-gray-400 font-semibold mb-4 text-xl">Efetuadas</h2>
            
            {loading.made ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-[#7b892f]">Carregando...</p>
              </div>
            ) : announcingItems && announcingItems.length > 0 ? (
              announcingItems.map((item, index) => (
                <ProposalCard 
                  key={`made-${index}`} 
                  item={item} 
                />
              ))
            ) : (
              <p className="text-[#7b892f] font-semibold text-lg text-center">
                Nenhuma proposta efetuada.
              </p>
            )}
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
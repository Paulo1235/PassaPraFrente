import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./lib/store";

//? CSS
import "./index.css";

//? Login e Registo
import Login from "./pages/Auth/login";
import SignIn from "./pages/Auth/signIn";
import RecoverPass from "./pages/Auth/recoverPassPage";
import NewPassword from "./pages/Auth/newPasswordPage";

//? Importante
import Main from "./pages/mainPage";
import AdminMain from "./pages/adminMainPage";
import ProposalsPage from "./pages/proposalsPage";
import NotificationsPage from "./pages/notificationsPage";
import ReviewPage from "./pages/reviewPage.jsx";
import TransactionHistory from "./pages/history.jsx";

//? Conta
import Account from "./pages/accountPage";
import ConfirmAccount from "./pages/confirmAccount.jsx";
import EditAccountPage from "./pages/editAccountPage";

//? Processo de Negocio
import LookSale from "./pages/BPMN/lookSalePage";
import LookLoan from "./pages/BPMN/lookLoanPage";
import LookDraw from "./pages/BPMN/lookDrawPage";
import CreateSale from "./pages/BPMN/createSale";
import CreateLoan from "./pages/BPMN/createLoan";
import CreateDraw from "./pages/BPMN/createDraw";
import EditDraw from "./pages/BPMN/editDraw";
import EditLoan from "./pages/BPMN/editLoan";
import EditSale from "./pages/BPMN/editSale";
import SaleProposal from "./pages/BPMN/saleProposal.jsx";
import LoanProposal from "./pages/BPMN/loanProposal.jsx";

//* Extra
import ProtectedRoute from "./pages/ProtectedRoutes/protectedRoute";
import AdminProtectedRoute from "./pages/ProtectedRoutes/adminProtectedRoute";
import Layout from "./pages/layout.jsx";
import NotFound from "./pages/notFound";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        {/* Autenticacao e Registo */}
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/recoverpass" element={<RecoverPass />} />
        <Route path="/layout" element={<Layout />} />

        {/* Admin */}
        <Route
          path="/indexadmin"
          element={<AdminProtectedRoute element={<AdminMain />} />}
        />

        {/* Paginas principais */}
        <Route path="/index" element={<ProtectedRoute element={<Main />} />} />

        <Route
          path="/sale/:id"
          element={<ProtectedRoute element={<LookSale />} />}
        />

        <Route
          path="/loan/:id"
          element={<ProtectedRoute element={<LookLoan />} />}
        />

        <Route
          path="/draw/:id"
          element={<ProtectedRoute element={<LookDraw />} />}
        />

        <Route
          path="/createsale"
          element={<ProtectedRoute element={<CreateSale />} />}
        />

        <Route
          path="/createloan"
          element={<ProtectedRoute element={<CreateLoan />} />}
        />

        <Route
          path="/createdraw"
          element={<ProtectedRoute element={<CreateDraw />} />}
        />

        <Route
          path="/editsale/:id"
          element={<ProtectedRoute element={<EditSale />} />}
        />

        <Route
          path="/editloan/:id"
          element={<ProtectedRoute element={<EditLoan />} />}
        />

        <Route
          path="/editdraw/:id"
          element={<ProtectedRoute element={<EditDraw />} />}
        />

        <Route
          path="/saleproposal/:id"
          element={<ProtectedRoute element={<SaleProposal />} />}
        />

        <Route
          path="/loanproposal/:id"
          element={<ProtectedRoute element={<LoanProposal />} />}
        />

        {/* Conta */}
        <Route
          path="/account"
          element={<ProtectedRoute element={<Account />} />}
        />
        <Route
          path="/editaccount"
          element={<ProtectedRoute element={<EditAccountPage />} />}
        />

        <Route
          path="/newpassword"
          element={<ProtectedRoute element={<NewPassword />} />}
        />

        <Route
          path="/confirm-account"
          element={<ProtectedRoute element={<ConfirmAccount />} />}
        />

        <Route
          path="/proposals"
          element={<ProtectedRoute element={<ProposalsPage />} />}
        />

        <Route
          path="/notifications"
          element={<ProtectedRoute element={<NotificationsPage />} />}
        />

        <Route
          path="/history"
          element={<ProtectedRoute element={<TransactionHistory />} />}
        />

        {/* Review */}
        <Route
          path="/review/user/:category/:id"
          element={<ProtectedRoute element={<ReviewPage />} />}
        />

        {/* Pagina nao encontrada */}
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<Navigate replace to="/notfound" />} />
      </Routes>
    </Router>
  </Provider>
);

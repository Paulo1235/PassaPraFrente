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

//? Pages
import Login from "./pages/Auth/login";
import SignIn from "./pages/Auth/signIn";
import RecoverPass from "./pages/Auth/recoverPassPage";
import NewPassword from "./pages/Auth/newPasswordPage";

import Main from "./pages/mainPage";
import AdminMain from "./pages/adminMainPage";
import Account from "./pages/accountPage";

import ProtectedRoute from "./pages/ProtectedRoutes/protectedRoute";
import NotFound from "./pages/notFound";
import ProposalsPage from "./pages/proposalsPage";
import NotificationsPage from "./pages/notificationsPage";

//? Business Processes
import LookSale from "./pages/BPMN/lookSalePage";
import LookLoan from "./pages/BPMN/lookLoanPage";
import LookDraw from "./pages/BPMN/lookDrawPage";
import CreateSale from "./pages/BPMN/createSale";
import CreateLoan from "./pages/BPMN/createLoan";
import CreateDraw from "./pages/BPMN/createDraw";
import EditDraw from "./pages/BPMN/editDraw";
import EditLoan from "./pages/BPMN/editLoan";
import EditSale from "./pages/BPMN/editSale";
import VendaProposta from "./pages/BPMN/vendaProposta";

import ConfirmAccount from "./pages/BPMN/confirmAccount";
import EditAccountPage from "./pages/editAccountPage";

import AdminProtectedRoute from "./pages/ProtectedRoutes/adminProtectedRoute";
import EmprestimoProposta from "./pages/BPMN/emprestimoProposta.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Autenticacao e Registo */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/recoverpass" element={<RecoverPass />} />
        <Route path="/newpassword" element={<NewPassword />} />

        {/* Test Pages */}
        {/* <Route path="/testesale" element={<EditSale />} />
        <Route path="/testeloan" element={<EditLoan />} />
        
        <Route path="/testedraw" element={<EditDraw />} /> */}

        {/* <Route path="/testevenda" element={<VendaProposta />} />
        <Route path="/testeemprestimo" element={<EmprestimoProposta />} /> */}

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
          element={<ProtectedRoute element={<VendaProposta />} />}
        />

        <Route
          path="/loanproposal/:id"
          element={<ProtectedRoute element={<EmprestimoProposta />} />}
        />

        <Route
          path="/account"
          element={<ProtectedRoute element={<Account />} />}
        />
        <Route
          path="/editaccount"
          element={<ProtectedRoute element={<EditAccountPage />} />}
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

        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<Navigate replace to="/notfound" />} />
      </Routes>
    </Router>
  </Provider>
);

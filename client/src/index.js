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
// import SignIn from './pages/Auth/MultiStepForm/signIn'
// import SignInNext from './pages/Auth/MultiStepForm/signInNext'
// import Stepper from './pages/Auth/MultiStepForm/stepper';
import SignIn from "./pages/Auth/signIn";
import RecoverPass from "./pages/Auth/recoverPassPage";
import NewPassword from "./pages/Auth/newPasswordPage";

import Main from "./pages/mainPage";
import AdminMain from "./pages/adminMainPage";
import Account from "./pages/accountPage";

import ProtectedRoute from "./pages/ProtectedRoutes/protectedRoute";
import NotFound from "./pages/notFound";

//? Business Processes
import LookSale from "./pages/BPMN/lookSalePage";
import LookLoan from "./pages/BPMN/lookLoanPage";
import LookDraw from "./pages/BPMN/lookDrawPage";
import CreateSale from "./pages/BPMN/createSale";
import CreateLoan from "./pages/BPMN/createLoan";
import CreateDraw from "./pages/BPMN/createDraw";

import AdminProtectedRoute from "./pages/ProtectedRoutes/adminProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Autenticacao e Registo */}
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/signin" element={<Stepper />} /> */}
        {/* <Route path="/signinnext" element={<SignInNext />} /> */}
        <Route path="/recoverpass" element={<RecoverPass />} />
        <Route path="/newpassword" element={<NewPassword />} />

        {/* <Route path="/createsale" element={<CreateSale />} /> */}
        {/* <Route path="/createloan" element={<CreateLoan />} /> */}
        {/* <Route path="/createdraw" element={<CreateDraw />} /> */}

        {/* Admin */}
        <Route
          path="/indexadmin"
          element={<AdminProtectedRoute element={<AdminMain />} />}
        />

        {/* Paginas principais */}
        <Route path="/index" element={<ProtectedRoute element={<Main />} />} />
        <Route
          path="/sale"
          element={<ProtectedRoute element={<LookSale />} />}
        />
        <Route
          path="/loan"
          element={<ProtectedRoute element={<LookLoan />} />}
        />
        <Route
          path="/draw"
          element={<ProtectedRoute element={<LookDraw />} />}
        />
        <Route
          path="/account"
          element={<ProtectedRoute element={<Account />} />}
        />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<Navigate replace to="/notfound" />} />
      </Routes>
    </Router>
  </Provider>
);

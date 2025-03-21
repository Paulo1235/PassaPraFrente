import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { store } from './lib/store';

//? CSS
import './index.css';
//? Components
import SideBar from './components/sideBar'
//? Pages
import Login from './pages/login';
import SignIn from './pages/signIn'
import SignInNext from './pages/signInNext'
import RecoverPass from './pages/recoverPassPage'
import NewPassword from './pages/newPasswordPage'

import Main from './pages/mainPage'
import AdminMain from './pages/adminMainPage'
import Account from './pages/accountPage'

import ProtectedRoute from './protectedRoute';

//? Business Processes
import LookSale from './pages/lookSalePage';
import LookLoan from './pages/lookLoanPage';
import LookDraw from './pages/lookDrawPage';
import CreateSale from './pages/createSale';
import CreateLoan from './pages/createLoan';
import CreateDraw from './pages/createDraw';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signinnext" element={<SignInNext />} />
        <Route path="/recoverpass" element={<RecoverPass />} />
        <Route path="/newpassword" element={<NewPassword />} />
        
        {/* <Route path="/createsale" element={<CreateSale />} /> */}
        {/* <Route path="/createloan" element={<CreateLoan />} /> */}
        {/* <Route path="/createdraw" element={<CreateDraw />} /> */}

        {/* <Route path="/indexadmin" element={<AdminMain />} /> */}

        <Route path="/index" element={<ProtectedRoute element={<Main />} />} />
        <Route path="/sale" element={<ProtectedRoute element={<LookSale />} />} />
        <Route path="/loan" element={<ProtectedRoute element={<LookLoan />} />} />
        <Route path="/draw" element={<ProtectedRoute element={<LookDraw />} />} />
        <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
      </Routes>
    </Router>
  </Provider>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//? CSS
import './index.css';
//? Components
import SideBar from './components/sideBar'
//? Pages
import Login from './pages/loginPage';
import SignIn from './pages/signInPage'
import RecoverPass from './pages/recoverPassPage'
import NewPassword from './pages/newPasswordPage'

import Main from './pages/mainPage'
import AdminMain from './pages/adminMainPage'
import Account from './pages/accountPage'

//? Business Processes
import LookSale from './pages/lookSalePage';
import LookLoan from './pages/lookLoanPage';
import LookDraw from './pages/lookDrawPage';
import CreateSale from './pages/createSale';
import CreateLoan from './pages/createLoan';
import CreateDraw from './pages/createDraw';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/recoverpass" element={<RecoverPass />} />
      <Route path="/newpassword" element={<NewPassword />} />
      <Route path="/sidebartest" element={<SideBar />} />
      <Route path="/index" element={<Main />} />
      <Route path="/createsale" element={<CreateSale />} />
      <Route path="/createloan" element={<CreateLoan />} />
      <Route path="/createdraw" element={<CreateDraw />} />
      <Route path="/indexadmin" element={<AdminMain />} />
      <Route path="/sale" element={<LookSale />} />
      <Route path="/loan" element={<LookLoan />} />
      <Route path="/draw" element={<LookDraw />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  </BrowserRouter>
);
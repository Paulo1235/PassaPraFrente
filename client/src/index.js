import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//? CSS
import './index.css';
//? Components
import SideBar from './components/sideBar'
//? Pages
import Login from './pages/login';
import SignIn from './pages/signIn'
import RecoverPass from './pages/recoverPass'
import NewPassword from './pages/newPassword'

import Main from './pages/main'

import Account from './pages/account'

import CreateSale from './pages/createSale';

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
      <Route path="/account" element={<Account />} />
    </Routes>
  </BrowserRouter>
);

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

import Template from './pages/template'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/recoverpass" element={<RecoverPass />} />
      <Route path="/newpassword" element={<NewPassword />} />
      <Route path="/sidebartest" element={<SideBar />} />
      <Route path="/template" element={<Template />} />
    </Routes>
  </BrowserRouter>
);

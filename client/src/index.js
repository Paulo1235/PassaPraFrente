import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//? CSS
import './index.css';
//? Componentes
import Login from './pages/login';
import SignIn from './pages/signIn'
import RecoverPass from './pages/recoverPass'
import NewPassword from './pages/newPassword'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/recoverpass" element={<RecoverPass />} />
      <Route path="/newpassword" element={<NewPassword />} />
    </Routes>
  </BrowserRouter>
);


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     {/* <Login /> */}
//     <SignIn />
//     {/* <RecoverPass /> */}
//     {/* <NewPassword /> */}
//   </React.StrictMode>
// );

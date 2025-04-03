import '../index.css';
import logo from '../images/logoEmpresa.png';
import { Formik } from 'formik';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/form';

const PasswordInput = ({ showPassword, togglePasswordVisibility, ...props }) => (
  <div className='relative'>
    <input
      className='mt-2 p-2 border border-gray-300 rounded w-full'
      type={showPassword ? 'text' : 'password'}
      {...props}
    />
    <button type='button' onClick={togglePasswordVisibility} className='absolute right-2 top-2'>👁️</button>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();

  const initialValues = { email: '', password: '' };
  const validationSchema = values => {
    const errors = {};
    if (!values.email) errors.email = 'Insira um email válido';
    if (!values.password) errors.password = 'Obrigatório';
    else if (values.password.length < 6) errors.password = 'A palavra-passe deve ter pelo menos 6 caracteres';
    return errors;
  };
  
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form submitted:', values);
    setSubmitting(false);
    navigate('/index');
  };

  return (
    <div className='flex flex-col sm:flex-row justify-center items-center min-h-screen bg-bgp p-4 sm:p-8'>
      <ToastContainer />
      <div className='w-full max-w-4xl bg-bgs rounded-3xl shadow-xl overflow-hidden flex flex-col sm:flex-row p-4 sm:p-6'>
        <div className='flex sm:hidden w-full bg-bgs flex-col items-center justify-center p-8'>
          <img src={logo} alt='logo' className='w-48 h-48' />
          <p className='text-txtp text-center text-lg'>Entre vizinhos, tudo se Aproveita!</p>
        </div>
        <div className='w-full sm:w-1/2 bg-white rounded-2xl px-6 py-6 sm:px-8 sm:py-8'>
          <h2 className='text-2xl font-medium text-txtp mb-6'>Bem-vindo de volta!</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

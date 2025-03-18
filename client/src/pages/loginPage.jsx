import axios from 'axios';

import useAuthStore from '../stores/offstore'

//? CSS
import '../index.css'
//? Logo
import logo from '../images/logoEmpresa.png'
//? Icons
import eyeIco from '../images/eyeIco.svg'

import { Formik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

function Login() {

  const { login, loading, error } = useAuthStore((state) => state);

  const handleLogin = (email, password) => {
    login(email, password);
  };

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const notify = (msg) => toast.error(msg);

  return (
    <div className='App h-[100vh] flex justify-center items-center'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Helmet>
        <title>Bem-Vindo!</title>
      </Helmet>
      <div className='black-rectangle flex pl-10 text-3xl'>
        <div className='left ml-20 flex flex-col items-start justify-center'>
          <img src={logo} alt="logo" />
          <span className='text'>Entre vizinhos, tudo se <span className='flex flex-col items-center'>Aproveita!</span></span>
        </div>
        <div className='right ml-20 flex flex-col justify-center'>
          <div className='white-rectangle flex flex-col'>
            <span className='text text-4xl pt-20 pl-10'>Bem-Vindo, entre agora!</span>
            <Formik
              initialValues={{ email: '', password: '' }}
              validate={values => {
                const errors = {};
                if (!values.email) {
                  errors.email = 'Obrigatorio';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Insira um email valido';
                }
                if (!values.password) {
                  errors.password = 'Obrigatorio';
                } else if (values.password.length < 6) {
                  errors.password = 'A palavra-passe deve ter pelo menos 6 caracteres';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {

                  // axios.post('http://localhost:5000/api/auth/login', {
                  //   email: values.email,
                  //   password: values.password
                  // })
                  //   .then(function (response) {
                  //     //console.log(response);
                  //     setAuthenticated(true);
                  //     navigate("/index")
                  //   })
                  //   .catch(function (error) {
                  //     if (error.response && error.response.data && error.response.data.message) {
                  //       notify(error.response.data.message);
                  //     } else {
                  //       notify("Erro desconhecido, tente novamente!");
                  //     }
                  //   });

                  handleLogin(values.email, values.password);
                  navigate("/index")

                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} className='mx-20 mt-5 flex flex-col'>
                  <label className='text pt-4' htmlFor='email'>Email:</label>
                  <input
                    className='mt-2 p-2 border border-gray-300 rounded'
                    type='text'
                    id='email'
                    name='email'
                    placeholder='teste@gmail.com'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <span className='text-lg text-error'>{errors.email && touched.email && errors.email}</span>
                  <label className='text pt-4' htmlFor='username'>Palavra-Passe:</label>
                  <div className='relative'>
                    <input
                      className='mt-2 p-2 border border-gray-300 rounded w-full'
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      name='password'
                      placeholder='*******'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <img
                      src={eyeIco}
                      alt="eye icon"
                      className='absolute right-3 top-5 cursor-pointer'
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  <span className='text-lg text-error'>{errors.password && touched.password && errors.password}</span>
                  <span className='text text-base flex justify-end'><a href='/recoverpass'>Alterar Palavra-Passe</a></span>
                  <div className='pt-10 flex flex-col self-center justify-center'>
                    <button type='submit' className='btn-login' disabled={isSubmitting} onClick={notify}>Entrar</button>
                    <span className='text-base text-center pt-2'>Ainda sem conta? <a href='/signin' className='text'>Clique Aqui!</a></span>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

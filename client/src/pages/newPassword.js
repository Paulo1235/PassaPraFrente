//? CSS
import '../index.css'
//? Logo
import logo from '../images/logoEmpresa.png'
//? Icons
import eyeIco from '../images/eyeIco.svg'

import { Formik } from 'formik';
import { useState } from 'react';

function NewPassword() {

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <div className='App flex justify-center items-center'>
      <div className='black-rectangle flex pl-10 text-3xl'>
        <div className='left ml-20 flex flex-col items-start justify-center'>
          <img src={logo} alt="logo" />
          <span className='text'>Entre vizinhos, tudo se <span className='flex flex-col items-center'>Aproveita!</span></span>
        </div>
        <div className='right ml-20 flex flex-col justify-center'>
          <div className='white-rectangle flex flex-col'>
            <span className='text text-4xl pt-20 pl-10'>Nova Palavra-Passe</span>
            <Formik
              initialValues={{ password: '', password2: ''}}
              validate={values => {
                const errors = {};
                
                if (!values.password) {
                  errors.password = 'Obrigatorio';
                } else if (values.password.length < 6) {
                  errors.password = 'A palavra-passe deve ter pelo menos 6 caracteres';
                }

                if (!values.password2) {
                  errors.password2 = 'Obrigatorio';
                } else if (values.password2.length < 6) {
                  errors.password2 = 'A palavra-passe deve ter pelo menos 6 caracteres';
                } else if (values.password2 !== values.password){
                  errors.password2 = 'As palavras-passe tem de ser iguais';
                }

                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values));
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
                <form onSubmit={handleSubmit} className='mx-20 mt-3 flex flex-col'>
                  <label className='text pt-4' htmlFor='password'>Palavra-Passe:</label>
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
                  <label className='text pt-4' htmlFor='password2'>Confirmar Palavra-Passe:</label>
                  <div className='relative'>
                    <input 
                      className='mt-2 p-2 border border-gray-300 rounded w-full' 
                      type={showPassword2 ? 'text' : 'password'} 
                      id='password2' 
                      name='password2' 
                      placeholder='*******' 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password2}
                    />
                    <img 
                      src={eyeIco} 
                      alt="eye icon" 
                      className='absolute right-3 top-5 cursor-pointer' 
                      onClick={togglePasswordVisibility2}
                    />
                  </div>
                  <span className='text-lg text-error'>{errors.password2 && touched.password2 && errors.password2}</span>
                  <div className='pt-10 flex flex-col self-center justify-center'>
                    <button type='submit' className='btn-login' disabled={isSubmitting}>Enviar</button>
                    <span className='text-base text-center pt-2'>Ainda sem conta? <a href='https://google.com' className='text'>Clique Aqui!</a></span>
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

export default NewPassword;

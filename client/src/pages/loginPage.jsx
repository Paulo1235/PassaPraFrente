import axios from 'axios';
import useAuthStore from '../stores/offstore';
import '../index.css';
import logo from '../images/logoEmpresa.png';
import eyeIco from '../images/eyeIco.svg';
import { Formik } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ToastNotification = () => (
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
);

const Logo = () => (
  <div className='left ml-20 flex flex-col items-start justify-center'>
    <img src={logo} alt="logo" />
    <span className='text'>Entre vizinhos, tudo se <span className='flex flex-col items-center'>Aproveita!</span></span>
  </div>
);

const PasswordInput = ({ showPassword, togglePasswordVisibility, ...props }) => (
  <div className='relative'>
    <input
      className='mt-2 p-2 border border-gray-300 rounded w-full'
      type={showPassword ? 'text' : 'password'}
      {...props}
    />
    <img
      src={eyeIco}
      alt="eye icon"
      className='absolute right-3 top-5 cursor-pointer'
      onClick={togglePasswordVisibility}
    />
  </div>
);

const LoginForm = ({ fields, initialValues, validationSchema, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  return (
    <Formik
      initialValues={initialValues}
      validate={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className='mx-20 mt-5 flex flex-col'>
          {fields.map(({ name, type, label, placeholder }) => (
            <div key={name}>
              <label className='text pt-4' htmlFor={name}>{label}:</label>
              {type === 'password' ? (
                <PasswordInput
                  id={name}
                  name={name}
                  placeholder={placeholder}
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values[name]}
                />
              ) : (
                <input
                  className='mt-2 p-2 border border-gray-300 rounded'
                  type={type}
                  id={name}
                  name={name}
                  placeholder={placeholder}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values[name]}
                />
              )}
              <span className='text-lg text-error'>{errors[name] && touched[name] && errors[name]}</span>
            </div>
          ))}
          <div className='pt-10 flex flex-col self-center justify-center'>
            <button type='submit' className='btn-login' disabled={isSubmitting}>Entrar</button>
          </div>
        </form>
      )}
    </Formik>
  );
};

function Login() {
  const { login } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const notify = (msg) => toast.error(msg);

  const fields = [
    { name: 'email', type: 'text', label: 'Email', placeholder: 'teste@gmail.com' },
    { name: 'password', type: 'password', label: 'Palavra-Passe', placeholder: '*******' }
  ];

  const initialValues = { email: '', password: '' };

  const validationSchema = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Obrigatorio';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Insira um email valido';
    }
    if (!values.password) {
      errors.password = 'Obrigatorio';
    } else if (values.password.length < 6) {
      errors.password = 'A palavra-passe deve ter pelo menos 6 caracteres';
    }
    return errors;
  };

  const handleSubmit = (values, { setSubmitting }) => {
    login(values.email, values.password);
    navigate("/index");
    setSubmitting(false);
  };

  return (
    <div className='App h-[100vh] flex justify-center items-center'>
      <ToastNotification />
      <Helmet>
        <title>Bem-Vindo!</title>
      </Helmet>
      <div className='black-rectangle flex pl-10 text-3xl'>
        <Logo />
        <div className='right ml-20 flex flex-col justify-center'>
          <div className='white-rectangle flex flex-col'>
            <span className='text text-4xl pt-20 pl-10'>Bem-Vindo, entre agora!</span>
            <LoginForm fields={fields} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

//? CSS
import '../index.css'
//? Logo
import logo from '../images/logoEmpresa.png'

import { Formik } from 'formik';

function SignIn() {
  return (
    <div className='App flex justify-center items-center'>
      <div className='black-rectangle flex pl-10 text-3xl'>
        <div className='left ml-20 flex flex-col items-start justify-center'>
          <img src={logo} alt="logo" />
          <span className='text'>Entre vizinhos, tudo se <span className='flex flex-col items-center'>Aproveita!</span></span>
        </div>
        <div className='right ml-20 flex flex-col justify-center'>
          <div className='white-rectangle flex flex-col'>
            <span className='text text-4xl pt-20 pl-10'>Alterar Palavra-Passe</span>
            <span className='text-lg mt-10 mx-20 text-center'>Vai ser enviado um email com um link para <span className='flex flex-col items-center'>escrever a nova palavra passe.</span></span>
            <Formik
              initialValues={{ email: ''}}
              validate={values => {
                const errors = {};
                if (!values.email) {
                  errors.email = 'Obrigatorio';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Insira um email valido';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values.email));
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
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit} className='mx-20 mt-3 flex flex-col'>
                  <label className='text pt-2' htmlFor='email'>Email:</label>
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

export default SignIn;

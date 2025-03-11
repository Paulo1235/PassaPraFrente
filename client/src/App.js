//? CSS
import './index.css'
//? Logo
import logo from './images/logoEmpresa.png'

function App() {
  return (
    <div className='App flex justify-center items-center'>
      <div className='black-rectangle flex pl-10 text-3xl'>
        <div className='left ml-20 flex flex-col items-start justify-center'>
          <img src={logo} alt="logo" />
          <span className='text'>Entre vizinhos, tudo se <span className='flex flex-col items-center'>Aproveita!</span></span>
        </div>
        <div className='right ml-20 flex flex-col justify-center'>
          <div className='white-rectangle flex flex-col'>
            <span className='text text-4xl pt-20 pl-10'>Bem-Vindo, entre agora!</span>
            <form className='mx-20 mt-5 flex flex-col'>
              <label className='text pt-4' htmlFor='email'>Email:</label>
              <input className='mt-2 p-2 border border-gray-300 rounded' type='text' id='email' name='email' placeholder='teste@gmail.com' />
              <label className='text pt-4' htmlFor='username'>Palavra-Passe:</label>
              <input className='mt-2 p-2 border border-gray-300 rounded' type='password' id='password' name='password' placeholder='*******' />
              <span className='text text-base flex justify-end'><a href='https://google.com'>Alterar Palavra-Passe</a></span>
              <div className='pt-10 flex flex-col self-center justify-center'>
                <button type='submit' className='btn-login'>Entrar</button>
                <span className='text-base text-center pt-2'>Ainda sem conta? <a href='https://google.com' className='text'>Clique Aqui!</a></span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

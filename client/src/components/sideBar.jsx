import '../index.css'
import './css/sidebar.css'

//? Logo
import logo from '../images/logoEmpresa.png'

//? Icons
import casa from '../images/casaIco.svg'
import favorito from '../images/coracaoIco.svg'
import pessoa from '../images/pessoaIco.svg'
import mais from '../images/sinal-de-adicaoIco.svg'

//! Fazer a sidebar responsiva

const Sidebar = () => {
    return (
        <div>
            {/* <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button> */}

            <aside id='default-sidebar' className="min-h-screen flex flex-col items-center py-4 fixed ">
                <div className="mb-10 mx-2">
                    <span>
                        <img src={logo} width={116} height={122} alt='logo' />
                    </span>
                </div>
                <nav className="flex flex-col justify-center space-y-4 flex-1 w-full px-4">
                    <button type="button" className="text-[#ADADAD] bg-[#FFFAEE] hover:bg-[#FFFAEE]/90 focus:ring-4 focus:outline-none focus:ring-[#FFFAEE]/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55">
                        <img src={casa} width={24} height={24} className='mr-3' alt='inicio' />
                        <a href='/index'>Inicial</a>
                    </button>
                    {/* <button type="button" className="text-[#ADADAD] bg-[#FFFAEE] hover:bg-[#FFFAEE]/90 focus:ring-4 focus:outline-none focus:ring-[#FFFAEE]/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55">
                        <img src={favorito} width={24} height={24} className='mr-3' alt='favoritos' />
                        Favoritos
                    </button> */}
                    <button type="button" className="text-[#ADADAD] bg-[#FFFAEE] hover:bg-[#FFFAEE]/90 focus:ring-4 focus:outline-none focus:ring-[#FFFAEE]/50 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55">
                        <img src={pessoa} width={24} height={24} className='mr-3' alt='conta' />
                        <a href='/account'>Conta</a> 
                    </button>
                </nav>
                <button className="bg-[#CAAD7E] rounded-lg px-4 py-2 mt-4 mb-20 flex items-center space-x-2">
                    <img src={mais} width={24} height={24} className='mr-3' alt='adicionar' />
                    <span className='text-xl text-white'>Adicionar</span>
                </button>
            </aside>
        </div>
    );
};

export default Sidebar;
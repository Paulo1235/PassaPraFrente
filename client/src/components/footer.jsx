export default function Footer() {
    return (
      <footer className="bg-gray-100 border-t border-gray-200 mt-5">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#73802A]">Sobre Nós</h3>
              <p className="text-gray-600">
                Somos uma loja especializada em roupas de alta qualidade com os melhores preços do mercado.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#73802A]">Links Úteis</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://google.com" className="text-gray-600 hover:text-[#73802A]">
                    Termos e Condições
                  </a>
                </li>
                <li>
                  <a href="https://google.com" className="text-gray-600 hover:text-[#73802A]">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="https://google.com" className="text-gray-600 hover:text-[#73802A]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#73802A]">Contato</h3>
              <address className="not-italic text-gray-600">
                <p>Rua Exemplo, 123</p>
                <p>Cidade, Estado</p>
                <p>Email: contato@exemplo.com</p>
                <p>Telefone: (00) 1234-5678</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Loja. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  
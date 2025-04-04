export default function Footer() {
    return (
      <footer className="bg-gray-100 border-t border-gray-200 mt-5">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#73802A]">Sobre Nós</h3>
              <p className="text-gray-600">
                Somos uma plataforma dedicada a ajudar os vizinhos, seja para comprar, vender, emprestar ou sortear. Facilitamos a conexão entre vizinhos e promover um ambiente seguro e confiável.
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
                <p>IPCA CAMPUS, 4750-810</p>
                <p>Barcelos, Braga</p>
                <p>Email: geral@ipca.pt</p>
                <p>Telefone: 253 802 190</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} PassaPraFrente. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  
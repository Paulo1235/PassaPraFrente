# PassaPraFrente  
## 👥 Grupo Nº 4 – PassaPraFrente

| Número | Nome            |
|--------|------------------|
| 27959  | Duarte Pereira   |
| 27963  | Hugo Especial    |
| 27966  | Paulo Gonçalves  |
| 27969  | Marco Cardoso    |
| 27970  | Hugo Pereira     |

Curso: **Licenciatura em Engenharia de Sistemas Informáticos**  
Ano: **2º Ano**

---

## Estrutura do Projeto

Este projeto está dividido em duas partes principais:

- **Frontend** (client): desenvolvido em JavaScript com React.
- **Backend** (server): desenvolvido em Node.js com a biblioteca Express JS.

## Como Executar

### Pré-requisitos

Certifique-se de que tem o **Node.js** e **npm** instalados.

### 1. Clonar o repositório

```bash
git clone https://github.com/Paulo1235/PassaPraFrente.git
cd PassaPraFrente
```

### 2. Instalar dependências

Instalar dependências para o frontend e backend:

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Executar o frontend

No diretório `client`:

```bash
npm run start
```

### 4. Executar o backend

#### 🔧 Configuração do Ambiente de Desenvolvimento

#### Antes de iniciar o backend em modo de desenvolvimento, é necessário configurar corretamente as variáveis de ambiente:

- Navegue até o diretório `server`.
- Faça uma cópia do ficheiro `development-example.json` e renomeie-a para `development.json`.
- Edite o ficheiro `development.json` com as configurações apropriadas para o seu ambiente local (como credenciais da base de dados, chaves de API, etc.).

Este ficheiro será utilizado para carregar as definições específicas de desenvolvimento, garantindo uma execução segura e isolada da aplicação backend.

#### Para executar os testes corretamente, é necessário configurar um ficheiro de ambiente específico para o modo de testes:

- Navegue até o diretório server.

- Faça uma cópia do ficheiro `test-example.json` e renomeie-a para `test.json`.

- Edite o ficheiro `test.json` com os valores adequados para o ambiente de testes (por exemplo, base de dados de teste, portas dedicadas, ou outras variáveis de teste).

Este ficheiro será utilizado durante a execução dos testes automatizados, garantindo que não interfere com o ambiente de desenvolvimento ou produção.

#### ▶️ Comandos para executar o backend:

- Para desenvolvimento com auto-reload:
  ```bash
  npm run start:dev
  ```

- Para testes:
  ```bash
  npm run test
  ```


## 📄 Licença

Este projeto é apenas para fins educativos.

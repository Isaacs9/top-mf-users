# Microfrontend Top Users (mf-top-users)

Este projeto é o microfrontend responsável pelo módulo de **usuários** dentro da plataforma Top. Ele é desenvolvido em **React 18 + Vite** e utiliza **Module Federation** para integração com o frontend shell principal (`top-frontend`).

## Estrutura do Projeto

```
mf-top-users/
├─ src/
│  ├─ auth/                # Contexto de autenticação compartilhado
│  │  └─ AuthContext.tsx
│  ├─ components/          # Componentes React reutilizáveis
│  ├─ pages/               # Páginas do microfrontend (UsersPage etc.)
│  ├─ services/            # Serviços para chamadas à API do gateway
│  ├─ App.tsx              # Componente raiz do microfrontend
│  └─ index.tsx
├─ public/
├─ package.json
├─ vite.config.ts
└─ tsconfig.json
```

### Tecnologias utilizadas

* React 18
* Vite 4
* TypeScript
* Module Federation (`@originjs/vite-plugin-federation`)
* Fetch API para consumo de microserviços via API Gateway
* Context API para autenticação compartilhada

---

## Scripts Disponíveis

```bash
# Instala as dependências
npm install

# Executa em modo de desenvolvimento (localhost:5001)
npm run dev

# Gera o build de produção
npm run build

# Preview do build
npm run serve
```

---

## Configuração do Vite e Module Federation

Arquivo `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from "@originjs/vite-plugin-federation"

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "users",
      filename: "remoteEntry.js",
      exposes: {
        "./UsersApp": "./src/App.tsx",
        "./AuthContext": "./src/auth/AuthContext.tsx"
      },
      remotes: {
        shell: "http://localhost:5000/assets/remoteEntry.js"
      },
      shared: ["react", "react-dom"]
    })
  ],
  server: {
    port: 5001,
    strictPort: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
```

* `exposes`: exporta componentes e contexto para o shell e outros MF.
* `remotes`: importa o shell principal.
* `shared`: compartilha dependências comuns para evitar duplicação.

---

## Integração com Shell Principal

O microfrontend de usuários é consumido pelo `top-frontend` via Module Federation. No shell, você importa o `UsersApp` e `AuthContext`:

```ts
const UsersApp = React.lazy(() => import("users/UsersApp"));
const AuthContext = React.lazy(() => import("users/AuthContext"));
```

---

## Estrutura para CRUD de Usuários

* `UsersPage.tsx`: página principal de listagem e manipulação de usuários.
* `UserService.ts`: encapsula todas as chamadas HTTP ao gateway.
* `AuthContext.tsx`: gerencia token e dados do usuário logado.

---

## Testes

Para rodar os testes unitários, configure seu ambiente:

```bash
npm run test
```

Exemplo de cobertura de testes:

```
coverage/
└─ users/
   ├─ AuthContext.test.tsx
   ├─ UsersPage.test.tsx
   └─ UserService.test.ts
```

Você pode adicionar prints da cobertura aqui:

![Print de cobertura](./docs/coverage-users.png)

---

## Observações

* Certifique-se de que o **API Gateway (`top-api-gateway`)** esteja rodando em `http://localhost:3000` para que o microfrontend consiga consumir os endpoints de usuários.
* Durante o desenvolvimento, use `npm run dev` para hot reload e integração com o shell.
* Para produção, execute `npm run build` e configure o shell para apontar para o build gerado (`/dist/assets/remoteEntry.js`).

## 👨‍💻 Autores

- **Isaac Pereira** – arquitetura e desenvolvimento

---

## 📜 Licença

Este projeto está licenciado sob os termos da licença MIT.

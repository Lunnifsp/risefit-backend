# 🏋️‍♂️ RiseFit — Backend API

API RESTful do ecossistema **RiseFit**, desenvolvida com **NestJS**, **Prisma ORM** e **PostgreSQL**. O backend é responsável pela inteligência de negócios, autenticação, controle de permissões por perfil, validações com Zod e persistência de dados do sistema.

---

## 🚀 Tecnologias e Ferramentas

- **Core:** [NestJS](https://nestjs.com/) (Node.js framework)
- **Linguagem:** TypeScript
- **ORM:** [Prisma ORM](https://www.prisma.io/)
- **Banco de Dados:** PostgreSQL (gerenciado via Supabase / local)
- **Validação de Schemas:** [Zod](https://zod.dev/)
- **Observabilidade & Telemetria:** `@nestjs/observe` (OpenTelemetry)
- **Testes Unitários e E2E:** [Vitest](https://vitest.dev/)
- **Linter e Formatação:** Oxlint & Prettier

---

## 📌 Arquitetura & Principais Regras de Negócio

### Perfis de Acesso (`Role`)
- **`ALUNO`**: Acesso à área pessoal, consulta de planos, serviços contratados e histórico.
- **`PROFISSIONAL`**: Acesso ao perfil profissional vinculado, áreas de atuação e acompanhamento dos alunos.
- **`ADMIN`**: Gestão global (usuários, profissionais, planos, catálogo da loja e eventos).

### Regras de Negócio Importantes
- **RN001 — Limite de Acesso por Plano:** Validação de acessos a 1 unidade (*Rise Start*) ou ilimitado (*Rise Pro*).
- **RN002 — Cota de Convidados:** Controle mensal de convites (3 para *Rise Start*, 5 para *Rise Pro*).
- **RN003 — Restrição de Cadastro Único:** Garantia de e-mails e CPFs únicos na base.
- **RN004 — Inativação Lógica:** Usuários, profissionais ou planos desativados utilizam exclusão lógica (`ativo = false`) para preservação do histórico.

---

## 🗄️ Estrutura do Banco de Dados (Prisma Models)

- **`User` (`usuarios`)**: Tabela de usuários com controle de perfis (`ALUNO`, `PROFISSIONAL`, `ADMIN`).
- **`Professional` (`profissionais`)**: Vínculo 1:1 com `User` contendo especialização, biografia e foto.
- **`Subscription` / `Plan`**: Gestão de planos da academia.
- **`Order` / `EventParticipant`**: Histórico de compras na vitrine e participações em eventos.

---

## ⚙️ Pré-requisitos

- **Node.js** (v18+ recomendado)
- **PostgreSQL** ativo (ou URL do Supabase)
- **npm** ou **yarn / pnpm**

---

## 🛠️ Configuração e Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/risefit-backend.git
   cd risefit-backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente (`.env`):**
   Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/risefit?schema=public"
   PORT=3000

   # Observabilidade (NestJS Observe)
   OBSERVE_APP_KEY="sua_app_key"
   OBSERVE_APP_SECRET="seu_app_secret"
   ```

4. **Execute as Migrações do Prisma:**
   ```bash
   npx prisma migrate dev
   ```

5. **Popule o Banco de Dados (Seed):**
   ```bash
   npm run seed
   ```

---

## 🏃‍♂️ Executando a Aplicação

```bash
# Modo de desenvolvimento (com auto-reload via Nest CLI)
npm run start:dev

# Modo de produção
npm run build
npm run start:prod

# Modo debug
npm run start:debug
```

---

## 🧪 Testes & Qualidade de Código

Este repositório utiliza **Vitest** para testes unitários e E2E, e **Oxlint** para análise estática.

```bash
# Executar todos os testes unitários
npm run test

# Executar testes em modo watch
npm run test:watch

# Relatório de cobertura de código
npm run test:cov

# Executar testes End-to-End (E2E)
npm run test:e2e

# Verificar qualidade do código (Linter)
npm run lint

# Formatar o código (Prettier)
npm run format
```

---

## 👥 Equipe de Desenvolvimento

- **Ariel Vinícius**
- **Gianluca Moreno**
- **Isaque Barcelos**
- **Luanna Fiedler**
- **Matheus Pires**
- **Sabrina Garcia**

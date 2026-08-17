# Guia de Deploy — Daniel de Souza Advocacia

## Pré-requisitos

- Node.js 20+ instalado
- Conta em um provedor que suporte Node.js (ver opções abaixo)
- Banco de dados MySQL (ou PostgreSQL)

---

## Opção 1: Vercel + PlanetScale (recomendado — gratuito)

### 1.1 Subir no GitHub
```bash
cd "F:\Daniel Borghi Advogado\Logo_Site\Projeto_Site_WordPress"
git init
git add .
git commit -m "v1.0 — Site institucional Daniel de Souza Advocacia"
# Criar repositório vazio no GitHub, depois:
git remote add origin https://github.com/SEU-USER/daniel-souza-advocacia.git
git push -u origin main
```

### 1.2 Criar banco no PlanetScale
1. Acesse [planetscale.com](https://planetscale.com) e crie conta
2. Crie um banco: `daniel-souza-advocacia`
3. Copie a **connection string** (MySQL)
4. Formato: `mysql://username:password@aws.connect.psdb.cloud/daniel-souza-advocacia?sslaccept=strict`

### 1.3 Importar no Vercel
1. Acesse [vercel.com](https://vercel.com), crie conta
2. "Add New Project" → "Import Git Repository"
3. Selecione o repositório
4. Framework: Next.js (detecta automaticamente)
5. Variáveis de ambiente (seção "Environment Variables"):

| Chave | Valor |
|---|---|
| `DATABASE_URL` | connection string do PlanetScale |
| `AUTH_SECRET` | gere com `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://seudominio.com.br` |
| `CONTACT_EMAIL` | seu e-mail |

6. Clique "Deploy"

### 1.4 Configurar domínio
1. No Vercel: Settings → Domains → adicione seu domínio
2. No hospedameusite (ou registrador de domínio):
   - Crie um registro CNAME: `www` → `cname.vercel-dns.com`
   - Ou aponte os nameservers para o Vercel (optiona)

### 1.5 Rodar setup
Após o primeiro deploy, acesse o terminal do Vercel ou rode localmente:
```bash
DATABASE_URL="sua-connection-string" npx tsx prisma/setup.ts
```
Isso cria o admin (`admin@seudominio.com.br` / `Admin@2025!`) e as configurações básicas.

Acesse `/admin` para substituir os dados placeholder pelos reais.

---

## Opção 2: Render.com (gratuito com limitações)

### 2.1 Criar conta em [render.com](https://render.com)

### 2.2 Criar banco de dados MySQL
1. "New" → "MySQL"
2. Nome: `daniel-souza-advocacia`
3. Copie a connection string

### 2.3 Criar Web Service
1. "New" → "Web Service"
2. Conecte o repositório GitHub
3. Configurações:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (512MB RAM) ou Starter ($7/mês)
4. Variáveis de ambiente (mesmas da Opção 1.5)
5. Clique "Create Web Service"

### 2.4 Setup do banco
Após deploy, rode o setup pelo terminal do Render ou localmente com a DATABASE_URL.

**Nota:** O plano gratuito do Render tem sleep após 15 min de inatividade (primeira requisição pode levar ~30s).

---

## Opção 3: VPS com cPanel + Node.js

### 3.1 Configurar o VPS
1. Contrate um VPS com Node.js (ex.: Hostinger VPS, DigitalOcean)
2. Instale o cPanel com Node.js Selector
3. Crie o banco de dados MySQL no cPanel → "MySQL Databases"
4. Anote: host, usuário, senha, nome do banco

### 3.2 Build local (NUNCA no servidor compartilhado)
```bash
# No seu computador
npm run build
```

### 3.3 Upload via FTP/FileZilla
1. Conecte ao servidor via FTP
2. Navegue até `public_html/` (ou o diretório do domínio)
3. Upload de TUDO exceto:
   - `node_modules/`
   - `.git/`
   - `.next/cache/`
   - `prisma/dev.db`
   - `.env` (será criado no servidor)

### 3.4 Configurar no cPanel
1. cPanel → "Setup Node.js App" (ou "Node.js Selector")
2. Versão: Node.js 20.x
3. Modo: Production
4. Startup file: `server.js` (crie — ver abaixo)
5. Variáveis de ambiente: configure no painel
6. "Run NPM Install"
7. "Start App"

### 3.5 Criar server.js (se não existir)
No root do projeto:
```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000, () => {
    console.log(`> Pronto em http://localhost:${process.env.PORT || 3000}`);
  });
});
```

### 3.6 Rodar setup
No cPanel terminal ou SSH:
```bash
cd /caminho/para/o/projeto
npx prisma generate
npx prisma db push
npx tsx prisma/setup.ts
```

---

## Configuração do Banco de Dados

### Criar banco (cPanel)
1. cPanel → "MySQL Databases"
2. Crie um banco: `daniel_souza_advocacia`
3. Crie um usuário MySQL com senha forte
4. Adicione o usuário ao banco com "All Privileges"

### Variável DATABASE_URL
```
mysql://USUARIO_DB:SENHA_DB@localhost:3306/daniel_souza_advocacia
```

Para hosts remotos (PlanetScale, AWS, etc.), use a connection string fornecida pelo provedor.

---

## Comandos Úteis

| Comando | Uso |
|---|---|
| `npm run build` | Build de produção |
| `npm start` | Iniciar servidor de produção |
| `npx prisma generate` | Gerar cliente Prisma |
| `npx prisma db push` | Sincronizar schema com o banco |
| `npx prisma setup:prod` | Gerar + push + setup admin |
| `npx prisma studio` | GUI para visualizar/editar dados |
| `npx prisma db seed` | Popular com dados demo (desenvolvimento) |

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | Connection string do banco (MySQL/PostgreSQL) |
| `AUTH_SECRET` | Sim | Chave para JWT (mínimo 32 caracteres) |
| `NEXT_PUBLIC_SITE_URL` | Sim | URL pública do site (HTTPS) |
| `CONTACT_EMAIL` | Sim | E-mail que recebe formulários de contato |

---

## Checklist de Deploy

- [ ] Criar banco de dados MySQL
- [ ] Configurar `.env` com dados reais
- [ ] Rodar `npx prisma db push` para sincronizar schema
- [ ] Rodar `npx tsx prisma/setup.ts` para criar admin + configurações
- [ ] Build de produção: `npm run build`
- [ ] Acessar `/admin` e substituir dados placeholder
- [ ] Alterar senha do admin
- [ ] Configurar domínio e SSL
- [ ] Testar formulário de contato
- [ ] Testar newsletter signup
- [ ] Verificar SEO (sitemap, robots.txt)

# projeto-seguranca-sdlc

> **Disciplina:** Segurança de Software  
> **Tema:** 11 — Boas Práticas no Desenvolvimento Seguro  
> **Professor:** Weldes Lima Oliveira  
> **Ferramentas:** GitHub Advanced Security (Dependabot, CodeQL, Secret Scanning)

---

## ⚠️ Aviso

Este projeto contém código e dependências **intencionalmente inseguros** para fins
exclusivamente didáticos. **Não utilizar em produção.**  
Todas as práticas foram realizadas em repositório de teste isolado.

---

## Estrutura do Projeto

```
projeto-seguranca-sdlc/
├── .github/
│   ├── workflows/
│   │   └── codeql.yml          # Workflow de análise estática (CodeQL)
│   └── dependabot.yml          # Configuração do Dependabot
├── config/
│   └── api.js                  # ⚠️ Token exposto (aciona Secret Scanning)
├── src/
│   ├── db.js                   # ⚠️ SQL Injection (aciona Code Scanning)
│   └── index.js                # App Express com dependências vulneráveis
├── .gitignore
├── package.json                # ⚠️ Dependências com CVEs (aciona Dependabot)
└── README.md
```

---

## Vulnerabilidades Intencionais

| Arquivo | Vulnerabilidade | Ferramenta do GHAS Acionada |
|---|---|---|
| `package.json` | 5 dependências com CVEs conhecidas | Dependabot Alerts |
| `src/db.js` | SQL Injection (concatenação direta) | Code Scanning — CodeQL |
| `config/api.js` | Token GitHub exposto no código | Secret Scanning |

### Dependências vulneráveis (CVEs):

| Pacote | Versão | CVE | CVSS |
|---|---|---|---|
| minimist | 1.2.5 | CVE-2021-44906 | 9.8 Crítica |
| node-fetch | 2.6.1 | CVE-2022-0235 | 8.8 Alta |
| axios | 0.21.1 | CVE-2021-3749 | 7.5 Alta |
| lodash | 4.17.15 | CVE-2021-23337 | 7.2 Alta |
| express | 4.17.1 | CVE-2022-24999 | 5.3 Média |

---

## Como usar para o trabalho

### 1. Criar o repositório no GitHub

```bash
# Crie um repositório PÚBLICO no github.com e então:
git init
git remote add origin https://github.com/<seu-usuario>/projeto-seguranca-sdlc.git
git add .
git commit -m "feat: projeto inicial com vulnerabilidades didáticas"
git push -u origin main
```

> **Importante:** o repositório precisa ser **público** para usar o GitHub
> Advanced Security gratuitamente.

### 2. Ativar o GitHub Advanced Security

No repositório, acesse:  
`Settings` → `Code security and analysis` → ative:
- ✅ Dependency graph
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Code scanning → `Set up` → `Default`
- ✅ Secret scanning (já ativo em repositórios públicos)

### 3. Aguardar os alertas

| Funcionalidade | Tempo estimado |
|---|---|
| Secret Scanning | segundos após o push |
| Dependabot Alerts | ~3 minutos |
| Code Scanning (CodeQL) | ~4 minutos |

### 4. Tirar os prints

Acesse a aba `Security` do repositório e capture:

- **Print 1:** aba Security > Overview (resumo geral)
- **Print 2:** aba Security > Dependabot (lista dos 5 alertas)
- **Print 3:** detalhe do alerta CVE-2021-44906 (minimist)
- **Print 4:** PR automático do Dependabot
- **Print 5:** aba Security > Code scanning (alerta SQL Injection)
- **Print 6:** detalhe do alerta com data flow path do CodeQL
- **Print 7:** aba Security > Secret scanning (token detectado)
- **Print 8:** Security Overview após correções (0 alertas)

### 5. Aplicar as correções (para o print final)

```bash
# 1. Atualizar dependências vulneráveis
npm update minimist node-fetch axios lodash express

# 2. Corrigir SQL Injection em src/db.js
#    → substituir concatenação por prepared statement (ver comentário no arquivo)

# 3. Remover token exposto de config/api.js
#    → usar process.env.API_KEY no lugar

# 4. Commitar as correções
git add .
git commit -m "fix: corrige vulnerabilidades identificadas pelo GHAS"
git push
```

---

## Rotas da Aplicação

```
GET  /usuario?nome=<nome>   → busca usuário no banco (SQL Injection)
POST /template              → renderiza template lodash (Command Injection)
GET  /proxy?url=<url>       → proxy HTTP via axios (SSRF)
GET  /fetch?url=<url>       → fetch HTTP via node-fetch (header leak)
```

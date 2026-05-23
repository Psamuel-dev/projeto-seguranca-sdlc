//src/index.js
// ============================================================
// Aplicação Express de exemplo — usa dependências com CVEs
// conhecidas para acionar o Dependabot do GitHub Advanced
// Security. Apenas para fins didáticos.
// ============================================================

const express = require("express");       // v4.17.1 — CVE-2022-24999
const axios   = require("axios");         // v0.21.1 — CVE-2021-3749
const _       = require("lodash");        // v4.17.15 — CVE-2021-23337
const fetch   = require("node-fetch");    // v2.6.1  — CVE-2022-0235
const minimist = require("minimist");     // v1.2.5  — CVE-2021-44906 (Crítica)

const { buscarUsuario } = require("./db");
const config = require("../config/api");

const app = express();
app.use(express.json());

// -------------------------------------------------------
// Rota 1: busca de usuário — vulnerável a SQL Injection
// GET /usuario?nome=Alice
// Ataque: GET /usuario?nome=' OR '1'='1
// -------------------------------------------------------
app.get("/usuario", async (req, res) => {
  const { nome } = req.query;

  if (!nome) {
    return res.status(400).json({ erro: "Parâmetro 'nome' é obrigatório." });
  }

  try {
    const resultado = await buscarUsuario(nome); // função vulnerável em src/db.js
    res.json({ usuarios: resultado });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// -------------------------------------------------------
// Rota 2: uso do lodash — método template() vulnerável
// CVE-2021-23337: Command Injection via lodash.template()
// -------------------------------------------------------
app.post("/template", (req, res) => {
  const { texto } = req.body;

  // lodash.template() compila a string como código JavaScript
  // Um atacante pode injetar código via interpolação <%= ... %>
  const compilado = _.template(texto);
  const resultado = compilado({});

  res.json({ resultado });
});

// -------------------------------------------------------
// Rota 3: proxy de requisições — vulnerável a SSRF
// CVE-2021-3749 (axios): segue redirecionamentos indevidos
// GET /proxy?url=https://site-externo.com/dados
// Ataque: GET /proxy?url=http://169.254.169.254/metadata
// -------------------------------------------------------
app.get("/proxy", async (req, res) => {
  const { url } = req.query;

  try {
    // axios 0.21.1 segue redirecionamentos sem validação,
    // expondo cabeçalhos de autorização (SSRF)
    const resposta = await axios.get(url);
    res.json({ dados: resposta.data });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// -------------------------------------------------------
// Rota 4: uso de node-fetch — CVE-2022-0235
// Redirecionamentos expõem cabeçalhos Authorization
// -------------------------------------------------------
app.get("/fetch", async (req, res) => {
  const { url } = req.query;

  const resposta = await fetch(url, {
    headers: { Authorization: `Bearer ${config.api.key}` },
    // node-fetch 2.6.1 repassa o header Authorization mesmo
    // após redirecionamentos para domínios diferentes (CVE-2022-0235)
  });

  const dados = await resposta.json();
  res.json({ dados });
});

// -------------------------------------------------------
// Uso de minimist — CVE-2021-44906 (Crítica: CVSS 9.8)
// Prototype Pollution via parsing de argumentos de linha
// de comando. Exemplo de ataque:
//   node index.js --__proto__.admin=true
// -------------------------------------------------------
const args = minimist(process.argv.slice(2));
if (args.debug) {
  console.log("[DEBUG] Argumentos recebidos:", args);
}

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http:localhost:${PORT}`);
  console.log("Rotas disponíveis:");
  console.log("  GET  /usuario?nome=<nome>  → busca usuário (SQL Injection)");
  console.log("  POST /template             → renderiza template (Command Injection)");
  console.log("  GET  /proxy?url=<url>      → proxy HTTP (SSRF via axios)");
  console.log("  GET  /fetch?url=<url>      → fetch HTTP (header leak via node-fetch)");
});

module.exports = app;

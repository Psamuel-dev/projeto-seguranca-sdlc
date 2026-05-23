//config/api.js
// ============================================================
// ATENÇÃO: Este arquivo contém uma credencial FICTÍCIA
// exposta intencionalmente para fins didáticos.
// Em projetos reais, NUNCA commitar tokens ou senhas.
// Use variáveis de ambiente (.env) ou um secrets manager.
// ============================================================

// Chave de API fictícia no formato de GitHub Personal Access Token
// O Secret Scanning do GitHub irá detectar este padrão (ghp_...)
const API_KEY = "ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8";

const DB_PASSWORD = "minha_senha_super_secreta_123";


 const config = {
   api: {
     key: process.env.API_KEY,       // lê da variável de ambiente
     baseUrl: process.env.API_URL,
     timeout: 5000,
   },
   database: {
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     name: process.env.DB_NAME,
     password: process.env.DB_PASSWORD,
   },
 };

module.exports = config;

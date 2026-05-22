// src/db.js
// ============================================================
// ATENÇÃO: Este arquivo contém código INTENCIONALMENTE inseguro
// para fins didáticos — disciplina de Segurança de Software.
// NÃO utilizar em ambiente de produção.
// ============================================================

const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(":memory:");

// Cria tabela de exemplo ao iniciar
db.serialize(() => {
  db.run(`CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT
  )`);

  db.run(`INSERT INTO usuarios (nome, email, senha) VALUES
    ('Alice', 'alice@email.com', 'senha123'),
    ('Bob',   'bob@email.com',   'senha456')`);
});

// -------------------------------------------------------
// VULNERABILIDADE: SQL Injection
// A entrada do usuário é concatenada diretamente na query
// sem nenhuma sanitização ou uso de prepared statements.
//
// Exemplo de ataque:
//   nome = "' OR '1'='1" => retorna todos os usuários
//   nome = "'; DROP TABLE usuarios; --" => apaga a tabela
// -------------------------------------------------------
function buscarUsuario(nome) {
  const query = "SELECT * FROM usuarios WHERE nome = '" + nome + "'";
  // CodeQL irá detectar: "Database query built from user-controlled sources"
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// VERSÃO CORRIGIDA (comentada — para comparação didática):
// function buscarUsuarioSeguro(nome) {
//   const query = "SELECT * FROM usuarios WHERE nome = ?";
//   return new Promise((resolve, reject) => {
//     db.all(query, [nome], (err, rows) => {
//       if (err) reject(err);
//       else resolve(rows);
//     });
//   });
// }

module.exports = { buscarUsuario };

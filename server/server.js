require("dotenv").config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();

// 🔥 PORTA CORRETA PRA PRODUÇÃO
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto';

// 🔥 BANCO
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Testa conexão
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ ERRO AO CONECTAR NO MYSQL:", err);
  } else {
    console.log("✅ Conectado ao MySQL");
    connection.release();
  }
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// ================== ROTAS ==================

app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, sobrenome, email, telefone, senha, tipo_usuario } = req.body;

    if (!nome || !sobrenome || !email || !telefone || !senha || !tipo_usuario) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = `
      INSERT INTO usuarios (nome, sobrenome, email, telefone, senha, tipo_usuario)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, sobrenome, email, telefone, senhaHash, tipo_usuario], (err) => {
      if (err) {
        console.error("❌ ERRO MYSQL:", err);
        return res.status(500).json({ error: "Erro ao inserir no banco." });
      }

      res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });

  } catch (err) {
    console.error("❌ ERRO NO CADASTRO:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (results.length === 0) return res.status(401).json({ error: "Usuário não encontrado." });

    const user = results[0];
    const match = await bcrypt.compare(senha, user.senha);

    if (!match) return res.status(401).json({ error: "Senha incorreta." });

    const token = jwt.sign(
      { id: user.id_usuario },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      usuario: {
        id: user.id_usuario,
        nome: user.nome,
        sobrenome: user.sobrenome,
        tipo: user.tipo_usuario
      }
    });
  });
});

app.get('/api/perfil', autenticarJWT, (req, res) => {
  const sql = `
    SELECT nome, sobrenome, email, telefone, tipo_usuario
    FROM usuarios
    WHERE id_usuario = ?
  `;

  db.query(sql, [req.userId], (err, results) => {
    if (err) {
      console.error("ERRO NO PERFIL:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(results[0]);
  });
});


// rota teste
app.get("/", (req, res) => {
  res.send("🚀 Servidor online!");
});

// ================== START ==================
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

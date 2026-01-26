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

// 🔥 BANCO COM TRATAMENTO DE ERRO
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Testa conexão com banco
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

// arquivos estáticos
app.use('/Cursos', express.static(path.join(__dirname, '..', 'Cursos')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'cadastro')));
app.use(express.static(path.join(__dirname, '..', 'login')));
app.use(express.static(path.join(__dirname, '..', 'perfil')));
app.use(express.static(path.join(__dirname, '..', 'home')));
app.use(express.static(path.join(__dirname, '..', 'sobre')));
app.use(express.static(path.join(__dirname, 'public')));

// ================== MIDDLEWARES ==================
function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido." });
    req.userId = decoded.id;
    next();
  });
}

function verificarProfessor(req, res, next) {
  const sql = "SELECT tipo_usuario FROM usuarios WHERE id_usuario = ?";
  db.query(sql, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (results.length === 0) return res.status(404).json({ error: "Usuário não encontrado." });

    if (results[0].tipo_usuario !== "professor") {
      return res.status(403).json({ error: "Acesso negado. Apenas professores." });
    }

    next();
  });
}

// ================== ROTAS ==================
app.post('/api/cadastro', async (req, res) => {
  const { nome, sobrenome, email, telefone, senha, tipo_usuario } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = `
      INSERT INTO usuarios (nome, sobrenome, email, telefone, senha, tipo_usuario)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, sobrenome, email, telefone, senhaHash, tipo_usuario], (err) => {
      if (err) {
        console.error("ERRO MYSQL:", err);
        return res.status(500).json({ error: err.sqlMessage });
      }

      res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });

  } catch (err) {
    console.error("ERRO GERAL:", err);
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
    FROM usuarios WHERE id_usuario = ?
  `;

  db.query(sql, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (results.length === 0) return res.status(404).json({ error: "Usuário não encontrado." });

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

const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const PORT = 3000;
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'seuSegredoSuperSecreto';


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "cursos_online",
});


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/Cursos', express.static(path.join(__dirname, '..', 'Cursos')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'cadastro')));
app.use(express.static(path.join(__dirname, '..', 'login')));
app.use(express.static(path.join(__dirname, '..', 'perfil')));
app.use(express.static(path.join(__dirname, '..', 'home')));
app.use(express.static(path.join(__dirname, '..', 'sobre')));
app.use(express.static(path.join(__dirname, 'public')));


function verificarProfessor(req, res, next) {
  const sql = "SELECT tipo_usuario FROM usuarios WHERE id = ?";
  db.query(sql, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (results.length === 0) return res.status(404).json({ error: "Usuário não encontrado." });

    const user = results[0];
    if (user.tipo_usuario !== "professor") {
      return res.status(403).json({ error: "Acesso negado. Apenas professores podem realizar esta ação." });
    }
    next();
  });
}

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

app.post('/api/cadastro', async (req, res) => {
  const { nome, sobrenome, email, telefone, senha, tipo_usuario } = req.body;
  if (!nome || !sobrenome || !email || !telefone || !senha || !tipo_usuario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const nomeCompleto = `${nome} ${sobrenome}`;

    const sql = `
        INSERT INTO usuarios (nome, email, telefone, senha, tipo_usuario)
        VALUES (?, ?, ?, ?, ?)
      `;
    db.query(sql, [nomeCompleto, email, telefone, senhaHash, tipo_usuario], (err) => {
      if (err) {
        console.error("Erro ao inserir usuário:", err);
        return res.status(500).json({ error: "Erro ao cadastrar." });
      }
      res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
  } catch (err) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  const sql = "SELECT id_usuario, nome, email, telefone, senha, tipo_usuario FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Erro no query de login:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const user = results[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  });
});


app.get('/api/perfil', autenticarJWT, (req, res) => {
  const sql = "SELECT nome, email, telefone, tipo_usuario FROM usuarios WHERE id = ?";
  db.query(sql, [req.userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar perfil:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(results[0]);
  });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
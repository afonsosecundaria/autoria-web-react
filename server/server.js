require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "seuSegredoSuperSecreto";

// BANCO
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// TESTE CONEXÃO
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

// ================== MIDDLEWARE ==================
function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido." });

    req.userId = decoded.id;
    next();
  });
}

// ================== ROTAS ==================

app.post("/api/cadastro", async (req, res) => {
  try {
    const { nome, sobrenome, email, telefone, senha, tipo_usuario } = req.body;

    if (!nome || !sobrenome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({ error: "Dados incompletos." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = `
      INSERT INTO usuarios (nome, sobrenome, email, telefone, senha, tipo_usuario)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [nome, sobrenome, email, telefone, senhaHash, tipo_usuario],
      (err) => {
        if (err) return res.status(500).json({ error: "Erro ao cadastrar." });
        res.status(201).json({ message: "Usuário cadastrado!" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Erro interno." });
  }
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (results.length === 0)
      return res.status(401).json({ error: "Usuário não encontrado." });

    const user = results[0];
    const match = await bcrypt.compare(senha, user.senha);

    if (!match)
      return res.status(401).json({ error: "Senha incorreta." });

    const token = jwt.sign({ id: user.id_usuario }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      usuario: {
        id: user.id_usuario,
        nome: user.nome,
        tipo_usuario: user.tipo_usuario,
      },
    });
  });
});

// PERFIL
app.get("/api/perfil", autenticarJWT, (req, res) => {
  const sql = `
    SELECT nome, sobrenome, email, telefone, tipo_usuario
    FROM usuarios
    WHERE id_usuario = ?
  `;

  db.query(sql, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (results.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(results[0]);
  });
});

// LISTAR CURSOS
app.get("/api/cursos", autenticarJWT, (req, res) => {
  const sql = `
    SELECT c.*, u.nome AS professor
    FROM cursos c
    JOIN usuarios u ON c.id_professor = u.id_usuario
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// CRIAR CURSO (PROFESSOR)
app.post("/api/cursos", autenticarJWT, (req, res) => {
  const { titulo, descricao } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  const sqlUsuario = "SELECT tipo_usuario FROM usuarios WHERE id_usuario = ?";

  db.query(sqlUsuario, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });

    if (results[0].tipo_usuario !== "professor") {
      return res.status(403).json({ error: "Apenas professores." });
    }

    const sqlCurso = `
      INSERT INTO cursos (id_professor, titulo, descricao)
      VALUES (?, ?, ?)
    `;

    db.query(sqlCurso, [req.userId, titulo, descricao], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Curso criado!" });
    });
  });
});

// MATRICULAR
app.post("/api/matriculas", autenticarJWT, (req, res) => {
  const { id_curso } = req.body;

  const sqlCheck = `
    SELECT * FROM matriculas WHERE id_usuario = ? AND id_curso = ?
  `;

  db.query(sqlCheck, [req.userId, id_curso], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ error: "Já matriculado." });
    }

    const sql = `
      INSERT INTO matriculas (id_usuario, id_curso)
      VALUES (?, ?)
    `;

    db.query(sql, [req.userId, id_curso], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Matrícula realizada!" });
    });
  });
});

// DETALHE DO CURSO
app.get("/api/cursos/:id", autenticarJWT, (req, res) => {
  const idCurso = req.params.id;

  const sql = `
    SELECT t.id_topico, t.titulo AS topico, t.descricao,
           m.id_material, m.tipo, m.titulo AS material, m.url_arquivo
    FROM topicos t
    LEFT JOIN materiais m ON t.id_topico = m.id_topico
    WHERE t.id_curso = ?
  `;

  db.query(sql, [idCurso], (err, results) => {
    if (err) return res.status(500).json(err);

    const topicos = {};

    results.forEach((r) => {
      if (!topicos[r.id_topico]) {
        topicos[r.id_topico] = {
          id_topico: r.id_topico,
          titulo: r.topico,
          descricao: r.descricao,
          materiais: [],
        };
      }

      if (r.id_material) {
        topicos[r.id_topico].materiais.push({
          id_material: r.id_material,
          tipo: r.tipo,
          titulo: r.material,
          url_arquivo: r.url_arquivo,
        });
      }
    });

    res.json(Object.values(topicos));
  });
});

// TESTE
app.get("/", (req, res) => {
  res.send("🚀 Servidor online!");
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

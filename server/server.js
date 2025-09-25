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

/////

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "autoriaweb",
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Serve os arquivos estáticos das páginas HTML
app.use('/Cursos', express.static(path.join(__dirname, '..', 'Cursos')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'cadastro')));
app.use(express.static(path.join(__dirname, '..', 'login')));
app.use(express.static(path.join(__dirname, '..', 'perfil')));
app.use(express.static(path.join(__dirname, '..', 'home')));
app.use(express.static(path.join(__dirname, '..', 'sobre')));
app.use(express.static(path.join(__dirname, 'public')));

/////////// Verificar se é professor

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


////////////// JWT auth

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
        INSERT INTO usuarios (nome, email, telefone, senha_hash, tipo_usuario)
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

  const sql = "SELECT id, nome, email, telefone, senha_hash, tipo_usuario FROM usuarios WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Erro no query de login:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const user = results[0];
    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  });
});

//////////////

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

////////////


const cursosPath = path.join(__dirname, 'data', 'cursos.json');

// Configuração de onde os PDFs serão salvos
const storageExercicios = multer.diskStorage({
  destination: function (req, file, cb) {
    const slug = req.params.slug;
    const capituloIndex = req.params.capituloIndex;
    const dir = path.join(__dirname, '..', 'Cursos', slug, 'exercicios', capituloIndex);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const uploadExercicios = multer({ storage: storageExercicios });

// storage global para uploads (imagens etc.)
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storageUploads = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // preserva extensão
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage: storageUploads });


// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));


// Rota GET /api/cursos  -> retorna lista com alias para "nome" (compatível frontend)

app.get('/api/cursos', (req, res) => {
  // alias titulo AS nome para frontend que espera course.nome
  const sql = 'SELECT id, professor_id, titulo AS nome, descricao, imagem, slug, link, criado_em FROM cursos ORDER BY criado_em DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar cursos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar cursos' });
    }
    res.json(results);
  });
});

const uploadCurso = multer({ storage: storageUploads }); // usar mesma pasta uploads

app.post('/api/cursos', autenticarJWT, verificarProfessor, uploadCurso.single('imagem'), (req, res) => {
  const { titulo, descricao } = req.body;
  const file = req.file;
   const imagemPath = file ? `/uploads/${file.filename}` : null;

  if (!titulo || !descricao) {
    // se não enviar imagem, ainda permitimos — opcional; se quiser obrigar, verifique file também
    return res.status(400).json({ erro: 'Nome e descrição são obrigatórios.' });
  }

  const slug = slugify(titulo);
  const link = `/Cursos/${slug}/index.html`;
  const professorId = req.userId;

  const sql = `INSERT INTO cursos (professor_id, titulo, descricao, imagem, slug, link) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [professorId, titulo, descricao, imagemPath, slug, link], (err, result) => {
    if (err) {
      console.error('Erro ao criar curso (db):', err.sqlMessage || err);
      return res.status(500).json({ erro: 'Erro ao criar curso' });
    }

    const cursoId = result.insertId;

    // opcional: cria pasta do curso copiando template (se existir)
    try {
      const newDir = path.join(__dirname, '..', 'Cursos', slug);
      const templateDir = path.join(__dirname, 'template');
      fs.mkdirSync(newDir, { recursive: true });

      if (fs.existsSync(path.join(templateDir, 'curso.html'))) {
        fs.copyFileSync(path.join(templateDir, 'curso.html'), path.join(newDir, 'index.html'));
      }
      if (fs.existsSync(path.join(templateDir, 'style.css'))) {
        fs.copyFileSync(path.join(templateDir, 'style.css'), path.join(newDir, 'style.css'));
      }
      if (fs.existsSync(path.join(templateDir, 'scriptt.js'))) {
        fs.copyFileSync(path.join(templateDir, 'scriptt.js'), path.join(newDir, 'scriptt.js'));
      }
    } catch (err) {
      console.error('Erro ao copiar template do curso:', err);
      // não falha a requisição por conta disso
    }

    res.status(201).json({
      mensagem: 'Curso criado com sucesso!',
      id: cursoId,
      slug,
      link,
      imagem: imagemPath
    });
  });
});


// ============================================================================
// Utilities
// ============================================================================
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
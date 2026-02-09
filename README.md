# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# Link da aplicação

- https://autoria-web-react.vercel.app/

# Como executar

- npm run dev

Dependências:

Front end:

- npm install -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p

Backend:

- npm install node mysql cors express bcrypt

# Banco de dados

O banco de dados cursos_online foi projetado para gerenciar uma plataforma de cursos online com suporte a usuários, cursos, conteúdos, banco de questões e respostas dos alunos. O modelo segue o paradigma relacional, garantindo integridade referencial por meio de chaves primárias e estrangeiras.

🧠 MODELO RELACIONAL (LÓGICO)

O modelo relacional é composto pelas seguintes entidades principais:

👤 USUÁRIOS

Armazena os dados das pessoas que utilizam o sistema, podendo ser alunos ou professores.

Cada usuário possui um identificador único (id_usuario)

Um usuário pode ser do tipo aluno ou professor

Professores podem criar cursos

Alunos podem se matricular em cursos e responder questões

Relacionamentos:

Usuário (professor) → Curso (1:N)

Usuário (aluno) → Matrícula (1:N)

Usuário → Respostas (1:N)

📘 CURSOS

Representa os cursos cadastrados na plataforma.

Cada curso é criado por um professor

Um curso possui vários tópicos

Relacionamentos:

Curso → Tópicos (1:N)

Curso → Matrículas (1:N)

Curso ↔ Questões (N:N, via tabela curso_questoes)

📑 TÓPICOS

Organizam os conteúdos de cada curso.

Cada tópico pertence a um único curso

Um tópico pode possuir vários materiais

Relacionamento:

Tópico → Materiais (1:N)

📂 MATERIAIS

Armazena os conteúdos disponibilizados (PDF, vídeo, etc.).

Cada material está vinculado a um tópico

O tipo do material é controlado por ENUM (pdf, video, outro)

📝 BANCO_DE_QUESTOES

Armazena questões independentes dos cursos, funcionando como um banco geral (similar a sistemas como QConcursos).

Cada questão possui:

Tema

Enunciado

Alternativas

Resposta correta

As questões podem ser reutilizadas em vários cursos

Relacionamentos:

Questão ↔ Curso (N:N)

Questão → Respostas (1:N)

🔗 CURSO_QUESTOES

Tabela associativa responsável por relacionar cursos às questões.

Permite que uma mesma questão seja usada em vários cursos

Permite que um curso tenha várias questões

🧾 MATRÍCULAS

Representa a inscrição de alunos em cursos.

Cada matrícula liga um aluno a um curso

Impede duplicidade de matrícula para o mesmo curso

Relacionamento:

Usuário (aluno) ↔ Curso (N:N)

✅ RESPOSTAS_ALUNO

Armazena as respostas dadas pelos alunos às questões.

Registra:

Qual usuário respondeu

Qual questão foi respondida

Qual alternativa foi marcada

Se a resposta estava correta ou não

Relacionamentos:

Usuário → Respostas (1:N)

Questão → Respostas (1:N)

💾 MODELO FÍSICO (IMPLEMENTAÇÃO EM SQL)

O modelo físico foi implementado no SGBD MySQL com as seguintes características:

Uso de AUTO_INCREMENT para chaves primárias

Uso de FOREIGN KEY para integridade referencial

Uso de ENUM para tipos controlados (tipo_usuario e tipo de material)

Tipos adequados para cada atributo (VARCHAR, TEXT, DATE, BOOLEAN)

Exemplo:

id_usuario, id_curso, id_topico, id_questao → chaves primárias

id_professor, id_curso, id_topico, id_questao → chaves estrangeiras

O banco garante que:

Um curso não exista sem um professor válido

Um tópico não exista sem um curso

Um material não exista sem um tópico

Uma resposta não exista sem uma questão válida

Uma matrícula não exista sem usuário e curso válidos

# Código

CREATE DATABASE cursos_online;
USE cursos_online;

-- ===========================
-- USUARIOS
-- ===========================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('aluno', 'professor') NOT NULL
);

-- ===========================
-- CURSOS
-- ===========================
CREATE TABLE cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    id_professor INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_criacao DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_professor) REFERENCES usuarios(id_usuario)
);

-- ===========================
-- TOPICOS (DO CURSO)
-- ===========================
CREATE TABLE topicos (
    id_topico INT AUTO_INCREMENT PRIMARY KEY,
    id_curso INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

-- ===========================
-- MATERIAIS
-- ===========================
CREATE TABLE materiais (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    id_topico INT NOT NULL,
    tipo ENUM('pdf', 'video', 'outro') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    url_arquivo VARCHAR(300) NOT NULL,
    FOREIGN KEY (id_topico) REFERENCES topicos(id_topico)
);

-- ===========================
-- BANCO DE QUESTOES (INDEPENDENTE)
-- ===========================
CREATE TABLE banco_questoes (
  id_questao INT AUTO_INCREMENT PRIMARY KEY,
  tema VARCHAR(150) NOT NULL,
  enunciado TEXT NOT NULL,
  alternativa_a VARCHAR(300) NOT NULL,
  alternativa_b VARCHAR(300) NOT NULL,
  alternativa_c VARCHAR(300) NOT NULL,
  alternativa_d VARCHAR(300) NOT NULL,
  resposta_correta CHAR(1) NOT NULL
);

-- ===========================
-- RELAÇÃO CURSO ↔ QUESTÃO (opcional, se quiser vincular)
-- ===========================
CREATE TABLE curso_questoes (
  id_curso INT NOT NULL,
  id_questao INT NOT NULL,
  PRIMARY KEY (id_curso, id_questao),
  FOREIGN KEY (id_curso) REFERENCES cursos(id_curso),
  FOREIGN KEY (id_questao) REFERENCES banco_questoes(id_questao)
);

-- ===========================
-- MATRICULAS
-- ===========================
CREATE TABLE matriculas (
    id_matricula INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    data_matricula DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

-- ===========================
-- RESPOSTAS DOS ALUNOS
-- ===========================
CREATE TABLE respostas_aluno (
    id_resposta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_questao INT NOT NULL,
    resposta_marcada CHAR(1) NOT NULL,
    correta BOOLEAN NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_questao) REFERENCES banco_questoes(id_questao)
);

CREATE DATABASE cursos_online;
USE cursos_online;

-- ===========================
-- TABELA: USUARIOS
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
-- TABELA: CURSOS
-- ===========================
CREATE TABLE cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    id_professor INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_criacao DATE DEFAULT CURRENT_DATE,

    CONSTRAINT fk_curso_professor
        FOREIGN KEY (id_professor) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================
-- TABELA: TOPICOS
-- ===========================
CREATE TABLE topicos (
    id_topico INT AUTO_INCREMENT PRIMARY KEY,
    id_curso INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,

    CONSTRAINT fk_topico_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================
-- TABELA: MATERIAIS
-- ===========================
CREATE TABLE materiais (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    id_topico INT NOT NULL,
    tipo ENUM('pdf', 'video', 'outro') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    url_arquivo VARCHAR(300) NOT NULL,

    CONSTRAINT fk_material_topico
        FOREIGN KEY (id_topico) REFERENCES topicos(id_topico)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================
-- TABELA: QUESTOES
-- ===========================
CREATE TABLE questoes (
    id_questao INT AUTO_INCREMENT PRIMARY KEY,
    id_topico INT NOT NULL,
    enunciado TEXT NOT NULL,
    alternativa_a VARCHAR(300) NOT NULL,
    alternativa_b VARCHAR(300) NOT NULL,
    alternativa_c VARCHAR(300) NOT NULL,
    alternativa_d VARCHAR(300) NOT NULL,
    resposta_correta CHAR(1) NOT NULL,

    CONSTRAINT fk_questao_topico
        FOREIGN KEY (id_topico) REFERENCES topicos(id_topico)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================
-- TABELA RELACIONAMENTO: MATRICULAS
-- ===========================
CREATE TABLE matriculas (
    id_matricula INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    data_matricula DATE DEFAULT CURRENT_DATE,

    CONSTRAINT fk_matricula_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_matricula_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================
-- TABELA RELACIONAMENTO: RESPOSTAS DOS ALUNOS
-- ===========================
CREATE TABLE respostas_aluno (
    id_resposta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_questao INT NOT NULL,
    resposta_marcada CHAR(1) NOT NULL,
    correta BOOLEAN NOT NULL,

    CONSTRAINT fk_resposta_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_resposta_questao
        FOREIGN KEY (id_questao) REFERENCES questoes(id_questao)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import styles from "./DetalheCursos.module.css";

export default function CursoDetalhe() {
  const { id } = useParams();
  const [topicos, setTopicos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const [novoTopico, setNovoTopico] = useState("");
  const [descTopico, setDescTopico] = useState("");

  const [material, setMaterial] = useState({
    id_topico: "",
    tipo: "pdf",
    titulo: "",
    url_arquivo: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://autoria-web-react-production.up.railway.app/api/perfil", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsuario(data));

    carregarCurso();
  }, [id]);

  function carregarCurso() {
    fetch(`https://autoria-web-react-production.up.railway.app/api/cursos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTopicos(data));
  }

  function criarTopico(e) {
    e.preventDefault();

    fetch("https://autoria-web-react-production.up.railway.app/api/topicos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id_curso: id,
        titulo: novoTopico,
        descricao: descTopico
      })
    })
      .then(res => res.json())
      .then(() => {
        setNovoTopico("");
        setDescTopico("");
        carregarCurso();
      });
  }

  function adicionarMaterial(e) {
    e.preventDefault();

    fetch("https://autoria-web-react-production.up.railway.app/api/materiais", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(material)
    })
      .then(res => res.json())
      .then(() => {
        setMaterial({ id_topico: "", tipo: "pdf", titulo: "", url_arquivo: "" });
        carregarCurso();
      });
  }

  return (
    <Layout>
      <h2>Conteúdo do Curso</h2>

      {usuario?.tipo_usuario === "professor" && (
        <>
          <form onSubmit={criarTopico} className={styles.form}>
            <h3>Novo Tópico</h3>
            <input
              placeholder="Título"
              value={novoTopico}
              onChange={e => setNovoTopico(e.target.value)}
            />
            <input
              placeholder="Descrição"
              value={descTopico}
              onChange={e => setDescTopico(e.target.value)}
            />
            <button>Criar tópico</button>
          </form>

          <form onSubmit={adicionarMaterial} className={styles.form}>
            <h3>Novo Material</h3>

            <select
              value={material.id_topico}
              onChange={e =>
                setMaterial({ ...material, id_topico: e.target.value })
              }
            >
              <option value="">Selecione o tópico</option>
              {topicos.map(t => (
                <option key={t.id_topico} value={t.id_topico}>
                  {t.titulo}
                </option>
              ))}
            </select>

            <select
              value={material.tipo}
              onChange={e =>
                setMaterial({ ...material, tipo: e.target.value })
              }
            >
              <option value="pdf">PDF</option>
              <option value="video">Vídeo</option>
              <option value="outro">Outro</option>
            </select>

            <input
              placeholder="Título do material"
              value={material.titulo}
              onChange={e =>
                setMaterial({ ...material, titulo: e.target.value })
              }
            />

            <input
              placeholder="URL do arquivo"
              value={material.url_arquivo}
              onChange={e =>
                setMaterial({ ...material, url_arquivo: e.target.value })
              }
            />

            <button>Adicionar material</button>
          </form>
        </>
      )}

      {topicos.map(topico => (
        <div key={topico.id_topico} className={styles.topico}>
          <h3>{topico.titulo}</h3>
          <p>{topico.descricao}</p>

          {topico.materiais.map(mat => (
            <a
              key={mat.id_material}
              href={mat.url_arquivo}
              target="_blank"
              rel="noreferrer"
              className={styles.material}
            >
              {mat.tipo === "pdf" && "📄"}
              {mat.tipo === "video" && "🎥"} {mat.titulo}
            </a>
          ))}
        </div>
      ))}
    </Layout>
  );
}

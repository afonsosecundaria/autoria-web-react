import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import styles from "./DetalheCursos.module.css";

export default function CursoDetalhe() {
  const { id } = useParams(); // id do curso vindo da rota
  const [topicos, setTopicos] = useState([]);

  useEffect(() => {
    async function carregarCurso() {
      // futuramente vem da API:
      // const res = await fetch(`/api/cursos/${id}`);
      // const data = await res.json();
      // setTopicos(data);

      // MOCK (visual)
      setTopicos([
        {
          id_topico: 1,
          titulo: "Introdução",
          descricao: "Conceitos iniciais",
          materiais: [
            { id: 1, tipo: "pdf", titulo: "Apostila", url_arquivo: "#" },
            { id: 2, tipo: "video", titulo: "Video aula 1", url_arquivo: "#" }
          ]
        },
        {
          id_topico: 2,
          titulo: "Modelo Conceitual",
          descricao: "Entidades e relacionamentos",
          materiais: [
            { id: 3, tipo: "pdf", titulo: "Slides", url_arquivo: "#" },
            { id: 4, tipo: "video", titulo: "Video aula 2", url_arquivo: "#" }
          ]
        }
      ]);
    }

    carregarCurso();
  }, [id]);

  return (
    <Layout>
      <div className={styles.page}>
        <h2 className={styles.title}>Conteúdo do Curso</h2>

        {topicos.map((topico) => (
          <div key={topico.id_topico} className={styles.topico}>
            <h3>{topico.titulo}</h3>
            <p className={styles.descricao}>{topico.descricao}</p>

            <div className={styles.materiais}>
              {topico.materiais.map((mat) => (
                <a
                  key={mat.id}
                  href={mat.url_arquivo}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.material}
                >
                  <span className={styles.icon}>
                    {mat.tipo === "pdf" && "📄"}
                    {mat.tipo === "video" && "🎥"}
                    {mat.tipo === "outro" && "📦"}
                  </span>

                  {mat.titulo}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Layout from "../Layout/Layout";

export default function Home() {
  const [cursos, setCursos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Buscar cursos — público, sem token
    fetch("https://autoria-web-react-production.up.railway.app/api/cursos-publicos")
      .then(res => res.json())
      .then(data => setCursos(Array.isArray(data) ? data : []))
      .catch(() => setCursos([]));

    // Se houver token, buscar perfil
    if (token) {
      fetch("https://autoria-web-react-production.up.railway.app/api/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Token inválido");
          return res.json();
        })
        .then(data => setUsuario(data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function matricular(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Faça login para se matricular!");
      return;
    }

    fetch("https://autoria-web-react-production.up.railway.app/api/matriculas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id_curso: id })
    })
      .then(res => res.json())
      .then(() => alert("Matrícula realizada!"));
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <Layout>
      <h1 className={styles.title}>Cursos</h1>

      {usuario?.tipo_usuario === "professor" && (
        <a href="/criar-curso" className={styles.btnNovoCurso}>
          + Criar novo curso
        </a>
      )}

      <div className={styles.gridCursos}>
        {cursos.map(c => (
          <div key={c.id_curso} className={styles.cursoCard}>
            <h3>{c.titulo}</h3>
            <p>{c.descricao}</p>

            {usuario?.tipo_usuario === "aluno" && (
              <button
                className={styles.btnMatricular}
                onClick={() => matricular(c.id_curso)}
              >
                Matricular
              </button>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

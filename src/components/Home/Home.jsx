import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Layout from "../Layout/Layout";

export default function Home() {
  const [cursos, setCursos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1️⃣ Buscar cursos públicos (sempre)
    fetch("https://autoria-web-react-production.up.railway.app/api/cursos-publicos")
      .then(res => res.json())
      .then(data => setCursos(Array.isArray(data) ? data : []))
      .catch(() => setCursos([]));

    // 2️⃣ Buscar perfil apenas se tiver token
    if (token) {
      fetch("https://autoria-web-react-production.up.railway.app/api/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject("Token inválido"))
        .then(data => setUsuario(data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // 👈 garante que loading termina mesmo sem token
    }
  }, []);

  // Função de matrícula
  function matricular(id) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Faça login para se matricular!");

    fetch("https://autoria-web-react-production.up.railway.app/api/matriculas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id_curso: id })
    })
      .then(res => res.json())
      .then(() => alert("Matrícula realizada!"))
      .catch(() => alert("Erro ao matricular"));
  }

  // 3️⃣ Loading inicial
  if (loading) return <p>Carregando cursos...</p>;

  return (
    <Layout>
      <h1 className={styles.title}>Cursos</h1>

      {usuario?.tipo_usuario === "professor" && (
        <a href="/criar-curso" className={styles.btnNovoCurso}>
          + Criar novo curso
        </a>
      )}

      <div className={styles.gridCursos}>
        {cursos.length === 0 && <p>Nenhum curso disponível no momento.</p>}
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

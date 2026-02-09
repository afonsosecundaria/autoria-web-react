import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Layout from "../Layout/Layout";

export default function Home() {
  const [cursos, setCursos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 nova flag
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true }); // 👈 redireciona antes de fazer qualquer fetch
      return;
    }

    fetch("https://autoria-web-react-production.up.railway.app/api/perfil", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then(data => setUsuario(data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });

    fetch("https://autoria-web-react-production.up.railway.app/api/cursos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCursos(Array.isArray(data) ? data : []))
      .catch(() => setCursos([]))
      .finally(() => setLoading(false));

  }, [navigate]);

  // 👇 não renderiza nada enquanto carrega / valida token
  if (loading) return null;

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

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import styles from "./MeusCursos.module.css";

export default function MeusCursos() {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate(); // 👈 FALTAVA ISSO

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://autoria-web-react-production.up.railway.app/api/cursos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCursos(data));
  }, []);

  return (
    <Layout>
      <h2>Meus Cursos</h2>

      <div className={styles.grid}>
        {cursos.map(curso => (
          <div
            key={curso.id_curso}
            className={styles.card}
            onClick={() => navigate(`/curso/${curso.id_curso}`)} // 👈 AQUI
          >
            <h3>{curso.titulo}</h3>
            <p>{curso.descricao}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

import React from "react";
import Layout from "../Layout/Layout";
import styles from "./MeusCursos.module.css";

export default function MeusCursos() {
  const cursos = [
    { nome: "Modelo Conceitual", cor: "#3b5cff", favorito: false },
    { nome: "Modelo Lógico", cor: "#ff00cc", favorito: false },
    { nome: "Linguagem SQL", cor: "#ff00cc", favorito: true },
  ];

  return (
    <Layout>
      <div className={styles.page}>
        <h2 className={styles.title}>Meus Cursos</h2>

        <div className={styles.grid} onClick={() => navigate(`/curso/${id}`)}>
          {cursos.map((curso, i) => (
            <div key={i} className={styles.card}>
              <span className={styles.star}>
                {curso.favorito ? "⭐" : "☆"}
              </span>

              <div className={styles.cardContent}>
                {curso.nome}
              </div>

              <div
                className={styles.progress}
                style={{ backgroundColor: curso.cor }}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

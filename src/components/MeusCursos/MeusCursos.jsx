import React from "react";
import Layout from "../Layout/Layout";

export default function MeusCursos() {
  const cursos = ["Modelo Conceitual", "Modelo Lógico", "Linguagem SQL"];

  const styles = {
    page: { padding: "30px" },
    title: { fontSize: "26px", marginBottom: "20px" },
    grid: { display: "flex", gap: "20px" },
    card: {
      width: "220px",
      height: "120px",
      border: "1px solid #333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      cursor: "pointer"
    }
  };

  return (
    <Layout>
        <div style={styles.page}>
            <h2 style={styles.title}>Meus Cursos</h2>

            <div style={styles.grid}>
                {cursos.map((c, i) => (
                    <div key={i} style={styles.card}>
                        {c}
                    </div>
                ))}
            </div>
        </div>
    </Layout>
  );
}

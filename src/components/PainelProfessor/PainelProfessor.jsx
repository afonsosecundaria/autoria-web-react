import React, { useState } from "react";

export default function PainelProfessor() {
  const [nomeCurso, setNomeCurso] = useState("");
  const [descricao, setDescricao] = useState("");

  const styles = {
    page: { padding: "30px" },
    title: { fontSize: "26px", marginBottom: "20px" },
    box: {
      border: "1px solid #333",
      padding: "20px",
      maxWidth: "500px"
    },
    input: {
      width: "100%",
      padding: "8px",
      marginBottom: "10px"
    },
    textarea: {
      width: "100%",
      height: "80px",
      padding: "8px",
      marginBottom: "10px"
    },
    button: {
      padding: "10px",
      background: "#7a00ff",
      color: "#fff",
      border: "none",
      cursor: "pointer"
    }
  };

  function criarCurso() {
    alert("Curso criado: " + nomeCurso);
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Painel do Professor</h2>

      <div style={styles.box}>
        <label>Nome do curso</label>
        <input
          style={styles.input}
          value={nomeCurso}
          onChange={e => setNomeCurso(e.target.value)}
        />

        <label>Descrição</label>
        <textarea
          style={styles.textarea}
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
        />

        <button style={styles.button} onClick={criarCurso}>
          Criar / Editar Curso
        </button>
      </div>
    </div>
  );
}

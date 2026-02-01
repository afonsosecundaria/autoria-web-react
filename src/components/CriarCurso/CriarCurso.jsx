import { useState } from "react";
import Layout from "../Layout/Layout";
import styles from "./CriarCurso.module.css";

export default function CriarCurso() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  function salvarCurso(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch("https://autoria-web-react-production.up.railway.app/api/cursos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ titulo, descricao })
    })
      .then(async res => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt);
        }
        return res.json();
      })
      .then(() => {
        alert("Curso criado!");
        window.location.href = "/";
      });
  }

  return (
    <Layout>
      <h2>Novo Curso</h2>

      <form onSubmit={salvarCurso} className={styles.form}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
        />

        <button>Criar Curso</button>
      </form>
    </Layout>
  );
}

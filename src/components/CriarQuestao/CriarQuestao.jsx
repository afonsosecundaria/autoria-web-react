import { useParams } from "react-router-dom";
import { useState } from "react";
import Layout from "../Layout/Layout";
import styles from "./CriarQuestao.module.css";

export default function CriarQuestao() {
  const { idTopico } = useParams(); // ← aqui

  const [enunciado, setEnunciado] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [correta, setCorreta] = useState("A");

  async function salvarQuestao(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("https://autoria-web-react-production.up.railway.app/api/questoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id_topico: Number(idTopico), // 🔴 ESSENCIAL
        enunciado,
        alternativa_a: a,
        alternativa_b: b,
        alternativa_c: c,
        alternativa_d: d,
        resposta_correta: correta
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert(data.message);
  }

  return (
    <Layout>
      <h2>Cadastrar Questão</h2>
      <p>Tópico: {idTopico}</p>

      <form onSubmit={salvarQuestao}>
        <textarea value={enunciado} onChange={e => setEnunciado(e.target.value)} />
        <input value={a} onChange={e => setA(e.target.value)} />
        <input value={b} onChange={e => setB(e.target.value)} />
        <input value={c} onChange={e => setC(e.target.value)} />
        <input value={d} onChange={e => setD(e.target.value)} />

        <select value={correta} onChange={e => setCorreta(e.target.value)}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <button>Cadastrar</button>
      </form>
    </Layout>
  );
}

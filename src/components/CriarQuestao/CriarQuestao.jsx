import { useState } from "react";
import Layout from "../Layout/Layout";
import styles from "./CriarQuestao.module.css";

export default function CriarQuestao() {
  const [idTopico, setIdTopico] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [correta, setCorreta] = useState("A");

  function salvarQuestao(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    fetch("https://autoria-web-react-production.up.railway.app/api/questoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id_topico: idTopico,
        enunciado,
        alternativa_a: a,
        alternativa_b: b,
        alternativa_c: c,
        alternativa_d: d,
        resposta_correta: correta
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Questão cadastrada!");
        setEnunciado("");
        setA(""); setB(""); setC(""); setD("");
      });
  }

  return (
    <Layout>
      <h2 className={styles.title}>Cadastrar Questão</h2>

      <form onSubmit={salvarQuestao} className={styles.form}>
        <input
          placeholder="ID do tópico"
          value={idTopico}
          onChange={e => setIdTopico(e.target.value)}
          required
        />

        <textarea
          placeholder="Enunciado da questão"
          value={enunciado}
          onChange={e => setEnunciado(e.target.value)}
          required
        />

        <input placeholder="Alternativa A" value={a} onChange={e => setA(e.target.value)} required />
        <input placeholder="Alternativa B" value={b} onChange={e => setB(e.target.value)} required />
        <input placeholder="Alternativa C" value={c} onChange={e => setC(e.target.value)} required />
        <input placeholder="Alternativa D" value={d} onChange={e => setD(e.target.value)} required />

        <select value={correta} onChange={e => setCorreta(e.target.value)}>
          <option value="A">Resposta correta: A</option>
          <option value="B">Resposta correta: B</option>
          <option value="C">Resposta correta: C</option>
          <option value="D">Resposta correta: D</option>
        </select>

        <button>Cadastrar Questão</button>
      </form>
    </Layout>
  );
}

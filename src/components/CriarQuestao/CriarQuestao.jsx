import { useParams } from "react-router-dom";
import { useState } from "react";
import Layout from "../Layout/Layout";
import styles from "./CriarQuestao.module.css";

export default function CriarQuestao() {
  const { idTopico } = useParams();
  const [enunciado, setEnunciado] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [correta, setCorreta] = useState("A");

  async function salvarQuestao(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você não está logado.");
      return;
    }

    if (!idTopico) {
      alert("ID do tópico não encontrado.");
      return;
    }

    try {
      const res = await fetch("https://autoria-web-react-production.up.railway.app/api/questoes", {
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
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao cadastrar questão.");
        return;
      }

      alert(data.message);
      setEnunciado("");
      setA("");
      setB("");
      setC("");
      setD("");
      setCorreta("A");

    } catch (err) {
      console.error("ERRO FRONT:", err);
      alert("Erro de conexão com o servidor.");
    }
  }

  return (
    <Layout>
      <h2>Cadastrar Questão</h2>
      <form onSubmit={salvarQuestao}>
        <p>Tópico: {idTopico}</p>

        <textarea
          placeholder="Enunciado"
          value={enunciado}
          onChange={e => setEnunciado(e.target.value)}
          required
        />

        <input
          placeholder="Alternativa A"
          value={a}
          onChange={e => setA(e.target.value)}
          required
        />
        <input
          placeholder="Alternativa B"
          value={b}
          onChange={e => setB(e.target.value)}
          required
        />
        <input
          placeholder="Alternativa C"
          value={c}
          onChange={e => setC(e.target.value)}
          required
        />
        <input
          placeholder="Alternativa D"
          value={d}
          onChange={e => setD(e.target.value)}
          required
        />

        <select value={correta} onChange={e => setCorreta(e.target.value)}>
          <option value="A">Correta: A</option>
          <option value="B">Correta: B</option>
          <option value="C">Correta: C</option>
          <option value="D">Correta: D</option>
        </select>

        <button type="submit">Cadastrar</button>
      </form>
    </Layout>
  );
}

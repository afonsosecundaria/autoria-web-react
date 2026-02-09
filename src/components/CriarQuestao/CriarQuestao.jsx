import { useState } from "react";
import Layout from "../Layout/Layout";

export default function CriarQuestao() {
  const [tema, setTema] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [correta, setCorreta] = useState("A");

  async function salvarQuestao(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("https://autoria-web-react-production.up.railway.app/api/banco-questoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        tema,
        enunciado,
        alternativa_a: a,
        alternativa_b: b,
        alternativa_c: c,
        alternativa_d: d,
        resposta_correta: correta
      })
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);

    alert("Questão salva no banco!");
  }

  return (
    <Layout>
      <h2>Banco de Questões</h2>

      <input
        placeholder="Tema (ex: Crase, SQL, Redes)"
        value={tema}
        onChange={e => setTema(e.target.value)}
        required
      />

      <textarea
        placeholder="Enunciado"
        value={enunciado}
        onChange={e => setEnunciado(e.target.value)}
        required
      />

      <input placeholder="A" value={a} onChange={e => setA(e.target.value)} />
      <input placeholder="B" value={b} onChange={e => setB(e.target.value)} />
      <input placeholder="C" value={c} onChange={e => setC(e.target.value)} />
      <input placeholder="D" value={d} onChange={e => setD(e.target.value)} />

      <select value={correta} onChange={e => setCorreta(e.target.value)}>
        <option value="A">Correta: A</option>
        <option value="B">Correta: B</option>
        <option value="C">Correta: C</option>
        <option value="D">Correta: D</option>
      </select>

      <button onClick={salvarQuestao}>Salvar</button>
    </Layout>
  );
}

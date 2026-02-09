import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";

export default function FazerQuestoes() {
  const { tema } = useParams(); // 👈 TEM QUE SER "tema"
  const [questoes, setQuestoes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(
      `https://autoria-web-react-production.up.railway.app/api/banco-questoes?tema=${encodeURIComponent(tema)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => res.json())
      .then(data => setQuestoes(data));
  }, [tema]);

  if (questoes.length === 0) {
    return (
      <Layout>
        <h2>😕 Nenhuma questão cadastrada</h2>
        <p>O professor ainda não cadastrou questões.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2>Questões</h2>
      {questoes.map(q => (
        <div key={q.id_questao}>
          <p><strong>{q.enunciado}</strong></p>
          {["A","B","C","D"].map(letra => (
            <label key={letra}>
              <input type="radio" name={q.id_questao} />
              {q[`alternativa_${letra.toLowerCase()}`]}
            </label>
          ))}
        </div>
      ))}
    </Layout>
  );
}

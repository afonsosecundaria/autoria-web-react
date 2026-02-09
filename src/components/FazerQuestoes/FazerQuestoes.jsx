import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";

export default function FazerQuestoes() {
  const { tema } = useParams();
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({}); // { idQuestao: "A" }
  const [resultado, setResultado] = useState({}); // { idQuestao: true/false }

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(
      `https://autoria-web-react-production.up.railway.app/api/banco-questoes?tema=${encodeURIComponent(tema)}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(res => res.json())
      .then(data => setQuestoes(data));
  }, [tema]);

  function marcarResposta(idQuestao, letra) {
    setRespostas(prev => ({
      ...prev,
      [idQuestao]: letra
    }));
  }

  function enviarResposta(idQuestao) {
    const token = localStorage.getItem("token");

    fetch("https://autoria-web-react-production.up.railway.app/api/respostas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id_questao: idQuestao,
        resposta_marcada: respostas[idQuestao]
      })
    })
      .then(res => res.json())
      .then(data => {
        setResultado(prev => ({
          ...prev,
          [idQuestao]: data.correta
        }));
      });
  }

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
      <h2>Questões - {tema}</h2>

      {questoes.map(q => (
        <div key={q.id_questao} style={{ marginBottom: 20 }}>
          <p><strong>{q.enunciado}</strong></p>

          {["A","B","C","D"].map(letra => (
            <label key={letra} style={{ display: "block" }}>
              <input
                type="radio"
                name={`questao-${q.id_questao}`}
                checked={respostas[q.id_questao] === letra}
                onChange={() => marcarResposta(q.id_questao, letra)}
              />
              {q[`alternativa_${letra.toLowerCase()}`]}
            </label>
          ))}

          <button
            onClick={() => enviarResposta(q.id_questao)}
            disabled={!respostas[q.id_questao]}
          >
            Responder
          </button>

          {resultado[q.id_questao] === true && (
            <p style={{ color: "green" }}>✅ Resposta correta!</p>
          )}

          {resultado[q.id_questao] === false && (
            <p style={{ color: "red" }}>❌ Resposta errada.</p>
          )}
        </div>
      ))}
    </Layout>
  );
}

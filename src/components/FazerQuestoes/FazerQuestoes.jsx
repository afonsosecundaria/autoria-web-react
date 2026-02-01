import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import styles from "./FazerQuestoes.module.css";

export default function FazerQuestoes() {
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});

  useEffect(() => {
    fetch("https://autoria-web-react-production.up.railway.app/api/questoes/1")
      .then(res => res.json())
      .then(data => setQuestoes(data));
  }, []);

  function marcar(id, letra) {
    setRespostas({ ...respostas, [id]: letra });
  }

  if (questoes.length === 0) {
    return (
      <Layout>
        <div className={styles.vazio}>
          <h2>😕 Nenhuma questão cadastrada</h2>
          <p>O professor ainda não cadastrou questões para este tópico.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className={styles.title}>Questões</h2>

      {questoes.map(q => (
        <div key={q.id_questao} className={styles.card}>
          <p><strong>{q.enunciado}</strong></p>

          {["A","B","C","D"].map(letra => (
            <label key={letra} className={styles.alt}>
              <input
                type="radio"
                name={q.id_questao}
                checked={respostas[q.id_questao] === letra}
                onChange={() => marcar(q.id_questao, letra)}
              />
              {q[`alternativa_${letra.toLowerCase()}`]}
            </label>
          ))}
        </div>
      ))}
    </Layout>
  );
}

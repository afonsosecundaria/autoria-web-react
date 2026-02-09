import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import styles from "./BancoQuestoes.module.css";

const dados = {
  Matemática: ["Conjuntos", "Geometria Plana", "Geometria Espacial", "Geometria Analítica"],
  Português: ["Interpretação de Texto", "Ortografia", "Crase", "Concordância"],
  Informática: ["Windows", "Word", "Excel", "Internet"],
  "Banco de Dados": ["Modelo Relacional", "SQL", "Normalização"],
  "Redes de Computadores": ["OSI", "TCP/IP", "Protocolos", "Cabeamento"],
  "Eletrônica Digital": ["Portas Lógicas", "Flip-Flop", "Circuitos"]
};

export default function BancoQuestoes() {
  const navigate = useNavigate(); // ✅ AQUI DENTRO
  const [disciplina, setDisciplina] = useState("Matemática");
  const [topico, setTopico] = useState("Geometria Plana");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://autoria-web-react-production.up.railway.app/api/perfil", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsuario(data));
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.title}>Banco de Questões</h2>

        <div className={styles.box}>
          {/* COLUNA ESQUERDA */}
          <div className={styles.filtros}>
            {Object.keys(dados).map(mat => (
              <div key={mat}>
                <label className={styles.disciplina}>
                  <input
                    type="radio"
                    name="disciplina"
                    checked={disciplina === mat}
                    onChange={() => {
                      setDisciplina(mat);
                      setTopico(dados[mat][0]);
                    }}
                  />
                  {mat}
                </label>

                {disciplina === mat && (
                  <div className={styles.topicos}>
                    {dados[mat].map(t => (
                      <label key={t} className={styles.topico}>
                        <input
                          type="radio"
                          name="topico"
                          checked={topico === t}
                          onChange={() => setTopico(t)}
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* COLUNA DIREITA */}
          <div className={styles.resumo}>
            <h3>Questões selecionadas</h3>
            <p><strong>Disciplina:</strong> {disciplina}</p>
            <p><strong>Tópico:</strong> {topico}</p>

            <div className={styles.botoes}>
              <button
                className={styles.btn}
                onClick={() =>
                  navigate(`/questoes/${topico}`)
                }
              >
                Ver questões
              </button>

              {usuario?.tipo_usuario === "professor" && (
                <button
                  className={styles.btnProfessor}
                  onClick={() =>
                    navigate(`/criar-questao/${topico}`)
                  }
                >
                  + Cadastrar questão
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

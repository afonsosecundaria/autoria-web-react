import Layout from "../Layout/Layout";

export default function BancoQuestoes() {
    const [materia, setMateria] = useState("Matemática");
    const [assunto, setAssunto] = useState("Geometria Plana");

    const styles = {
        page: { padding: "30px" },
        title: { fontSize: "26px", marginBottom: "20px" },
        box: {
        border: "1px solid #333",
        padding: "20px",
        maxWidth: "600px"
        },
        input: {
        padding: "8px",
        marginBottom: "10px",
        width: "100%"
        },
        button: {
        padding: "10px",
        background: "#e91cff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        marginTop: "10px"
        }
    };
  return (
    <Layout>
        <div style={styles.page}>
            <h2 style={styles.title}>Banco de Questões</h2>

            <div style={styles.box}>
                <label>Matéria</label>
                <input
                style={styles.input}
                value={materia}
                onChange={e => setMateria(e.target.value)}
                />

                <label>Assunto</label>
                <input
                style={styles.input}
                value={assunto}
                onChange={e => setAssunto(e.target.value)}
                />

                <button style={styles.button}>Ver questões</button>
            </div>
        </div>
    </Layout>
  );
}

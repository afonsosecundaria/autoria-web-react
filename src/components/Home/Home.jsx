import styles from "./Home.module.css";
import Layout from "../Layout/Layout";

export default function Home() {
  return (
    <Layout>
      <h1 className={styles.title}>Cursos</h1>

      {/* PESQUISA */}
      <div className={styles.searchBox}>
        <input type="text" placeholder="Pesquisar..." />
      </div>

      {/* GRID DE CURSOS */}
      <div className={styles.gridCursos}>
        <div className={styles.cursoCard}>
          <h3>Matemática</h3>
          <button className={styles.btnMatricular}>Matricular</button>
        </div>

        <div className={styles.cursoCard}>
          <h3>Eletrônica Digital</h3>
          <button className={styles.btnMatricular}>Matricular</button>
        </div>

        <div className={styles.cursoCard}>
          <h3>Português</h3>
          <button className={styles.btnMatricular}>Matricular</button>
        </div>
      </div>
    </Layout>
  );
}

import styles from "./Perfil.module.css";
import Layout from "../Layout/Layout";

export default function Perfil() {
  return (
    <Layout>
      {/* BANNER PERFIL */}
      <section className={styles.profileBanner}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>US</div>

          <div className={styles.userText}>
            <p>Olá,</p>
            <h2>Usuário</h2>
            <span className={styles.changePhoto}>Trocar foto</span>
          </div>
        </div>

        <div className={styles.profileIllustration}>🎓</div>
      </section>

      {/* ABAS */}
      <nav className={styles.profileTabs}>
        <span className={styles.tab}>Meu Perfil</span>
        <span className={styles.tab}>Meus dados</span>
        <span className={`${styles.tab} ${styles.tabActive}`}>
          Privacidade
        </span>
      </nav>

      <section className={styles.profileContent}></section>
    </Layout>
  );
}

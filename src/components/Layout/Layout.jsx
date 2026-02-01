import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <>
      {/* TOPO FIXO */}
      <header className={styles.topbar}>
        <div className={styles.topbarLogo}>
          <span>👟</span>
          <span>DeChinelo</span>
        </div>

        <div className={styles.topbarNotification}>🔔</div>
      </header>

      <div className={styles.layout}>
        {/* SIDEBAR FIXA */}
        <aside className={styles.sidebar}>
          <a href="/perfil" className={styles.sidebarItem}>Minhas preferências</a>
          <a href="/" className={styles.sidebarItem}>Catálogo de cursos</a>
          <a href="/meuscursos" className={styles.sidebarItem}>Meus cursos</a>
          <a href="/questoes" className={styles.sidebarItem}>Sistema de questões</a>
          <a href="/login" className={styles.sidebarItem}>Entrar</a>
        </aside>

        {/* CONTEÚDO DINÂMICO */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </>
  );
}

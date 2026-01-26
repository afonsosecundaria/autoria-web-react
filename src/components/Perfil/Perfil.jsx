import { useState, useEffect } from "react";
import styles from "./Perfil.module.css";
import Layout from "../Layout/Layout";
import MeuPerfil from "./tabs/MeuPerfil";
import MeusDados from "./tabs/MeusDados";
import Privacidade from "./tabs/Privacidade";

export default function Perfil() {
  const [abaAtiva, setAbaAtiva] = useState("perfil");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarPerfil() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsuario(data);
    }

    carregarPerfil();
  }, []);

  if (!usuario) return <p>Carregando perfil...</p>;

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
        <span
          className={`${styles.tab} ${abaAtiva === "perfil" ? styles.tabActive : ""}`}
          onClick={() => setAbaAtiva("perfil")}
        >
          Meu Perfil
        </span>

        <span
          className={`${styles.tab} ${abaAtiva === "dados" ? styles.tabActive : ""}`}
          onClick={() => setAbaAtiva("dados")}
        >
          Meus dados
        </span>

        <span
          className={`${styles.tab} ${abaAtiva === "privacidade" ? styles.tabActive : ""}`}
          onClick={() => setAbaAtiva("privacidade")}
        >
          Privacidade
        </span>
      </nav>

      <section className={styles.profileContent}>
        {abaAtiva === "perfil" && <MeuPerfil />}
        {abaAtiva === "dados" && <MeusDados />}
        {abaAtiva === "privacidade" && <Privacidade />}
      </section>
    </Layout>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Perfil.module.css";
import Layout from "../Layout/Layout";
import MeuPerfil from "./tabs/MeuPerfil";
import MeusDados from "./tabs/MeusDados";
import Privacidade from "./tabs/Privacidade";

export default function Perfil() {
  const [abaAtiva, setAbaAtiva] = useState("perfil");
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarPerfil() {
      const token = localStorage.getItem("token");

      // 🚫 NÃO está logado
      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const res = await fetch(
          "https://autoria-web-react-production.up.railway.app/api/perfil",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Token inválido");
        }

        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [navigate]);

  // ⏳ enquanto carrega
  if (carregando) return <p></p>;

  // 🚫 NÃO logado → tela padrão (ou redireciona)
  if (!usuario) {
    return (
      <Layout>
        <h2>Você não está logado</h2>
        <p>Faça login para acessar seu perfil.</p>
      </Layout>
    );
  }

  // ✅ LOGADO
  return (
    <Layout>
      {/* BANNER PERFIL */}
      <section className={styles.profileBanner}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>
            {usuario.nome[0]}
            {usuario.sobrenome[0]}
          </div>

          <div className={styles.userText}>
            <p>Olá,</p>
            <h2>{usuario.nome}</h2>
            <span className={styles.changePhoto}>Trocar foto</span>
          </div>
        </div>

        <div className={styles.profileIllustration}>🎓</div>
      </section>

      {/* ABAS */}
      <nav className={styles.profileTabs}>
        <span
          className={`${styles.tab} ${
            abaAtiva === "perfil" ? styles.tabActive : ""
          }`}
          onClick={() => setAbaAtiva("perfil")}
        >
          Meu Perfil
        </span>

        <span
          className={`${styles.tab} ${
            abaAtiva === "dados" ? styles.tabActive : ""
          }`}
          onClick={() => setAbaAtiva("dados")}
        >
          Meus dados
        </span>

        <span
          className={`${styles.tab} ${
            abaAtiva === "privacidade" ? styles.tabActive : ""
          }`}
          onClick={() => setAbaAtiva("privacidade")}
        >
          Privacidade
        </span>
      </nav>

      <section className={styles.profileContent}>
        {abaAtiva === "perfil" && <MeuPerfil usuario={usuario} />}
        {abaAtiva === "dados" && <MeusDados usuario={usuario} />}
        {abaAtiva === "privacidade" && <Privacidade />}
      </section>
    </Layout>
  );
}

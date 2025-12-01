import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Falha no login");

      localStorage.setItem("token", data.token);
      navigate("/perfil");
    } catch (err) {
      alert(err.message);
      console.error("Erro:", err);
    }
  };

  // Estilos inline
  const styles = {
    page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #cbb4e3, #e1c5ff)",
      fontFamily: "Segoe UI, sans-serif",
    },
    card: {
      backgroundColor: "#fff",
      padding: "2.5rem",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
      width: "100%",
      maxWidth: "400px",
    },
    title: {
      textAlign: "center",
      color: "#a678e2",
      marginBottom: "1.5rem",
      fontWeight: "bold",
      fontSize: "1.8rem",
    },
    formGroup: {
      marginBottom: "1.2rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: 600,
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#a678e2",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "1rem",
    },
    linkBox: {
      textAlign: "center",
      marginBottom: "1rem",
      marginTop: "0.5rem",
    },
    link: {
      color: "#6a1b9a",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          <i className="fas fa-sign-in-alt"></i> Entrar
        </h2>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              style={styles.input}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div style={styles.linkBox}>
            <a href="/cadastro" style={styles.link}>
              Ainda não possui conta? <strong>Cadastre-se</strong>
            </a>
          </div>

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

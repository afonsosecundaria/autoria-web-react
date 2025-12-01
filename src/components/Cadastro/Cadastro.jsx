import React, { useState } from "react";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!tipoUsuario) {
      alert("Selecione o tipo de usuário!");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const formData = {
      nome,
      sobrenome,
      email,
      telefone,
      senha,
      tipo_usuario: tipoUsuario,
    };

    try {
      const res = await fetch("http://localhost:3000/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro no servidor");

      alert("Cadastro realizado com sucesso!");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar.");
    }
  }

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
    container: {
      backgroundColor: "#fff",
      padding: "1.5rem",
      borderRadius: "10px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "320px",
      animation: "fadeIn 0.4s ease-in-out",
    },
    title: {
      textAlign: "center",
      color: "#a678e2",
      marginBottom: "1.2rem",
      fontSize: "1.3rem",
    },
    formGroup: {
      marginBottom: "0.8rem",
    },
    label: {
      display: "block",
      marginBottom: "0.3rem",
      fontSize: "0.9rem",
      fontWeight: 600,
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "0.9rem",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#a678e2",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "0.6rem",
      backgroundColor: "#a678e2",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.95rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "0.5rem",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#915cd3",
    },
    linkBox: {
      textAlign: "center",
      marginBottom: "0.8rem",
    },
    link: {
      fontSize: "0.85rem",
      color: "#6a1b9a",
      textDecoration: "none",
    },
    radioGroup: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "0.3rem",
    },
    radioLabel: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      fontSize: "0.9rem",
      cursor: "pointer",
    },
    radioInput: {
      accentColor: "#a678e2",
      width: "16px",
      height: "16px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>
          <i className="fas fa-user-plus"></i> Cadastro
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Sobrenome</label>
            <input
              type="text"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmar Senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de usuário</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo_usuario"
                  value="professor"
                  checked={tipoUsuario === "professor"}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                  style={styles.radioInput}
                  required
                />
                Professor
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="tipo_usuario"
                  value="aluno"
                  checked={tipoUsuario === "aluno"}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                  style={styles.radioInput}
                  required
                />
                Aluno
              </label>
            </div>
          </div>

          <div style={styles.linkBox}>
            <a href="/login" style={styles.link}>
              Já possui uma conta? <strong>Entre!</strong>
            </a>
          </div>

          <button type="submit" style={styles.button}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

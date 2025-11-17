import React, { useState } from "react";
import "./cadastro.css";

export default function Cadastro() {
  // Estados do formulário
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

  return (
    <div className="form-container">
      <h2>
        <i className="fas fa-user-plus"></i> Cadastro
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Sobrenome</label>
          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirmar Senha</label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de usuário</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="tipo_usuario"
                value="professor"
                checked={tipoUsuario === "professor"}
                onChange={(e) => setTipoUsuario(e.target.value)}
                required
              />
              Professor
            </label>

            <label>
              <input
                type="radio"
                name="tipo_usuario"
                value="aluno"
                checked={tipoUsuario === "aluno"}
                onChange={(e) => setTipoUsuario(e.target.value)}
                required
              />
              Aluno
            </label>
          </div>
        </div>

        <div className="form-link">
          <a href="/login">Já possui uma conta? <strong>Entre!</strong></a>
        </div>

        <div className="form-group">
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}

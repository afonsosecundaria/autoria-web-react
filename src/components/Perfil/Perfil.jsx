import React, { useState, useEffect, useRef } from "react";

import "../Home/Home"

export default function Perfil() {

  // -------------------------------
  // STATES DO PERFIL
  // -------------------------------
  const [user, setUser] = useState({
    nome: "Nome",
    papel: "Aluno",
    cidade: "Cidade",
    email: "Email",
    telefone: "(00) 00000-0000",
    tipo_usuario: "Aluno",
    cursosFavoritos: ["Nenhum curso"],
  });

  // Inputs controlados
  const [isEditing, setIsEditing] = useState(false);
  const [favOpen, setFavOpen] = useState(false);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tooltipRef = useRef();

  // ---------------------------------------
  // 🔵 CARREGAR PERFIL DO BACKEND AUTOMATICAMENTE
  // ---------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/api/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then((data) => {
        setUser((prev) => ({
          ...prev,
          ...data
        }));
      })
      .catch(() => {});
  }, []);

  // ---------------------------------------
  // 🟣 FECHAR TOOLTIP AO CLICAR FORA
  // ---------------------------------------
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target)
      ) {
        setFavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------------------------------
  // SALVAR ALTERAÇÕES
  // ---------------------------------------
  function handleSave() {
    setIsEditing(false);
  }

  return (
    <>
      {/* ----------- MENU SUPERIOR ----------- */}
      <header className="topbar">
        <div className="logo">Ensino de Chinelo</div>
        <div className="login-btn">
          <a href="/login">Entrar</a>
        </div>
      </header>


      {/* ----------- SIDEBAR ----------- */}
      <div className="sidebar-wrapper">
        <div className={`sidebar ${sidebarOpen ? "expanded" : ""}`}>
          <a href="/" className="nav-link"><i className="fas fa-home"></i><span> Início</span></a>
          <a href="/perfil" className="nav-link"><i className="fas fa-user"></i><span> Perfil</span></a>
          <a href="#" className="nav-link"><i className="fas fa-cog"></i><span> Configurações</span></a>
          <a href="/sobre" className="nav-link"><i className="fas fa-info-circle"></i><span> Sobre nós</span></a>
        </div>

        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      </div>


      {/* ----------- CARD DE PERFIL ----------- */}
      <div className="container">
        <div className="card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Foto de Perfil"
          />

          {/* Nome */}
          {!isEditing ? (
            <h2>{user.nome}</h2>
          ) : (
            <input
              value={user.nome}
              onChange={(e) =>
                setUser({ ...user, nome: e.target.value })
              }
            />
          )}

          <div className="info">
            {/* Papel */}
            <p>
              <i className="fas fa-user-graduate"></i>{" "}
              {!isEditing ? (
                <span>{user.tipo_usuario}</span>
              ) : (
                <input
                  value={user.tipo_usuario}
                  onChange={(e) =>
                    setUser({ ...user, tipo_usuario: e.target.value })
                  }
                />
              )}
            </p>

            {/* Cidade */}
            <p>
              <i className="fas fa-map-marker-alt"></i>{" "}
              {!isEditing ? (
                <span>{user.cidade}</span>
              ) : (
                <input
                  value={user.cidade}
                  onChange={(e) =>
                    setUser({ ...user, cidade: e.target.value })
                  }
                />
              )}
            </p>

            {/* Email */}
            <p>
              <i className="fas fa-envelope"></i>{" "}
              {!isEditing ? (
                <span>{user.email}</span>
              ) : (
                <input
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                />
              )}
            </p>

            {/* Telefone */}
            <p>
              <i className="fas fa-phone"></i>{" "}
              {!isEditing ? (
                <span>{user.telefone}</span>
              ) : (
                <input
                  value={user.telefone}
                  onChange={(e) =>
                    setUser({ ...user, telefone: e.target.value })
                  }
                />
              )}
            </p>
          </div>

          {/* Botão salvar */}
          {isEditing && (
            <button className="save-btn" onClick={handleSave}>
              Salvar
            </button>
          )}

          {/* -------- ICONES -------- */}
          <div className="icons">
            <i
              className="fas fa-pencil-alt"
              title="Editar"
              onClick={() => setIsEditing(!isEditing)}
            ></i>

            <i className="fas fa-share-alt"></i>

            {/* Favoritos */}
            <div className="fav">
              <i
                className="fas fa-heart"
                title="Cursos favoritos"
                onClick={() => setFavOpen(true)}
              ></i>

              {favOpen && (
                <div className="tooltipFav show" ref={tooltipRef}>
                  <span
                    className="close-btn"
                    onClick={() => setFavOpen(false)}
                  >
                    &times;
                  </span>

                  <strong>Cursos Favoritos</strong>
                  <ul>
                    {user.cursosFavoritos.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>

                  {isEditing && (
                    <textarea
                      value={user.cursosFavoritos.join("\n")}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          cursosFavoritos: e.target.value
                            .split("\n")
                            .filter((c) => c.trim() !== "")
                        })
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

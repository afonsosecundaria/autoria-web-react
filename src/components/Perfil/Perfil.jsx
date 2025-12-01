import React, { useState, useEffect, useRef } from "react";

export default function Perfil() {
  const [user, setUser] = useState({
    nome: "Nome",
    tipo_usuario: "Aluno",
    cidade: "Cidade",
    email: "Email",
    telefone: "(00) 00000-0000",
    cursosFavoritos: ["Nenhum curso"],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tooltipRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/api/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Token inválido")))
      .then((data) => setUser((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setFavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSave() {
    setIsEditing(false);
  }

  // ----------------- ESTILOS INLINE -----------------
  const styles = {
    page: {
      fontFamily: "Segoe UI, sans-serif",
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E9D5FF, #D8B4FE)",
    },
    topbar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "60px",
      backgroundColor: "#9333EA",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 30px",
      fontSize: "18px",
      zIndex: 1000,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    logo: { fontWeight: "bold", fontSize: "22px" },
    loginBtn: {
      backgroundColor: "#fff",
      color: "#a678e2",
      padding: "8px 16px",
      borderRadius: "8px",
      fontWeight: "bold",
      textDecoration: "none",
    },
    sidebarWrapper: {
      position: "relative",
      marginTop: "60px",
    },
    sidebar: {
      width: sidebarOpen ? "200px" : "60px",
      height: "100vh",
      backgroundColor: "#9333EA",
      position: "fixed",
      top: "60px",
      left: 0,
      zIndex: 999,
      padding: "20px 10px",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s",
    },
    navLink: {
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      margin: "10px 0",
      display: "flex",
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: "5px",
      textDecoration: "none",
      transition: "background 0.3s",
    },
    navIcon: { marginRight: "8px" },
    navText: { display: sidebarOpen ? "inline" : "none" },
    toggleBtn: {
      position: "fixed",
      top: "70px",
      left: sidebarOpen ? "210px" : "70px",
      zIndex: 1001,
      backgroundColor: "#fff",
      border: "none",
      fontSize: "20px",
      borderRadius: "8px",
      padding: "5px 10px",
      cursor: "pointer",
      color: "#9333EA",
      transition: "left 0.3s",
    },
    container: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "100px 40px 40px",
      marginLeft: sidebarOpen ? "200px" : "60px",
      transition: "margin-left 0.3s",
      width: "100%",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "15px",
      padding: "30px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      textAlign: "center",
      width: "350px",
      position: "relative",
    },
    profileImg: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "15px",
      border: "4px solid #a678e2",
    },
    info: { marginTop: "15px", textAlign: "left" },
    infoItem: {
      fontSize: "14px",
      color: "#555",
      margin: "8px 0",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    infoIcon: { color: "#a678e2", width: "18px" },
    icons: { display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" },
    icon: { fontSize: "20px", color: "#555", cursor: "pointer" },
    favTooltip: {
      position: "absolute",
      bottom: "40px",
      right: 0,
      background: "#3a2e5c",
      color: "#fff",
      padding: "15px",
      borderRadius: "10px",
      fontSize: "14px",
      width: "220px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
      zIndex: 100,
      textAlign: "left",
    },
    closeBtn: { position: "absolute", top: "6px", right: "8px", fontSize: "16px", color: "#ccc", cursor: "pointer" },
    saveBtn: {
      marginTop: "15px",
      padding: "8px 15px",
      border: "none",
      backgroundColor: "#a678e2",
      color: "#fff",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      {/* Topbar */}
      <header style={styles.topbar}>
        <div style={styles.logo}>Ensino de Chinelo</div>
        <a href="/login" style={styles.loginBtn}>
          Entrar
        </a>
      </header>

      {/* Sidebar */}
      <div style={styles.sidebarWrapper}>
        <div style={styles.sidebar}>
          <a href="/" style={styles.navLink}>
            <i className="fas fa-home" style={styles.navIcon}></i>
            <span style={styles.navText}>Início</span>
          </a>
          <a href="/perfil" style={styles.navLink}>
            <i className="fas fa-user" style={styles.navIcon}></i>
            <span style={styles.navText}>Perfil</span>
          </a>
          <a href="#" style={styles.navLink}>
            <i className="fas fa-cog" style={styles.navIcon}></i>
            <span style={styles.navText}>Configurações</span>
          </a>
          <a href="/sobre" style={styles.navLink}>
            <i className="fas fa-info-circle" style={styles.navIcon}></i>
            <span style={styles.navText}>Sobre nós</span>
          </a>
        </div>

        <button style={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      </div>

      {/* Card de perfil */}
      <div style={styles.container}>
        <div style={styles.card}>
          <img
            style={styles.profileImg}
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Foto de Perfil"
          />
          {!isEditing ? (
            <h2>{user.nome}</h2>
          ) : (
            <input value={user.nome} onChange={(e) => setUser({ ...user, nome: e.target.value })} />
          )}

          <div style={styles.info}>
            <p style={styles.infoItem}>
              <i style={styles.infoIcon} className="fas fa-user-graduate"></i>{" "}
              {!isEditing ? (
                user.tipo_usuario
              ) : (
                <input
                  value={user.tipo_usuario}
                  onChange={(e) => setUser({ ...user, tipo_usuario: e.target.value })}
                />
              )}
            </p>
            <p style={styles.infoItem}>
              <i style={styles.infoIcon} className="fas fa-map-marker-alt"></i>{" "}
              {!isEditing ? (
                user.cidade
              ) : (
                <input value={user.cidade} onChange={(e) => setUser({ ...user, cidade: e.target.value })} />
              )}
            </p>
            <p style={styles.infoItem}>
              <i style={styles.infoIcon} className="fas fa-envelope"></i>{" "}
              {!isEditing ? (
                user.email
              ) : (
                <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
              )}
            </p>
            <p style={styles.infoItem}>
              <i style={styles.infoIcon} className="fas fa-phone"></i>{" "}
              {!isEditing ? (
                user.telefone
              ) : (
                <input value={user.telefone} onChange={(e) => setUser({ ...user, telefone: e.target.value })} />
              )}
            </p>
          </div>

          {isEditing && <button style={styles.saveBtn} onClick={handleSave}>Salvar</button>}

          {/* Ícones */}
          <div style={styles.icons}>
            <i style={styles.icon} className="fas fa-pencil-alt" onClick={() => setIsEditing(!isEditing)}></i>
            <i style={styles.icon} className="fas fa-share-alt"></i>
            <div style={{ position: "relative" }}>
              <i style={styles.icon} className="fas fa-heart" onClick={() => setFavOpen(true)}></i>
              {favOpen && (
                <div style={styles.favTooltip} ref={tooltipRef}>
                  <span style={styles.closeBtn} onClick={() => setFavOpen(false)}>
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
                          cursosFavoritos: e.target.value.split("\n").filter((c) => c.trim() !== ""),
                        })
                      }
                      style={{ width: "100%", borderRadius: "6px", padding: "6px", marginTop: "8px" }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

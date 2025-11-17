import React, { useState } from "react";
import "./perfil.css";

export default function Perfil() {
  // Estados que substituem os inputs e displays
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("Seu nome");
  const [role, setRole] = useState("Estudante");
  const [location, setLocation] = useState("Localização");
  const [email, setEmail] = useState("email@exemplo.com");
  const [phone, setPhone] = useState("(00) 00000-0000");

  const [favOpen, setFavOpen] = useState(false);
  const [favCourses, setFavCourses] = useState([]);
  const [courseInput, setCourseInput] = useState("");

  function handleSave() {
    setFavCourses(courseInput.split("\n").filter((item) => item.trim() !== ""));
    setIsEditing(false);
  }

  return (
    <>
      {/* MENU SUPERIOR */}
      <header className="topbar">
        <div className="logo">Ensino de Chinelo</div>
        <div className="login-btn">
          <a href="/login">Entrar</a>
        </div>
      </header>

      {/* MENU LATERAL */}
      <div className="sidebar-wrapper">
        <div className="sidebar">
          <a href="/index" className="nav-link">
            <i className="fas fa-home"></i><span> Início</span>
          </a>
          <a href="/perfil" className="nav-link">
            <i className="fas fa-user"></i><span> Perfil</span>
          </a>
          <a href="#" className="nav-link">
            <i className="fas fa-cog"></i><span> Configurações</span>
          </a>
          <a href="/sobre" className="nav-link">
            <i className="fas fa-info-circle"></i><span> Sobre nós</span>
          </a>
        </div>

        <button className="toggle-btn">☰</button>
      </div>

      {/* CARD DE PERFIL */}
      <div className="container">
        <div className="card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Imagem de Perfil Padrão"
          />

          {/* Nome */}
          {!isEditing ? (
            <h2>{name}</h2>
          ) : (
            <input
              type="text"
              value={name}
              className="edit-input"
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <div className="info">

            {/* Cargo */}
            <p>
              <i className="fas fa-user-graduate"></i>{" "}
              {!isEditing ? (
                <span>{role}</span>
              ) : (
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              )}
            </p>

            {/* Localização */}
            <p>
              <i className="fas fa-map-marker-alt"></i>{" "}
              {!isEditing ? (
                <span>{location}</span>
              ) : (
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              )}
            </p>

            {/* E-mail */}
            <p>
              <i className="fas fa-envelope"></i>{" "}
              {!isEditing ? (
                <span>{email}</span>
              ) : (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </p>

            {/* Telefone */}
            <p>
              <i className="fas fa-phone"></i>{" "}
              {!isEditing ? (
                <span>{phone}</span>
              ) : (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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

          {/* Ícones */}
          <div className="icons">
            <i
              className="fas fa-pencil-alt"
              title="Editar perfil"
              onClick={() => setIsEditing(!isEditing)}
            ></i>

            <i className="fas fa-share-alt" title="Compartilhar"></i>

            <div className="fav">
              <i
                className="fas fa-heart"
                id="favBtn"
                title="Cursos Favoritos"
                onClick={() => setFavOpen(true)}
              ></i>

              {/* Tooltip favoritos */}
              {favOpen && (
                <div className="tooltip">
                  <span className="close-btn" onClick={() => setFavOpen(false)}>
                    &times;
                  </span>

                  <strong>Cursos Favoritos:</strong>

                  <ul>
                    {favCourses.length === 0 && <li>Nenhum curso salvo.</li>}
                    {favCourses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>

                  <textarea
                    rows="4"
                    placeholder="Digite cursos favoritos separados por linha..."
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

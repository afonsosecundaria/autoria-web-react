import React, { useEffect, useState } from "react";
import "../Home/Home.css";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [ehProfessor, setEhProfessor] = useState(false);
  const [loading, setLoading] = useState(true);

  // Alternar sidebar
  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  // Buscar cursos e verificar perfil
  useEffect(() => {
    async function carregarDados() {
      setLoading(true);

      // Verificar tipo de usuário
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("http://localhost:3000/api/perfil", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const user = await res.json();
            setEhProfessor(user.tipo_usuario === "professor");
          }
        } catch (error) {
          console.error("Erro ao verificar perfil:", error);
        }
      }

      // Carregar cursos
      try {
        const res = await fetch("http://localhost:3000/api/cursos");
        const data = await res.json();
        setCursos(data);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
      }

      setLoading(false);
    }

    carregarDados();
  }, []);

  // Remover curso
  async function removerCurso(slug) {
    if (!window.confirm("Tem certeza que deseja remover este curso?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Você precisa estar logado!");

    try {
      const res = await fetch(`http://localhost:3000/api/cursos/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Curso removido com sucesso!");
        // Atualiza lista de cursos
        setCursos((prev) => prev.filter((c) => c.slug !== slug));
      } else {
        alert("Erro ao remover curso: " + (data.erro || "Erro desconhecido"));
      }
    } catch (error) {
      alert("Erro ao remover curso.");
      console.error(error);
    }
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

      {/* MENU LATERAL + BOTÃO */}
      <div className="sidebar-wrapper">
        <div className={`sidebar ${sidebarOpen ? "expanded" : ""}`}>
          <a href="/index" className="nav-link">
            <i className="fas fa-home"></i> <span>Início</span>
          </a>
          <a href="/perfil" className="nav-link">
            <i className="fas fa-user"></i> <span>Perfil</span>
          </a>
          <a href="#" className="nav-link">
            <i className="fas fa-cog"></i> <span>Configurações</span>
          </a>
          <a href="/sobre" className="nav-link">
            <i className="fas fa-info-circle"></i> <span>Sobre nós</span>
          </a>
        </div>

        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      {/* BOTÃO CRIAR CURSO (somente professores) */}
      {ehProfessor && (
        <a href="/criar">
          <button className="botao btn btn-roxo">Criar curso</button>
        </a>
      )}

      {/* CURSOS */}
      <section className="cursos">
        {loading ? (
          <p>Carregando cursos...</p>
        ) : cursos.length === 0 ? (
          <p>Nenhum curso disponível.</p>
        ) : (
          cursos.map((curso) => (
            <div
              key={curso.slug}
              className="curso card m-3"
              style={{ width: "18rem" }}
            >
              <div className="card-body curso__conteudo">
                <h5 className="card-title curso__titulo">{curso.nome}</h5>
                <p className="card-text curso__descr">{curso.descricao}</p>

                <a href={curso.link} className="botao btn btn-roxo">
                  Ver curso
                </a>

                {ehProfessor && (
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => removerCurso(curso.slug)}
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}

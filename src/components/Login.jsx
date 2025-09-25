// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha no login');
      }

      localStorage.setItem('token', data.token);
      navigate('/perfil'); // redireciona para página perfil
    } catch (err) {
      alert(err.message);
      console.error('Erro:', err);
    }
  };

  return (
    <div className="form-container">
      <h2><i className="fas fa-sign-in-alt"></i> Entrar</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input 
            type="password" 
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required 
          />
        </div>
        <div className="form-link">
          <a href="/cadastro">Ainda não possui conta? <strong>Cadastre-se</strong></a>
        </div>
        <div className="form-group">
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
};

export default Login;

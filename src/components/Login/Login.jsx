// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
      navigate('/perfil');
    } catch (err) {
      alert(err.message);
      console.error('Erro:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="bg-white/70 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8 flex items-center justify-center gap-2">
          <i className="fas fa-sign-in-alt text-purple-600"></i> 
          Entrar
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SENHA */}
          <div>
            <label htmlFor="senha" className="block font-semibold text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* LINK */}
          <div className="text-sm text-center">
            <a
              href="/cadastro"
              className="text-purple-700 hover:underline"
            >
              Ainda não possui conta? <strong>Cadastre-se</strong>
            </a>
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition"
          >
            Entrar
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;

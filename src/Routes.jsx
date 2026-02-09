import { Routes, Route } from "react-router-dom";
import Home from './components/Home/Home'; 
import Login from './components/Login/Login';
import Cadastro from './components/Cadastro/Cadastro';
import Perfil from './components/Perfil/Perfil';
import BancoQuestoes from './components/BancoQuestoes/BancoQuestoes';
import MeusCursos from './components/MeusCursos/MeusCursos';
import CursoDetalhe from './components/DetalheCursos/DetalheCursos';
import CriarCurso from './components/CriarCurso/CriarCurso';
import CriarQuestao from './components/CriarQuestao/CriarQuestao';
import FazerQuestoes from './components/FazerQuestoes/FazerQuestoes';

import RotaPrivada from "./components/RotaPrivada/RotaPrivada"; // 👈 importe

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* ROTAS PROTEGIDAS */}
      <Route path="/" element={
        <RotaPrivada>
          <Home />
        </RotaPrivada>
      } />

      <Route path="/perfil" element={
        <RotaPrivada>
          <Perfil />
        </RotaPrivada>
      } />

      <Route path="/questoes" element={
        <RotaPrivada>
          <BancoQuestoes />
        </RotaPrivada>
      } />

      <Route path="/meuscursos" element={
        <RotaPrivada>
          <MeusCursos />
        </RotaPrivada>
      } />

      <Route path="/curso/:id" element={
        <RotaPrivada>
          <CursoDetalhe />
        </RotaPrivada>
      } />

      <Route path="/criar-curso" element={
        <RotaPrivada>
          <CriarCurso />
        </RotaPrivada>
      } />

      <Route path="/questoes/:tema" element={
        <RotaPrivada>
          <FazerQuestoes />
        </RotaPrivada>
      } />

      <Route path="/criar-questao/:topico" element={
        <RotaPrivada>
          <CriarQuestao />
        </RotaPrivada>
      } />
    </Routes>
  );
}

export default App;

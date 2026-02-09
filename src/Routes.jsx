import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; 
import Login from './components/Login/Login';
import Cadastro from './components/Cadastro/Cadastro'
import Perfil from './components/Perfil/Perfil';
import BancoQuestoes from './components/BancoQuestoes/BancoQuestoes';
import MeusCursos from './components/MeusCursos/MeusCursos';
import CursoDetalhe from './components/DetalheCursos/DetalheCursos';
import CriarCurso from './components/CriarCurso/CriarCurso';
import CriarQuestao from './components/CriarQuestao/CriarQuestao';
import FazerQuestoes from './components/FazerQuestoes/FazerQuestoes';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/cadastro' element={<Cadastro/>} />
      <Route path='/perfil' element={<Perfil/>} />
      <Route path='/questoes' element={<BancoQuestoes/>} />
      <Route path='/meuscursos' element={<MeusCursos/>} />
      <Route path='/curso/:id' element={<CursoDetalhe/>} />
      <Route path="/criar-curso" element={<CriarCurso />} />
      <Route path="/questoes/:tema" element={<FazerQuestoes />} />
      <Route path="/criar-questao" element={<CriarQuestao />} />

    </Routes>
  );
}

export default App;

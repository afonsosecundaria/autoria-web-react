import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; 
import Login from './components/Login/Login';
import Cadastro from './components/Cadastro/Cadastro'
import Perfil from './components/Perfil/Perfil';



function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/cadastro' element={<Cadastro/>} />
      <Route path='/perfil' element={<Perfil/>}/>
    </Routes>
  );
}

export default App;

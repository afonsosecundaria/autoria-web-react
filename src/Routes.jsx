import { Routes, Route } from 'react-router-dom';
// import Home from './components/Home.jsx'; 
import Login from './components/Login';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;

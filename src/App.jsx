import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Panier from './pages/Panier';
import Error404 from './pages/Error404';
import Commandes from './pages/Commandes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/panier" element={<Panier />} />
      <Route path="/commandes" element={<Commandes />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;

// import logo from './logo.svg';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu';
import {InicioPage} from './pages/InicioPage';
import {LoginPage} from './pages/LoginPage';
import {CrearCuentaPage} from './pages/CrearCuentaPage';
import {CrearCuentaE} from './pages/CrearCuentaE';
import {CrearCuentaC } from './pages/CrearCuentaC';

function App() {
  return (
    <HashRouter>
      <Menu />
      <Routes>
      <Route path="/" element={<InicioPage/>}/> 
        <Route path="/crearCuenta" element={<CrearCuentaPage />}/> 
        <Route path="/login" element={<LoginPage />}/> 
        <Route path="/crearCuentaE" element={<CrearCuentaE/>}/>
        <Route path="/crearCuentaC" element={<CrearCuentaC/>}/>

        <Route path="*" element={<p>Ups...La ruta no existe</p>}/> 
      </Routes>
      <footer className="footer">
          Chile, 2024
      </footer>
    </HashRouter>

  );
}

export default App;

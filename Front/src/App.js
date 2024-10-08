// import logo from './logo.svg';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu';
import {InicioPage} from './pages/InicioPage';
import {LoginPage} from './pages/LoginPage';
import {CrearCuentaPage} from './pages/CrearCuentaPage';
import {CrearCuentaE} from './pages/CrearCuentaE';
import {CrearCuentaC } from './pages/CrearCuentaC';

import { AdminPage } from './pages/AdminPage';
import { GestionCategorias } from './pages/GestionCategorias.js';


import { ClientePage } from './pages/ClientePage';
import { EmprendedorPage } from './pages/EmprendedorPage.js';


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

        <Route path="/adminPage" element={<AdminPage/>}/>
        <Route path="/gestionCategorias" element={<GestionCategorias/>}/>
        
        <Route path="/clientePage" element={<ClientePage/>}/>
        <Route path="/emprendedorPage" element={<EmprendedorPage/>}/>



        <Route path="*" element={<p>Ups...La ruta no existe</p>}/> 
      </Routes>
      <footer className="footer">
          Chile, 2024
      </footer>
    </HashRouter>

  );
}

export default App;

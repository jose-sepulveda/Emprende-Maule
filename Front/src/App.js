// import logo from './logo.svg';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu';
import {InicioPage} from './pages/InicioPage';
import {LoginPage} from './pages/LoginPage';

import {CrearCuentaPage} from './pages/CrearCuentaPage';
import FormCrearCliente from './components/FormCrearCliente.js'; //formulario crear cliente


import { AdminPage } from './pages/AdminPage';
import { GestionCategorias } from './pages/GestionCategorias.js';
import { GestionClientes } from './pages/GestionClientes.js';


import { ClientePage } from './pages/ClientePage';
import { EmprendedorPage } from './pages/EmprendedorPage.js';


function App() {
  return (
    <HashRouter>
      <Menu />
      <Routes>
      <Route path="/" element={<InicioPage/>}/> 
        
        <Route path="/login" element={<LoginPage />}/> 
        
        <Route path="/crearCuenta" element={<CrearCuentaPage />}/> 
        <Route path="/formCrearC" element={<FormCrearCliente/>}/> 

        <Route path="/adminPage" element={<AdminPage/>}/>
        <Route path="/gestionCategorias" element={<GestionCategorias/>}/>
        <Route path="/gestionClientes" element={<GestionClientes/>}/>
        
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

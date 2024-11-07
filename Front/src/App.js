// import logo from './logo.svg';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu';
import { InicioPage } from './pages/InicioPage';
import { LoginPage } from './pages/LoginPage';

import FormCrearCliente from './components/FormCrearCliente.js'; //formulario crear cliente
import { CrearCuentaPage } from './pages/CrearCuentaPage';

//Admin
import { AdminPage } from './pages/AdminPage';
import { GestionAdmin } from './pages/GestionAdmin.js';
import { GestionCategorias } from './pages/GestionCategorias.js';
import { GestionClientes } from './pages/GestionClientes.js';
import { GestionEmprendedores } from './pages/GestionEmprendedores.js';

//cliente
import { ClientePage } from './pages/ClientePage';


//emprendedor
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './Auth/AuthContext.js';
import FormCrearEmprendedor from './components/FormCrearEmprendedor.js';
import LoginAministrador from './components/LoginAministrador.js';
import LoginCliente from './components/LoginCliente.js';
import LoginEmprendedor from './components/LoginEmprendedor.js';
import { EmprendedorPage } from './pages/EmprendedorPage.js';
import { GestionProducto } from './pages/GestionProducto.js';



function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Menu />
        <Routes>
        <Route path="/" element={<InicioPage/>}/> 
          
          {/*Pagina de inicio*/}
          <Route path="/login" element={<LoginPage />}/> 
          
          {/*crear cuentas cliente y emprendedor*/}
          <Route path="/crearCuenta" element={<CrearCuentaPage />}/> 
          <Route path="/formCrearC" element={<FormCrearCliente/>}/> 
          <Route path='/formCrearE' element={<FormCrearEmprendedor/>}/>

          {/*Administrador*/}
          <Route path='/login-administrador'element={<LoginAministrador/>}/>
          <Route path="/adminPage" element={<AdminPage/>}/>
          <Route path="/gestionCategorias" element={<GestionCategorias/>}/>
          <Route path="/gestionClientes" element={<GestionClientes/>}/>
          <Route path="/gestionAdmin" element={<GestionAdmin/>}/>
          <Route path= "/gestionEmprendedores" element= {<GestionEmprendedores/>}/>

          {/*Cliente*/}
          <Route path='/login-cliente' element={<LoginCliente/>}/>
          <Route path="/clientePage" element={<ClientePage/>}/>

          {/*Emprendedor*/}
          <Route path='/login-emprendedor' element={<LoginEmprendedor/>}/>
          <Route path="/emprendedorPage" element={<EmprendedorPage/>}/>
          <Route path="/gestionProducto" element={<GestionProducto/>}/>




          <Route path="*" element={<p>Ups...La ruta no existe</p>}/> 
        </Routes>
        <footer className="footer">
            Chile, 2024
        </footer>
      </HashRouter>
      <ToastContainer position="top-center" autoClose={1000} />
    </AuthProvider>

  );
}

export default App;

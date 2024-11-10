// import logo from './logo.svg';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu';
import { InicioPage } from './pages/InicioPage';
import { LoginPage } from './pages/LoginPage';

import FormCrearCliente from './components/FormCrearCliente.js'; //formulario crear cliente
import { CrearCuentaPage } from './pages/CrearCuentaPage';

//Admin
import LoginAministrador from './components/LoginAministrador.js';
import { GestionAdmin } from './pages/GestionAdmin.js';
import { GestionCategorias } from './pages/GestionCategorias.js';
import { GestionClientes } from './pages/GestionClientes.js';
import { GestionEmprendedores } from './pages/GestionEmprendedores.js';

//cliente
import LoginCliente from './components/LoginCliente.js';


//emprendedor
import FormCrearEmprendedor from './components/FormCrearEmprendedor.js'; //formulario crear emprendedor 
import CrearProducto from './components/FormCrearProducto.js';
import LoginEmprendedor from './components/LoginEmprendedor.js';
import { GestionProducto } from './pages/GestionProducto.js';

import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './Auth/AuthContext';
import { PrivateRoute } from './Auth/PrivateRoute';
import ResetPasswordAdmin from './components/ResetPasswordAdmin.js';


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
          <Route path="/gestionCategorias" element={<PrivateRoute><GestionCategorias/></PrivateRoute>}/>
          <Route path="/gestionClientes" element={<PrivateRoute><GestionClientes/></PrivateRoute>}/>
          <Route path="/gestionAdmin" element={<PrivateRoute><GestionAdmin/></PrivateRoute>}/>
          <Route path= "/gestionEmprendedores" element= {<PrivateRoute><GestionEmprendedores/></PrivateRoute>}/>

          {/*Cliente*/}
          <Route path='/login-cliente' element={<LoginCliente/>}/>


          {/*Emprendedor*/}
          <Route path='/login-emprendedor' element={<LoginEmprendedor/>}/>
          <Route path="/gestionProducto" element={<GestionProducto/>}/> {/*este era privado pero solo quiero probar cositas */}
          <Route path='/formCrearP' element={<CrearProducto/>}/>

          {/*Recuperacion de contraseña*/}

          <Route path="/reset-password/:token" element={<ResetPasswordAdmin />} />

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
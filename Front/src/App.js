// import logo from './logo.svg';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Menu } from './components/Menu';
import { InicioPage } from './pages/InicioPage';
import { LoginPage } from './pages/LoginPage';

import FormCrearCliente from './components/FormCrearCliente.js'; //formulario crear cliente
import { CrearCuentaPage } from './pages/CrearCuentaPage';

import Inicio from './components/Inicio';
import ProductoIndividual from './components/ProductoIndividual';
import Productoos from './components/Productoos.js';

//Admin
import LoginAministrador from './components/LoginAministrador.js';
import { AdminPage } from './pages/AdminPage.js';
import { GestionAdmin } from './pages/GestionAdmin.js';
import { GestionCategorias } from './pages/GestionCategorias.js';
import { GestionClientes } from './pages/GestionClientes.js';
import { GestionEmprendedores } from './pages/GestionEmprendedores.js';
//cliente
import LoginCliente from './components/LoginCliente.js';
import {DetalleVentaCliente} from './pages/DetalleVentaCliente.js';


//emprendedor
import FormCrearEmprendedor from './components/FormCrearEmprendedor.js'; //formulario crear emprendedor 
import CrearProducto from './components/FormCrearProducto.js';
import LoginEmprendedor from './components/LoginEmprendedor.js';
import { GestionProducto } from './pages/GestionProducto.js';
import { TablaP } from './pages/TablaP.js';

import { jwtDecode } from 'jwt-decode';
import { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { AuthContext, AuthProvider } from './Auth/AuthContext';
import { PrivateRoute } from './Auth/PrivateRoute';
import Carrito from './components/Carrito.js';
import Contacto from './components/Contacto.js';
import DetalleEmprendedor from './components/DetalleEmprendedor.js';
import DetalleSolicitud from './components/DetalleSolicitud.js';
import FormActualizarEmprendedor from './components/FormActualizarEmprendedor.js';
import PerfilEmprendedor from './components/PerfilEmprendedor.js';
import ResetPasswordAdmin from './components/ResetPasswordAdmin.js';
import ResetPasswordCliente from './components/ResetPasswordCliente.js';
import ResetPasswordEmprendedor from './components/ResetPasswordEmprendedor.js';
import { SolicitudesRegistro } from './pages/SolicitudesRegistro.js';

import DetalleVentaC from './components/DetalleVentaC.js';

function AuthProviderWithRouter({children}) {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) {
      try {
        const decodedToken = jwtDecode(auth.token);
        const { exp } = decodedToken;

        if (exp * 1000 < Date.now()) {
          logout();
          navigate("/");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        logout();
        navigate("/");
      }
    }
  }, [auth, logout, navigate]);

  return children;
}

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <AuthProviderWithRouter>
          <Menu />
          <Routes>
            <Route path="/" element={<InicioPage/>}/> 
            
            {/*Pagina de inicio*/}
            <Route path="/login" element={<LoginPage />}/> 
            <Route path="/" element={<Inicio />} />
            <Route path="/producto/:id" element={<ProductoIndividual />} /> 
            <Route path="/productoos" element={<Productoos />}/> 
            <Route path="/contacto" element= {<Contacto />}/>
            
            
            
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
            <Route path= "/actualizar-emprendedor/:rut_emprendedor" element= {<PrivateRoute><FormActualizarEmprendedor/></PrivateRoute>}/>
            <Route path= "/detalle-emprendedor/:rut_emprendedor" element= {<PrivateRoute><DetalleEmprendedor/></PrivateRoute>}/>
            <Route path= "/solicitudes-registro" element= {<PrivateRoute><SolicitudesRegistro/></PrivateRoute>}/>
            <Route path= "/detalle-solicitud/:rut_emprendedor" element= {<PrivateRoute><DetalleSolicitud/></PrivateRoute>}/>
            <Route path= "/adminPage" element= {<PrivateRoute><AdminPage/></PrivateRoute>}/>

            {/*Cliente*/}
            <Route path='/login-cliente' element={<LoginCliente/>}/>
            <Route path="/detalle-venta/:id_cliente" element={<DetalleVentaC />} />
            <Route path='/detalle-venta-cliente' element={<DetalleVentaCliente/>}/> 


            {/*Emprendedor*/}
            <Route path='/login-emprendedor' element={<LoginEmprendedor/>}/>
            <Route path="/gestionProducto" element={<GestionProducto/>}/> {/*este era privado pero solo quiero probar cositas */}
            <Route path="/tablaP" element={<TablaP/>}/>
            <Route path='/formCrearP' element={<CrearProducto/>}/>
            <Route path='/perfil-emprendedor' element={<PerfilEmprendedor/>}/>
            <Route path='/carrito' element={<Carrito/>}/>

            {/*Recuperacion de contraseña*/}

            <Route path="/reset-password-admin/:token" element={<ResetPasswordAdmin />} />
            <Route path="/reset-password-emprendedor/:token" element={<ResetPasswordEmprendedor />} />
            <Route path="/reset-password-cliente/:token" element={<ResetPasswordCliente />} />

            <Route path="*" element={<p>Ups...La ruta no existe</p>}/> 
          </Routes>
          <footer className="footer">
              Chile, 2024
          </footer>
        <ToastContainer position="top-center" autoClose={1000} />
      </AuthProviderWithRouter>
    </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
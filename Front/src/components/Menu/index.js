import { jwtDecode } from "jwt-decode";
import React from "react";
import { FaShoppingCart } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthContext";
import Logo from '../../Image/logoEM.png';
import '../../Styles/menu.css';

function Menu(){

    const { auth, logout } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const routes = [{ to: "/", text: "Inicio" }];

    
    if (auth.token) {
        const decodedToken = jwtDecode(auth.token);
        
        // Admin
        if (decodedToken.role === "administrador") {
            routes.push(
                { to: "/gestionCategorias", text: "Gestion Categorias" },
                { to: "/gestionClientes", text: "Gestion Clientes" },
                { to: "/gestionEmprendedores", text: "Gestion Emprendedores" },
                {to:"/gestionAdmin", text:"Gestion Admin"},
                {to:"/solicitudes-registro", text:"Solicitudes de Registro"}
            );
        }
 

        // Emprendedor
        if (decodedToken.role === "emprendedor") {
            routes.push(

                {to:"/gestionProducto", text:"Gestion Productos"},
                {to:"/tablaP", text:"Productos"},
        );   
        }

        //Cliente
        if (decodedToken.role === "cliente") {

        }

    } else {
        // general
        routes.push(
            { to: "/crearCuenta", text: "Crear cuenta" },
            { to: "/login", text: "Iniciar sesión" },


        );    
    }

    const cerrarSesion = () => {
        logout();

        routes.splice(0, routes.length)
        routes.push({to:"/", text:"Inicio"})
        routes.push({to:"/crearCuenta", text:"Crear cuenta"})
        routes.push({to:"/login", text:"Iniciar sesión"})

        navigate("/");
    }

    return <>
        <div className="container-barra">
            <div className="logo-container">
                <img src={Logo} alt="" className="logo" />
            </div>
            <ul className="menu">
                {
                routes.map( (item, index)=>(
                    <li key={index}>
                        <NavLink 
                            style={({isActive}) => ({color:isActive? '#f98000':"Black"})}
                            to={item.to}>
                            {item.text}
                        </NavLink>
                    </li>
                ) )
                }
                {
                    auth.token?
                    <button onClick={cerrarSesion}>Salir</button>:
                    ""
                }
                <li>
                        <NavLink 
                            style={({ isActive }) => ({ color: isActive ? "Orange" : "Black" })}
                            to="/carrito">
                            <FaShoppingCart size={24} /> 
                        </NavLink>
                </li>
            </ul>
        </div>
    </>
}


const routes = [];

routes.push({to:"/", text:"Inicio"})
routes.push({to:"/crearCuenta", text:"Crear cuenta"})
routes.push({to:"/login", text:"Iniciar sesión"})
routes.push({to:"/gestionProducto", text:"Gestion Productos"})
routes.push({to:"/gestionClientes", text:"Gestion Clientes"})
routes.push({to:"/gestionCategorias", text:"Gestion Categorias"})
routes.push({to:"/gestionEmprendedores", text:"Gestion Emprededores"})
routes.push({to:"/gestionAdmin", text:"Gestion Admin"})
routes.push({to:"/tablaP", text:"Productos"})
routes.push({to:"/solicitudes-registro", text:"Solicitudes de Registro"})

export { Menu };



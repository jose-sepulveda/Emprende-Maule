import { jwtDecode } from "jwt-decode";
import React from "react";
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthContext";
import Logo from '../../Image/Logo.jpeg';
import '../../Styles/menu.css';

function Menu(){

    const { auth, logout } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const routes = [{ to: "/", text: "Inicio" },
        { to: "/productoos", text: "Todos los productos" }
    ];

    let showCarrito = false;

    
    if (auth.token) {
        const decodedToken = jwtDecode(auth.token);
        
        // Admin
        if (decodedToken.role === "administrador") {
            routes.push(
                {to:"/adminPage", text:"Administrador"}
            );
        }
 
        // Emprendedor
        if (decodedToken.role === "emprendedor") {
            routes.push(

                {to:"/gestionProducto", text:"Crear producto"},
                {to:"/tablaP", text:"Gestión Productos"},
                {to:"/perfil-emprendedor", text:"Mis Datos"}
        );   
        }

        //Cliente
        if (decodedToken.role === "cliente") {
            showCarrito = true;
        }

    } else {
        // general
        routes.push(
            { to: "/crearCuenta", text: "Crear cuenta" },
            { to: "/login", text: "Iniciar sesión" },
        );   
        showCarrito = true; 
    }

    const cerrarSesion = () => {
        logout();

        routes.splice(0, routes.length)
        routes.push({to:"/", text:"Inicio"})
        routes.push({to:"/crearCuenta", text:"Crear cuenta"})
        routes.push({to:"/login", text:"Iniciar sesión"})



        navigate("/");
    }

    return (
        <>
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
                        showCarrito && (
                            <li>
                                <NavLink 
                                    style={({ isActive }) => ({ color: isActive ? "Orange" : "Black" })}
                                    to="/carrito">
                                    <FaShoppingCart size={24} /> 
                                </NavLink>
                            </li>
                        )
                    }
                    
                    {
                        auth.token?
                        <button className="btn-logout" onClick={cerrarSesion}>
                            <FaSignOutAlt size={24} />
                        </button>:
                        ""
                    }
                </ul>
            </div>
        </>
    );
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
routes.push({to:"/adminPage", text:"Administrador"})
routes.push({to:"/productoos", text:"Todos los productos"})

export { Menu };



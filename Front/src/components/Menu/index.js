import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { FaShoppingCart } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthContext";
import Logo from '../../Image/Logo.jpeg';
import '../../Styles/menu.css';

function Menu(){

    const { auth, logout } = useContext(AuthContext);
    let decodedToken = null;
    const navigate = useNavigate();

    if (auth.token) {
        console.log(auth.token)
        decodedToken = jwtDecode(auth.token);
        console.log(decodedToken.role);

        routes.splice(0, routes.length);

        // General
        routes.push({to:"/", text:"Inicio"})

        // Emprendedor
        if (decodedToken.role === "emprendedor") {
            routes.push({to:"/gestionCategorias", text:"Gestion Categorias"})
            routes.push({to:"/gestionEmprendedores", text:"Gestion Emprededores"})
        }
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
                            style={({isActive}) => ({color:isActive?"Orange":"Black"})}
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

export { Menu };


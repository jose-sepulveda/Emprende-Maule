import { NavLink } from "react-router-dom";
import Logo from '../../Image/Logo.jpeg';
import { FaShoppingCart } from 'react-icons/fa';
import '../../Styles/menu.css';

function Menu(){
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

export {Menu}
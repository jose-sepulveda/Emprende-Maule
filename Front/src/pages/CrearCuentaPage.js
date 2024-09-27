import { NavLink } from "react-router-dom";
import '../Styles/crearCuenta.css';

function CrearCuentaPage(){
    return <>
        <div className="container-crear-cuenta">
            <ul className="opcion-crear-cuenta">
            {routes.map((item, index) => (
                    <li key={index}>
                        <NavLink 
                            to={item.to} 
                            className="boton-crear-cuenta">
                            {item.text}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    </>
}

const routes = [];

routes.push({to:"/crearCuentaE", text:"Crear cuenta Emprendedor"})
routes.push({to:"/crearCuentaC", text:"Crear cuenta Cliente"})
export {CrearCuentaPage};
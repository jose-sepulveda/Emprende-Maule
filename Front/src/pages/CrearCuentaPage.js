import { NavLink } from "react-router-dom";
import '../Styles/crearCuenta.css';
import icono from '../Image/ico3.png';

function CrearCuentaPage(){
    return (
        <div className="container-crear-cuenta">
            <img src={icono} alt="icono" className="imagen-icono" />
            
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
    );
}

const routes = [
    { to: "/formCrearE", text: "Crear cuenta Emprendedor" },
    { to: "/formCrearC", text: "Crear cuenta Cliente" }
];

export { CrearCuentaPage };

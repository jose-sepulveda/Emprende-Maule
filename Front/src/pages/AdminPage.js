import { faClipboardList, faCogs, faLayerGroup, faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import "../Styles/adminPage.css";

function AdminPage() {
    const menuItems = [
        { to: "/gestionCategorias", text: "Gestión Categorías", icon: faLayerGroup },
        { to: "/gestionClientes", text: "Gestión Clientes", icon: faUsers },
        { to: "/gestionEmprendedores", text: "Gestión Emprendedores", icon: faCogs },
        { to: "/gestionAdmin", text: "Gestión de Admin", icon: faUserTie },
        { to: "/solicitudes-registro", text: "Solicitudes de Registro", icon: faClipboardList },
    ];

    return (
        <div className="admin-page">
            <h1>Administrador</h1>
            <div className="menu-container">
                {menuItems.map((item, index) => (
                    <Link to={item.to} key={index} className="menu-item">
                        <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                        <div className="menu-text">{item.text}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export { AdminPage };


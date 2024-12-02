import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { getClienteById } from '../services/crearCliente';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; 
import '../Styles/perfil-cliente.css';

const PerfilCliente = () => {
    const { auth } = useContext(AuthContext); 
    const [cliente, setCliente] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (auth.id) {
            getClienteById(auth.id)
                .then((response) => {
                    setCliente(response.data);
                })
                .catch((err) => {
                    console.error('Error al obtener los datos del cliente:', err);
                    setError('Error al obtener los datos del cliente.');
                });
        }
    }, [auth.id]);

    if (!cliente) {
        return <div className="perfil-cliente-container">Cargando datos del cliente...</div>;
    }

    return (
        <div className="perfil-cliente-container">
            <div className="perfil-cliente-icono">
                <FontAwesomeIcon icon={faUserCircle} size="3x" />
            </div>
            <h2 className="perfil-cliente-title">Perfil de Cliente</h2>
            {error && <div className="perfil-cliente-error">{error}</div>}

            <div className="perfil-cliente-info">
                <p><strong>RUT:</strong> {cliente.rut_cliente}</p>
                <p><strong>Correo:</strong> {cliente.correo}</p>
                <p><strong>Nombre:</strong> {cliente.nombre_cliente} {cliente.apellido1_cliente} {cliente.apellido2_cliente}</p>
                <p><strong>Dirección:</strong> {cliente.direccion}</p>
                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
            </div>
        </div>
    );
};

export default PerfilCliente;

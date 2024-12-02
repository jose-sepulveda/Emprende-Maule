import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { getClienteById, updateCliente } from '../services/crearCliente';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; 
import '../Styles/perfil-cliente.css';

const PerfilCliente = () => {
    const { auth } = useContext(AuthContext); 
    const [cliente, setCliente] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false); 
    const [formData, setFormData] = useState({}); 

    useEffect(() => {
        if (auth.id) {
            getClienteById(auth.id)
                .then((response) => {
                    setCliente(response.data);
                    setFormData(response.data); 
                })
                .catch((err) => {
                    console.error('Error al obtener los datos del cliente:', err);
                    setError('Error al obtener los datos del cliente.');
                });
        }
    }, [auth.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        updateCliente(auth.id, formData)
            .then(() => {
                setCliente(formData); 
                setIsEditing(false);
            })
            .catch((err) => {
                console.error('Error al actualizar los datos del cliente:', err);
                setError('Error al actualizar los datos del cliente.');
            });
    };

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
                {isEditing ? (
                    <>
                        <label>
                            <strong>RUT:</strong>
                            <input type="text" name="rut_cliente" value={formData.rut_cliente || ''} onChange={handleInputChange}/>
                        </label>
                        <label>
                            <strong>Correo:</strong>
                            <input type="email" name="correo" value={formData.correo || ''} onChange={handleInputChange} />
                        </label>
                        <label>
                            <strong>Nombre:</strong>
                            <input type="text" name="nombre_cliente" value={formData.nombre_cliente || ''} onChange={handleInputChange}/>
                        </label>
                        <label>
                            <strong>Apellido Paterno:</strong>
                            <input type="text" name="apellido1_cliente" value={formData.apellido1_cliente || ''} onChange={handleInputChange} />
                        </label>
                        <label>
                            <strong>Apellido Materno:</strong>
                            <input type="text" name="apellido2_cliente" value={formData.apellido2_cliente || ''} onChange={handleInputChange} />
                        </label>
                        <label>
                            <strong>Dirección:</strong>
                            <input type="text" name="direccion" value={formData.direccion || ''} onChange={handleInputChange}/>
                        </label>
                        <label>
                            <strong>Teléfono:</strong>
                            <input type="text" name="telefono" value={formData.telefono || ''} onChange={handleInputChange} />
                        </label>
                    </>
                ) : (
                    <>
                        <p><strong>RUT:</strong> {cliente.rut_cliente}</p>
                        <p><strong>Correo:</strong> {cliente.correo}</p>
                        <p><strong>Nombre:</strong> {cliente.nombre_cliente} {cliente.apellido1_cliente} {cliente.apellido2_cliente}</p>
                        <p><strong>Dirección:</strong> {cliente.direccion}</p>
                        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                    </>
                )}
            </div>
            <div className="perfil-cliente-actions">
                {isEditing ? (
                    <button onClick={handleSave}>Guardar</button>
                ) : (
                    <button onClick={handleEditToggle}>Editar</button>
                )}
                {isEditing && <button onClick={handleEditToggle}>Cancelar</button>}
            </div>
        </div>
    );
};

export default PerfilCliente;

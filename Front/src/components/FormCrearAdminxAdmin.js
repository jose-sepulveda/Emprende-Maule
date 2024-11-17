import React, { useState } from 'react';
import { createAdmin } from '../services/admin'; 
import '../Styles/crearAdmin.css'; 

const FormCrearAdminxAdmin = () => {
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido1, setApellido1] = useState('');
    const [apellido2, setApellido2] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevoAdmin = {
            rut_administrador: rut,
            contrasena,
            nombre_administrador: nombre,
            apellido1_administrador: apellido1,
            apellido2_administrador: apellido2,
            correo
        };

        try {
            const response = await createAdmin(nuevoAdmin);  
            setMensaje(`Administrador creado con éxito: ${response.data.message}`);  
        } catch (error) {
            setMensaje('Error al crear el administrador');
        }
    };

    return (
        <div className='contenedor-crear-adminxadmin'>
            <h2>Crear Administrador</h2>
            <form className='contenedor-form-crear-adminxadmin' onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div>
                    <label>Apellido 1</label>
                    <input type="text" value={apellido1} onChange={(e) => setApellido1(e.target.value)} required />
                </div>
                <div>
                    <label>Apellido 2</label>
                    <input type="text" value={apellido2} onChange={(e) => setApellido2(e.target.value)} required />
                </div>
                <div>
                    <label>RUT</label>
                    <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} required />
                </div>
                <div>
                    <label>Correo</label>
                    <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                </div>
                <button type="submit">Crear Administrador</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default FormCrearAdminxAdmin;

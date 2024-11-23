import React, { useState, useEffect, useContext, useCallback } from 'react';
import { createAdmin, getAdministradores, updateAdmin, deleteAdmin } from '../services/admin'; 
import { AuthContext } from '../Auth/AuthContext';
import '../Styles/crearAdmin.css'; 

const FormCrearAdminxAdmin = () => {
    const { auth } = useContext(AuthContext);
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido1, setApellido1] = useState('');
    const [apellido2, setApellido2] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [administradores, setAdministradores] = useState([]);
    const [editAdmin, setEditAdmin] = useState(null);

    const fetchAdministradores = useCallback(async () => {
        if (!auth.token) {
            setMensaje('No hay token de autenticación');
            return;
        }

        try {
            const admins = await getAdministradores(auth.token);
            setAdministradores(admins);
        } catch (error) {
            setMensaje('Error al obtener lista de administradores creados');
            console.error('Error al obtener lista de administradores:', error);
        }
    }, [auth.token]); 

    useEffect(() => {
        if (auth.token) {
            fetchAdministradores();
        } else {
            setMensaje('No hay token de autenticación');
        }
    }, [auth.token, fetchAdministradores]); 

    const editarAdmin = (admin) => {
        setEditAdmin(admin);
        setRut(admin.rut_administrador);
        setNombre(admin.nombre_administrador);
        setApellido1(admin.apellido1_administrador);
        setApellido2(admin.apellido2_administrador);
        setCorreo(admin.correo);
    };

    const crearAdministradoor = async (e) => {
        e.preventDefault(); 
        const newAdmin = {
            rut_administrador: rut,
            nombre_administrador: nombre,
            apellido1_administrador: apellido1,
            apellido2_administrador: apellido2,
            correo,
            contrasena
        };

        try {
            await createAdmin(newAdmin); 
            alert('Administrador creado con éxito');
            fetchAdministradores();  
            setRut('');
            setNombre('');
            setApellido1('');
            setApellido2('');
            setCorreo('');
            setContrasena('');
        } catch (error) {
            alert('Error al crear el administrador');
            console.error('Error al crear el administrador:', error);
        }
    };

        const guardarCambios = async () => {
            if (editAdmin) {
                const updatedAdmin = {
                    rut_administrador: rut,
                    nombre_administrador: nombre,
                    apellido1_administrador: apellido1,
                    apellido2_administrador: apellido2,
                    correo
                };

        try {
            await updateAdmin(editAdmin.id_administrador, updatedAdmin, auth.token);
            alert('Administrador actualizado con éxito');
            fetchAdministradores();
            setRut('');
            setNombre('');
            setApellido1('');
            setApellido2('');
            setCorreo('');
            setContrasena('');
            setEditAdmin(null);
        } catch (error) {
            alert('Error al actualizar el administrador');
        }
    }
};

    const opcionCancelar = () => {
        setRut('');
        setNombre('');
        setApellido1('');
        setApellido2('');
        setCorreo('');
        setContrasena('');
        setEditAdmin(null);
    };



    const eliminarAdministrador = async (id_administrador) => {
        if (window.confirm('¿Estás seguro de eliminar este Administrador?')) {
            try {
                await deleteAdmin(id_administrador, auth.token);
                alert('Administrador eliminado con éxito');
                setAdministradores(administradores.filter(admin => admin.id_administrador !== id_administrador));
            } catch (error) {
                console.error('Error al eliminar el administrador:', error);
                alert('Error al eliminar el administrador');
            }
        }
    };


    return (
        <div className='contenedor-crear-adminxadmin'>
            <h2>{editAdmin ? 'Editar Administrador' : 'Crear Administrador'}</h2>
            <form className='contenedor-form-crear-adminxadmin' onSubmit={crearAdministradoor}>
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
                {editAdmin ? (
                    <>
                    <button  type="button" onClick={guardarCambios}>Guardar Cambios</button>
                    <button  type="button" onClick={opcionCancelar}>Cancelar</button>
                    </>
                ) : (
                    <button  type="submit">Crear Administrador</button>
                )}
            </form>

            {mensaje && <p>{mensaje}</p>}

            <div>
                <h2>Administradores Registrados:</h2>
                {administradores.length > 0 ? (
                    <table className="tabla-admins">
                        <thead>
                            <tr>
                                <th>Nombre Admin</th>
                                <th>RUT</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {administradores.map((admin) => (
                                <tr key={admin.id_administrador}>
                                    <td>{`${admin.nombre_administrador} ${admin.apellido1_administrador} ${admin.apellido2_administrador}`}</td>
                                    <td>{admin.rut_administrador}</td>
                                    <td>{admin.correo}</td>
                                    <td>
                                        <button  onClick={() => editarAdmin(admin)}>Editar</button>
                                        <button  onClick={() => eliminarAdministrador(admin.id_administrador)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay administradores registrados.</p>
                )}
            </div>
        </div>
    );
};

export default FormCrearAdminxAdmin;

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteEmprendedor, getEmprendedores } from '../services/emprendedor';

const GestionEmprendedores = () => {

    const [ emprendedores, setEmprendedores ] = useState([]);

    useEffect(() => {
        cargarEmprendedores();
    }, []);

    const cargarEmprendedores = async () => {
        try {
            const response  = await getEmprendedores();
            const sortedEmprendedores = response.data.sort((a,b) => a.id_emprendedor - b.id_emprendedor);
            setEmprendedores(sortedEmprendedores);
        } catch (error) {
            console.error('Error al cargar los emprendedores', error);
            toast.error('Error al cargar los emprendedores');
        }
    };

    const eliminarEmprendedor = async (id_emprendedor) => {
        const confirmDelete = window.confirm("Estas seguro de que quieres eliminar este emprendedor?");
        if (confirmDelete) {
            try {
                await deleteEmprendedor(id_emprendedor);
                cargarEmprendedores();
            } catch (error) {
                console.error('Error al eliminar emprendedor');
                toast.error('Error al eliminar emprendedor');
            }
        }
    };

    return (
        <div className='container'>
            <h1>Gestión de Emprendedores</h1>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Dirección</th>
                        <th>Telefono</th>
                        <th>Correo Electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {emprendedores.map((emprendedor) => (
                        <tr key={emprendedor.id_emprendedor}>
                            <td>{emprendedor.id_emprendedor}</td>
                            <td>{emprendedor.nombre_emprendedor}</td>
                            <td>{emprendedor.apellido1_emprendedor} {emprendedor.apellido2_emprendedor}</td>
                            <td>{emprendedor.direccion}</td>
                            <td>{emprendedor.telefono}</td>
                            <td>{emprendedor.correo_electronico}</td>
                            <td>
                                <button id="eliminar" className='btn-eliminar' onClick={() => {eliminarEmprendedor(emprendedor.id_emprendedor)}}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export { GestionEmprendedores };


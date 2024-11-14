import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { getEmprendedores } from '../services/emprendedor';
import "../Styles/gestion-emprendedores.css";

const SolicitudesRegistro = () => {

    const [ emprendedores, setEmprendedores ] = useState([]);
    const [ loading, setLoading ] = useState({});
    const { token } = useContext(AuthContext); 
    const navigate = useNavigate();

    useEffect(() => {
        cargarEmprendedores();
    }, []);

    const cargarEmprendedores = async () => {
        try {
            const response  = await getEmprendedores();
            const emprendedoresAprobados = response.data.filter(emprendedor => emprendedor.estado_emprendedor === 'Pendiente');
            const sortedEmprendedores = emprendedoresAprobados.sort((a,b) => a.id_emprendedor - b.id_emprendedor);
            setEmprendedores(sortedEmprendedores);
        } catch (error) {
            console.error('Error al cargar los emprendedores', error);
            toast.error('Error al cargar los emprendedores');
        }
    };

    const verDetalles = (rut_emprendedor) => {
        navigate(`/detalle-solicitud/${rut_emprendedor}`);
    }
    

    return (
        <div className='container'>
            <h1>Solicitudes de Registro de Emprededores</h1>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Corroe Electrónico</th>
                        <th>Telefono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {emprendedores.map((emprendedor) => (
                        <tr key={emprendedor.id_emprendedor}>
                            <td>{emprendedor.id_emprendedor}</td>
                            <td>{emprendedor.nombre_emprendedor} {emprendedor.apellido1_emprendedor} {emprendedor.apellido2_emprendedor}</td>
                            <td>{emprendedor.direccion}</td>
                            <td>{emprendedor.correo_electronico}</td>
                            <td>{emprendedor.telefono}</td>
                            <td>
                                <button
                                    id='ver' 
                                    className='btn-ver'
                                    onClick={() => verDetalles(emprendedor.rut_emprendedor)}
                                >
                                    Ver Solicitud
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export { SolicitudesRegistro };

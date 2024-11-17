import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { deleteEmprendedor, getEmprendedores } from '../services/emprendedor';
import "../Styles/gestion-emprendedores.css";

const GestionEmprendedores = () => {

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
            const emprendedoresAprobados = response.data.filter(emprendedor => emprendedor.estado_emprendedor === 'Aprobado');
            const sortedEmprendedores = emprendedoresAprobados.sort((a,b) => a.id_emprendedor - b.id_emprendedor);
            setEmprendedores(sortedEmprendedores);
        } catch (error) {
            console.error('Error al cargar los emprendedores', error);
            toast.error('Error al cargar los emprendedores');
        }
    };

    const eliminarEmprendedor = async({ rut_emprendedor }) => {
        const confirmDelete = window.confirm("Estas seguro de que quieres eliminar este emprendedor?");
        if (confirmDelete) {
            setLoading(prevLoading => ({...prevLoading, [rut_emprendedor]: true}))
            try {
                await deleteEmprendedor(rut_emprendedor);
                toast.success('Emprendedor eliminado correctamente')
                cargarEmprendedores();
            } catch (error) {
                console.error('Error al eliminar emprendedor');
                toast.error('Error al eliminar emprendedor');
            } finally {
                setLoading(prevLoading => ({ ...prevLoading, [rut_emprendedor]: false }))
            }
        }
    };

    const verDetalles = (id_emprendedor) => {
        navigate(`/detalle-emprendedor/${id_emprendedor}`);
    }


    const actualizarEmprendedor = (rut_emprendedor) => {
        navigate(`/actualizar-emprendedor/${rut_emprendedor}`);
    }

    return (
        <div className='gestion-emprendedores-container'>
            <h1>Gestión de Emprendedores</h1>

            <table className="gestion-emprendedores-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Rut</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {emprendedores.map((emprendedor) => (
                        <tr key={emprendedor.id_emprendedor}>
                            <td>{emprendedor.id_emprendedor}</td>
                            <td>{emprendedor.nombre_emprendedor} {emprendedor.apellido1_emprendedor} {emprendedor.apellido2_emprendedor}</td>
                            <td>{emprendedor.rut_emprendedor}</td>
                            <td>
                                <button
                                    className='gestion-emprendedores-btn-ver'
                                    onClick={() => verDetalles(emprendedor.rut_emprendedor)}
                                >
                                    Ver
                                </button>

                                <button 
                                    
                                    className="gestion-emprendedores-btn-actualizar"  
                                    onClick={() => actualizarEmprendedor(emprendedor.rut_emprendedor)}
                                >
                                    Actualizar
                                </button>

                                <button
                                     
                                    className='gestion-emprendedores-btn-eliminar' 
                                    onClick={() => eliminarEmprendedor({ rut_emprendedor: emprendedor.rut_emprendedor })}
                                    disabled={loading[emprendedor.rut_emprendedor]}
                                >
                                    {loading[emprendedor.rut_emprendedor] ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export { GestionEmprendedores };


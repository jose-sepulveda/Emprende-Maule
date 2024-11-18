import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { deleteEmprendedor, getEmprendedorById } from '../services/emprendedor';
import "../Styles/perfil-emprendedor.css";

const PerfilEmprendedor = () => {

    const [emprendedor, setEmprendedor] = useState(null);
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const ObtenerEmprendedor = async () => {
            if (!auth?.id) {
                return;
            }
    
            try {
                const response = await getEmprendedorById(auth.id); 
                setEmprendedor(response.data.emprendedor);
                toast.success("Emprendedor obtenido correctamente")
                console.log(auth.id)
            } catch (error) {
                console.error("Error al obtener los detalles del emprendedor:", error);
                toast.error("Error al obtener los detalles del emprendedor")
            }
        };


        ObtenerEmprendedor();
    }, [auth.id]);

    const eliminarEmprendedor = async({ rut_emprendedor }) => {
        const confirmDelete = window.confirm("Estas seguro de que quieres eliminar este emprendedor?");
        if (confirmDelete) {
            setLoading(prevLoading => ({...prevLoading, [rut_emprendedor]: true}))
            try {
                await deleteEmprendedor(rut_emprendedor);
                toast.success('Emprendedor eliminado correctamente')
            } catch (error) {
                console.error('Error al eliminar emprendedor');
                toast.error('Error al eliminar emprendedor');
            } finally {
                setLoading(prevLoading => ({ ...prevLoading, [rut_emprendedor]: false }))
            }
        }
    };

    const actualizarEmprendedor = (rut_emprendedor) => {
        navigate(`/actualizar-emprendedor/${rut_emprendedor}`);
    }


    if (!emprendedor) {
        return <p>  Cargando...</p>;
    }

    return (
        <div className='detalle-emprendedor'>
            <h2>Mis Datos Personales</h2>
            {emprendedor && (
            <>
                <p><strong>Nombre:</strong> {emprendedor.nombre_emprendedor}</p>
                <p><strong>Apellido Paterno:</strong> {emprendedor.apellido1_emprendedor}</p>
                <p><strong>Apellido Materno:</strong> {emprendedor.apellido2_emprendedor}</p>
                <p><strong>Dirección:</strong> {emprendedor.direccion}</p>
                <p><strong>Telefono:</strong> {emprendedor.telefono}</p>
                <p><strong>Correo Electrónico:</strong> {emprendedor.correo_electronico}</p>
                <p><strong>Tipo de Cuenta Bancaria:</strong> {emprendedor.tipo_de_cuenta}</p>
                <p><strong>Número de Cuenta Bancaria:</strong> {emprendedor.numero_de_cuenta}</p>
                <p><strong>Estado:</strong> {emprendedor.estado_emprendedor}</p>
                <div className='actions'>
                <button
                    className='actualizar'
                    onClick={() => actualizarEmprendedor(emprendedor.rut_emprendedor)}
                    disabled={loading}
                >
                    Actualizar Datos
                </button>
                <button
                    className='eliminar'
                    onClick={() => eliminarEmprendedor({ rut_emprendedor: emprendedor.rut_emprendedor })}
                    disabled={loading}
                >
                    Eliminar Cuenta
                </button>
                </div>
            </>
            )}
        </div>
    )
}

export default PerfilEmprendedor

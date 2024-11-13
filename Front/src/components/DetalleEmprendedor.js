import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmprendedor } from '../services/emprendedor';
import "../Styles/detalle-emprendedor.css";

const DetalleEmprendedor = () => {

    const { rut_emprendedor } = useParams(); 
    const [emprendedor, setEmprendedor] = useState(null);
    
    useEffect(() => {
        const fetchEmprendedor = async () => {
        try {
            const response = await getEmprendedor(rut_emprendedor); 
            setEmprendedor(response.data.emprendedor || {});
        } catch (error) {
            console.error("Error al obtener los detalles del emprendedor:", error);
            toast.error("Error al obtener los detalles del emprendedor")
        }
        };

        fetchEmprendedor();
    }, [rut_emprendedor]);

    const getGoogleDriveUrl = (fileId) => {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    };
    
    if (!emprendedor || Object.keys(emprendedor).length === 0) {
        return <p>  Cargando...</p>;
    }

    //console.log(emprendedor.imagen_productos)

    return (
        <div className='detalle-emprendedor'>
            <h2>Detalles del Emprendedor</h2>
            <p><strong>Nombre:</strong> {emprendedor.nombre_emprendedor}</p>
            <p><strong>Apellido Paterno:</strong> {emprendedor.apellido1_emprendedor}</p>
            <p><strong>Apellido Materno:</strong> {emprendedor.apellido2_emprendedor}</p>
            <p><strong>Dirección:</strong> {emprendedor.direccion}</p>
            <p><strong>Telefono:</strong> {emprendedor.telefono}</p>
            <p><strong>Correo Electrónico:</strong> {emprendedor.correo_electronico}</p>
            <p><strong>Tipo de Cuenta Bancaria:</strong> {emprendedor.tipo_de_cuenta}</p>
            <p><strong>Número de Cuenta Bancaria:</strong> {emprendedor.numero_de_cuenta}</p>
            <p><strong>Estado:</strong> {emprendedor.estado_emprendedor}</p>
            <h3 className='documentos-title'>Archivos Adjuntados</h3>

            <h3>Documentos Tributarios</h3>
            <div>
                {emprendedor.comprobante && (
                    <a href={emprendedor.comprobante} target="_blank" rel="noopener noreferrer">
                        Comprobante
                    </a>
                )}
            </div> 
                    
            <h3>Imágenes de sus Productos</h3>
            <div>
                {emprendedor.imagen_productos && (
                    <img 
                        src={emprendedor.imagen_productos} 
                        alt="Imagen de productos" 
                    />
                )}
            </div>

            <h3>Imágenes de su Local o Domicilio</h3>
            <div>
                {emprendedor.imagen_local && (
                    <img 
                        src={emprendedor.imagen_local} 
                        alt="Imagen del local"
                    />
                )}
            </div>

                 
        </div>
    )
    }

export default DetalleEmprendedor

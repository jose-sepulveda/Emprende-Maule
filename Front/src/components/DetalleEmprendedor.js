import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmprendedor } from '../services/emprendedor';
import "../Styles/detalle-emprendedor.css";

const DetalleEmprendedor = () => {

    const { rut_emprendedor } = useParams(); 
    const [emprendedor, setEmprendedor] = useState(null);
    const [archivos, setArchivos] = useState([]);
    
    useEffect(() => {
        const fetchEmprendedor = async () => {
        try {
            const response = await getEmprendedor(rut_emprendedor); 
            setEmprendedor(response.data.emprendedor);
            setArchivos(response.data.archivos || []); 
        } catch (error) {
            console.error("Error al obtener los detalles del emprendedor:", error);
            toast.error("Error al obtener los detalles del emprendedor")
        }
        };

        fetchEmprendedor();
    }, [rut_emprendedor]);

    if (!emprendedor) {
        return <p>Cargando...</p>;
    }

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
            {/*
            <h3>Documentos Adjuntados</h3>
            <ul>
                {archivos.length === 0 ? (
                    <p>No se han adjuntado archivos.</p>
                ) : (
                    archivos.map((file, index) => (
                        <li key={index}>
                            {file.mimeType.startsWith('image/') ? (
                                <div>
                                    <h4>{file.name}</h4>
                                    <img 
                                        src={file.webViewLink} 
                                        alt={file.name} 
                                        style={{ width: '200px', height: 'auto' }} 
                                    />
                                </div>
                            ) : (
                                <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">
                                    {file.name}
                                </a>
                            )}
                        </li>
                    ))
                )}
            </ul>

            <h3>Imágenes de sus Productos</h3>
            <div>
                {emprendedor.imagen_productos && (
                    <img src={emprendedor.imagen_productos} alt="Imagen de productos" style={{ width: '300px' }} />
                )}
            </div>

            <h3>Imágenes de su Local o Domicilio</h3>
            <div>
                {emprendedor.imagen_local && (
                    <img src={emprendedor.imagen_local} alt="Imagen del local" style={{ width: '300px' }} />
                )}
            </div>

            <h3>Comprobante</h3>
            <div>
                {emprendedor.comprobante && (
                    <a href={emprendedor.comprobante} target="_blank" rel="noopener noreferrer">
                        Ver Comprobante
                    </a>
                )}
            </div>  
            */ }        
        </div>
    )
    }

export default DetalleEmprendedor

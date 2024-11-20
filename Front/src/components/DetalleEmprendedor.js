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
            setEmprendedor(response.data || {});
            toast.success("Emprendedor obtenido correctamente")
        } catch (error) {
            console.error("Error al obtener los detalles del emprendedor:", error);
            toast.error("Error al obtener los detalles del emprendedor")
        }
        };

        fetchEmprendedor();
    }, [rut_emprendedor]);

    const generarUrl = (fileId) => {
        if (!fileId) {
            throw new Error('El ID de la imagen no puede estar vacío.');
        }
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      }

    const generarUrlPdf = (fileId) => {
        if (!fileId) {
            throw new Error('El ID del archivo no puede estar vacío.');
        }
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    if (!emprendedor) {
        return <p>  Cargando...</p>;
    }

    console.log(emprendedor.imagen_local)
    console.log(generarUrl(emprendedor.imagen_local))
    return (
        <div className='detalle-emprendedor'>
            <h2>Detalles del Emprendedor</h2>
            <p><strong>Nombre:</strong> {emprendedor.nombre_emprendedor}</p>
            <p><strong>Apellido Paterno:</strong> {emprendedor.apellido1_emprendedor}</p>
            <p><strong>Apellido Materno:</strong> {emprendedor.apellido2_emprendedor}</p>
            <p><strong>Rut:</strong> {emprendedor.rut_emprendedor}</p>
            <p><strong>Dirección:</strong> {emprendedor.direccion}</p>
            <p><strong>Telefono:</strong> {emprendedor.telefono}</p>
            <p><strong>Correo Electrónico:</strong> {emprendedor.correo_electronico}</p>
            <p><strong>Tipo de Cuenta Bancaria:</strong> {emprendedor.tipo_de_cuenta}</p>
            <p><strong>Número de Cuenta Bancaria:</strong> {emprendedor.numero_de_cuenta}</p>
            <p><strong>Estado:</strong> {emprendedor.estado_emprendedor}</p>                 
        </div>
    )
    }

export default DetalleEmprendedor

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmprendedor, updateEstadoEmprendedor } from '../services/emprendedor';
import "../Styles/detalle-solicitud.css";

const DetalleSolicitud = () => {

    const { rut_emprendedor } = useParams(); 
    const [emprendedor, setEmprendedor] = useState(null);
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()
    
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

    const handleUpdateEstado = async (nuevoEstado) => {
        if (!window.confirm(`¿Estas seguro de que desea dejar en estado de ${nuevoEstado.toLowerCase()} la solicitud?`)) return;

        setLoading(true)

        try {
            const estadoData = { rut_emprendedor, nuevoEstado}
            await updateEstadoEmprendedor(estadoData);
            toast.success(`El emprendedor ha sido ${nuevoEstado.toLowerCase()} exitosamente`);
            setEmprendedor((prev) => ({ ...prev, estado_emprendedor: nuevoEstado}));
            navigate("/solicitudes-registro")
        } catch (error) {
            console.error(`Error al actualizar a estado de ${nuevoEstado.toLowerCase()} al emprendedor`);
            toast.error(`Error al actualizar a estado de ${nuevoEstado.toLowerCase()} al emprendedor`)
        } finally {
            setLoading(false);
        }
    };

    const generarUrl = (fileId) => {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    const generarUrlPdf = (fileId) => {
        if (!fileId) {
            throw new Error('El ID del archivo no puede estar vacío.');
        }
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    if (!emprendedor || Object.keys(emprendedor).length === 0) {
        return <p>  Cargando...</p>;
    }

    return (
        <div className='detalle-solicitud'>
          <h2>Detalles de Solicitud de Registro</h2>
          {emprendedor && (
            <>
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
              <h3 className='documentos-title'>Archivos Adjuntados</h3>
              <h3>Documentos Tributarios</h3>
              <div>
                {emprendedor.comprobante && emprendedor.comprobante.length > 0 && (
                  Array.from(emprendedor.comprobante).map((file, index) => (
                  <a key={index} href={generarUrlPdf(emprendedor.comprobante)} target="_blank" rel="noopener noreferrer">
                    Comprobante
                  </a>
                  ))
                )}
              </div>
              <h3>Imágenes de sus Productos</h3>

              <div className='contenedor-imagen-productos-solicitud'>
                  {emprendedor.imagen_productos && emprendedor.imagen_productos.length > 0 && (
                      Array.from(emprendedor.imagen_productos).map((file, index) => (
                          <img 
                              key={index}
                              className='imagen-productos-solicitud'
                              src={generarUrl(file)}
                              alt={`Imagen de producto ${index + 1}`} 
                          />
                      ))
                  )}
              </div>
              <h3>Imágenes de su Local o Domicilio</h3>
              <div className='contenedor-imagen-local-solicitud'>
                  {emprendedor.imagen_local && emprendedor.imagen_local.length > 0 && (
                      Array.from(emprendedor.imagen_local).map((file, index) => (
                          <img 
                              key={index}
                              className='imagen-local-solicitud'
                              src={generarUrl(file)}
                              alt={`Imagen de local ${index + 1}`} 
                          />
                      ))
                  )}
              </div>
              <div className='actions'>
                <button
                  className='aprobar'
                  onClick={() => handleUpdateEstado("Aprobado")}
                  disabled={loading}
                >
                  {loading ? "Aprobando..." : "Aprobar Solicitud"}
                </button>
                <button
                  className='rechazar'
                  onClick={() => handleUpdateEstado("Rechazado")}
                  disabled={loading}
                >
                  {loading ? "Rechazando..." : "Rechazar Solicitud"}
                </button>
              </div>
            </>
          )}
        </div>
    )
    }

export default DetalleSolicitud
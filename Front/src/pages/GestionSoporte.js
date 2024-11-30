import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getContactos, updateEstadoSolicitud } from '../services/contacto';
import "../Styles/gestion-soporte.css";

const GestionSoporte = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [estadoSolicitud, setEstadoSolicitud] = useState("");
    const [pedidoId, setPedidoId] = useState(null);

    useEffect(() => {
        cargarSolicitudes();
      }, []);
    
      const cargarSolicitudes = async () => {
        try {
          const response = await getContactos();
          const sortedSolicitudes = response.data.sort((a, b) => a.id_contacto - b.id_contacto);
          setSolicitudes(sortedSolicitudes);
          toast.success("Solicitudes cargadas correctamente")
        } catch (error) {
          console.error('Error al encontrar las solicitudes:', error);
          toast.error('Error al cargar categorías');
        }
      };

      const handleModalOpen = (id_contacto) => {
        setPedidoId(id_contacto)
        setShowModal(true);
    }

    const handleUpdateEstado = async () => {
        if (estadoSolicitud && pedidoId) {
            
            try {
                setLoading(true);
                await updateEstadoSolicitud({id_contacto: pedidoId, nuevoEstado: estadoSolicitud });
                toast.success('Estado del pedido actualizado correctamente');
                setLoading(false);
                setShowModal(false);
                cargarSolicitudes();
            } catch (error) {
                console.error('Error al actualizar el estado del pedido', error);
                toast.error('Error al actualizar el estado del pedido');
                setLoading(false);
            }
        } else {
            toast.error('Por favor, selecciona un estado');
        }
    };

    const handleCancelar = async () => {
        setShowModal(false)
        cargarSolicitudes();
    }

    return (
        <div className='solicitudes-soporte'>
            <h1 className='titulo'>Solicitudes de Soporte</h1>
            {solicitudes && solicitudes.length > 0 ? (
                solicitudes.map((solicitud) => (
                    <div key={solicitud.id_contacto} className='solicitudes-soporte-container'>
                        <table className='tabla-solicitudes-soporte'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>{solicitud.id_contacto}</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className='subtitulo'>Nombre Usuario</td>
                                <td>{solicitud.nombre}</td>
                            </tr>
                            <tr>
                                <td className='subtitulo'>Correo Electrónico</td>
                                <td>{solicitud.correo}</td>
                            </tr>
                            <tr>
                                <td className='subtitulo'>Tipo de Problema</td>
                                <td>{solicitud.categoria_consulta}</td>
                            </tr>
                            <tr>
                                <td className='subtitulo'>Mensaje</td>
                                <td>{solicitud.mensaje}</td>
                            </tr>
                            <tr>
                                <td className='subtitulo'>Estado</td>
                                <td>{solicitud.estado}</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                <button
                                    className='actualizar-button'
                                    onClick={() => handleModalOpen(solicitud.id_contacto)}
                                >
                                    Actualizar Estado de la Solicitud
                                </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No hay soliciutdes pendientes</p>
            )}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Actualizar estado del pedido</h3>
                        <select 
                            id="estado_pedido" 
                            value={estadoSolicitud} 
                            onChange={(e) => setEstadoSolicitud(e.target.value)} 
                            required
                        >
                            <option value="">Seleccionar estado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Solucionado">Solucionado</option>
                         </select>
                        <button
                            className="enviar-button"
                            onClick={handleUpdateEstado}
                            disabled={loading}
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Estado'}
                        </button>
                        <button
                            className="cancelar-button"
                            onClick={handleCancelar}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GestionSoporte

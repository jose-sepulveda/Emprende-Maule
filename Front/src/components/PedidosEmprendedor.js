import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { getPedidoByEmprendedor, updateEstadoPedido } from '../services/pedidos';
import "../Styles/pedidos-emprendedor.css";

const PedidosEmprendedor = () => {
    const [pedidos, setPedidos] = useState([]);
    const [ loading, setLoading ] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [estadoPedido, setEstadoPedido] = useState("");
    const [pedidoId, setPedidoId] = useState(null);
    const { auth } = useContext(AuthContext) 

    const cargarPedidos = useCallback(async () => {
        if (!auth?.id) {
            return;
        }
        try {
            const response = await getPedidoByEmprendedor(auth.id);
            setPedidos(response.data);
            toast.success("Pedidos cargados correctamente")
        } catch (error) {
            console.error('Error al cargar los pedidos', error);
            toast.error('Error al cargar los pedidos');
        }
    }, [auth.id]);

    useEffect(() => {
        cargarPedidos();
    }, [cargarPedidos]);

    const generarUrl = (fileId) => {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    const handleModalOpen = (id_pedido) => {
        setPedidoId(id_pedido);
        setShowModal(true);
    }

    const handleUpdateEstado = async () => {
        if (estadoPedido && pedidoId) {
            try {
                setLoading(true);
                await updateEstadoPedido(pedidoId, { estado_pedido: estadoPedido });
                toast.success('Estado del pedido actualizado correctamente');
                setLoading(false);
                setShowModal(false);
                cargarPedidos();
            } catch (error) {
                console.error('Error al actualizar el estado del pedido', error);
                toast.error('Error al actualizar el estado del pedido');
                setLoading(false);
            }
        } else {
            toast.error('Por favor, selecciona un estado');
        }
        console.log(estadoPedido)
    };

    const handleCancelar = async () => {
        setShowModal(false)
        cargarPedidos();
    }

    return (
        <div className='pedidos-emprendedor'>
            <h1 className='titulo'>Solicitudes de Pedidos</h1>
            {pedidos && pedidos.length > 0 ? (
                pedidos.map((pedido) => (
                    <div key={pedido.id_pedido} className='pedido-emprendedor-container'> 
                    <table className='tabla-pedidos-emprendedor'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{pedido.id_pedido}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Estado</td>
                                <td>{pedido.estado_pedido}</td>
                            </tr>
                            <tr className='subtitulo'>
                                <td>Producto</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>{pedido.producto.nombre_producto}</td>
                            </tr>
                            <tr>
                                <td>Descripcion</td>
                                <td>{pedido.producto.descripcion_producto}</td>
                            </tr>
                            <tr>
                                <td>Precio</td>
                                <td>{pedido.producto.precio_producto}</td>
                            </tr>
                            <tr>
                                <td>Decuentos</td>
                                <td>{pedido.producto.precio_descuento}</td>
                            </tr>
                            <tr>
                                <td>Imagén</td>
                                <td><img alt='' src={generarUrl(pedido.producto.imagen)}/></td>
                            </tr>
                            <tr className='subtitulo'>
                                <td>Cliente</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>{pedido.cliente.nombre_cliente} {pedido.cliente.apellido1_cliente} {pedido.cliente.apellido2_cliente}</td>
                            </tr>
                            <tr>
                                <td>Dirección</td>
                                <td>{pedido.cliente.direccion}</td>
                            </tr>
                            <tr>
                                <td>Telefono</td>
                                <td>{pedido.cliente.telefono}</td>
                            </tr>
                            <tr>
                                <td>Correo Electrónico</td>
                                <td>{pedido.cliente.correo}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                <button
                                    className='actualiza-estado'
                                    onClick={() => handleModalOpen(pedido.id_pedido)}
                                >
                                    Actualizar Estado del Pedido
                                </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>  
                </div>
                ))
            ) : (
                <p>Na tienes pedidos registrados</p>
            )}

            {showModal && (
                <div className="login-emprendedor-modal">
                    <div className="login-emprendedor-modal-content">
                        <h3>Actualizar estado del pedido</h3>
                        <select 
                            id="estado_pedido" 
                            value={estadoPedido} 
                            onChange={(e) => setEstadoPedido(e.target.value)} 
                            required
                        >
                            <option value="">Seleccionar estado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                         </select>
                        <button
                            className="login-emprendedor-enviar-button"
                            onClick={handleUpdateEstado}
                            disabled={loading}
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Estado'}
                        </button>
                        <button
                            className="login-emprendedor-cancelar-button"
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

export default PedidosEmprendedor

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getPedido, getPedidos } from '../services/pedidos';
import "../Styles/gestion-pedidos.css";

const GestionPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const response = await getPedidos();
            const sortedPedidos = response.data.sort((a,b) => a.id_pedido - b.id_pedido);
            
            const detallePedido = await Promise.all(
                sortedPedidos.map(async (pedido) => {
                    const detalleResponse = await getPedido(pedido.id_cliente);
                    const { id_pedido, ...detalle} = detalleResponse.data
                    return { ...pedido, ...detalle }
                })
            )
            setPedidos(detallePedido);
        } catch (error) {
            console.error('Error al cargar los pedidos', error);
            toast.error('Error al cargar los pedidos')
        }
    }


    return (
        <div className='gestion-pedidos'>
            <h1 className='titulo'>Lista de Pedidos</h1>
            {pedidos.map((pedido) => (
                <div key={pedido.id_pedido} className='pedido-container'> 
                    <table className='tabla-pedido'>
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
                            <tr className='subtitulo'>
                                <td>Emprendedor</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>{pedido.emprendedor.nombre_emprendedor} {pedido.emprendedor.apellido1_emprendedor} {pedido.emprendedor.apellido2_emprendedor}</td>
                            </tr>
                            <tr>
                                <td>Dirección</td>
                                <td>{pedido.emprendedor.direccion}</td>
                            </tr>
                            <tr>
                                <td>Telefono</td>
                                <td>{pedido.emprendedor.telefono}</td>
                            </tr>
                            <tr>
                                <td>Correo Electrónico</td>
                                <td>{pedido.emprendedor.correo_electronico}</td>
                            </tr>
                            <tr className='subtitulo'>
                                <td>Productos</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Nombre</td>
                                <td>{pedido.producto.nombre_producto}</td>
                            </tr>
                        </tbody>
                    </table>  
                </div>
            ))}
            
        </div>
    )
    }

export default GestionPedidos

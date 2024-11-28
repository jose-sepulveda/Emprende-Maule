import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { getPedidoByEmprendedor } from '../services/pedidos';
import "../Styles/pedidos-emprendedor.css";

const PedidosEmprendedor = () => {
    const [pedidos, setPedidos] = useState([]);
    const { auth } = useContext(AuthContext) 

    useEffect(() => {
        const cargarPedidos = async () => {
            if (!auth?.id) {
                return;
            }
            try {
                const response = await getPedidoByEmprendedor(auth.id);
                setPedidos(response.data);   
            } catch (error) {
                console.error('Error al cargar los pedidos', error);
                toast.error('Error al cargar los pedidos')
            }
        }

        cargarPedidos();
    }, [auth.id]);

    const generarUrl = (fileId) => {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
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
                                <td>Productos</td>
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
                        </tbody>
                    </table>  
                </div>
                ))
            ) : (
                <p>Na tienes pedidos registrados</p>
            )}
            
        </div>
    )
}

export default PedidosEmprendedor

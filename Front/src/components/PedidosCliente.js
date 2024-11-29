import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { getPedidoByCliente } from '../services/pedidos';
import "../Styles/pedidos-cliente.css";

const PedidosCliente = () => {
    const [pedidos, setPedidos] = useState([]);
    const { auth } = useContext(AuthContext) 

    useEffect(() => {
        const cargarPedidos = async () => {
            if (!auth?.id) {
                return;
            }
            try {
                const response = await getPedidoByCliente(auth.id);
                const listPedidos = response.data.sort ((a,b) => a.id_pedido - b.id_pedido)
                setPedidos(listPedidos);   
                toast.success("Pedidos cargados correctamente")
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
        <div className='pedidos-cliente'>
            <h1 className='titulo'>Mis Pedidos</h1>
            {pedidos && pedidos.length > 0 ? (
                pedidos.map((pedido) => (
                    <div key={pedido.id_pedido} className='pedido-cliente-container'> 
                    <table className='tabla-pedidos-cliente'>
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
                                <td>Detalle de compra</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Fecha de la Venta</td>
                                <td>{new Date(pedido.venta.fecha_venta).toLocaleDateString('es-CL')}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>{pedido.venta.total}</td>
                            </tr>
                            <tr>
                                <td>Metodo de pago</td>
                                <td>{pedido.venta.metodo_de_pago}</td>
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
                                <td>Descripción</td>
                                <td>{pedido.producto.descripcion_producto}</td>
                            </tr>
                            <tr>
                                <td>Precio</td>
                                <td>${pedido.producto.precio_producto}</td>
                            </tr>
                            <tr>
                                <td>Imagen</td>
                                <td>
                                    <img alt='' src={generarUrl(pedido.producto.imagen)}/>
                                </td>
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

export default PedidosCliente

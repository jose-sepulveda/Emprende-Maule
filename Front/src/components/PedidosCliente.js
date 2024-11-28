import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { getPedidoByCliente } from '../services/pedidos';

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
                setPedidos(response.data);   
            } catch (error) {
                console.error('Error al cargar los pedidos', error);
                toast.error('Error al cargar los pedidos')
            }
        }

        cargarPedidos();
    }, [auth.id]);

    return (
        <div className='gestion-pedidos'>
            <h1 className='titulo'>Lista de Pedidos</h1>
            {pedidos && pedidos.length > 0 ? (
                pedidos.map((pedido) => (
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
                                <td>Detalle de compra</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Fecha de la Venta</td>
                                <td>{new Date(pedido.venta.fecha_venta).toLocaleDateString('es-CL')}</td>
                            </tr>
                            <tr>
                                <td>Subtotal</td>
                                <td>{pedido.venta.subtotal}</td>
                            </tr>
                            <tr>
                                <td>Decuentos</td>
                                <td>{pedido.venta.descuentos}</td>
                            </tr>
                            <tr>
                                <td>IVA</td>
                                <td>{pedido.venta.iva}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>{pedido.venta.total}</td>
                            </tr>
                            <tr>
                                <td>Metodo de pago</td>
                                <td>{pedido.venta.metodo_de_pago}</td>
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

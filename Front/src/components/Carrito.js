import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteCarroProductos, getCarrosProductos, updateCarroProductos } from '../services/carrito_producto';
import { createWebpayTransaction } from '../services/ventas';
import "../Styles/carrito.css";
import { updateCliente } from '../services/crearCliente';

const Carrito = () => {
    const [carrosProductos, setCarrosProductos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editCantidad, setEditCantidad] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        cargarCarroProductos();
    }, []);

    const cargarCarroProductos = async () => {
        try {
            const id_cliente = localStorage.getItem('id');
            if (id_cliente) {
                const response = await getCarrosProductos(id_cliente);
                setCarrosProductos(response.data);
                toast.success('Productos del carrito obtenidos correctamente');
            } else {
                const carroLocal = JSON.parse(localStorage.getItem('carritoLocal')) || [];
                setCarrosProductos(carroLocal);
                toast.success('Carro cargado correctamente');
            }
        } catch (error) {
            console.error('Error obteniendo los productos del carro: ', error);
            toast.error('Error obteniendo los productos del carro');
        }
    };

    const calcularPrecioConDescuento = (precio, descuento) => {
        if (!precio || typeof descuento === 'undefined') return precio || 0;
        return descuento > 0 ? precio - (precio * descuento) / 100 : precio;
    };

    const setSubtotal = () => {
        return carrosProductos.reduce((subtotal, item) => {
            const precio = item.producto.precio_producto;
            const cantidad = item.cantidad;
            return subtotal + precio * cantidad;
        }, 0);
    };

    const setTotal = () => {
        return carrosProductos.reduce((total, item) => {
            const producto = item.producto;
            const precio = producto?.precio_producto || 0;
            const descuento = producto?.descuento || 0;

            const precioConDescuento = calcularPrecioConDescuento(precio, descuento);
            return total + precioConDescuento * (item.cantidad || 1);
        }, 0);
    };

    const setDescuento = () => {
        const subtotalSinDescuento = carrosProductos.reduce(
            (subtotal, item) => subtotal + item.producto.precio_producto * item.cantidad,
            0
        );
        const totalConDescuento = setTotal();
        return subtotalSinDescuento - totalConDescuento;
    };

    const setDescuentoPorcentaje = () => {
        const totalSinDescuento = setSubtotal();
        const totalConDescuento = setTotal();
        const descuentoTotal = totalSinDescuento - totalConDescuento;
        const porcentajeDescuento = (descuentoTotal / totalSinDescuento) * 100;
        return porcentajeDescuento.toFixed(2); 
    };

    const setIva = () => {
        const totalConDescuento = setTotal();
        const iva = totalConDescuento * 0.19; 
        return iva;
    };

    const handleContinueShoping = () => {
        navigate('/');
    };

    const handleDeleteProducto = async (idCarroProducto) => {
        try {
            const idCliente = localStorage.getItem('id');
            if (idCliente) {
                await deleteCarroProductos(idCarroProducto);
                await cargarCarroProductos();
                toast.success('Producto eliminado del carrito correctamente');
            } else {
                const carroLocal = carrosProductos.filter(
                    (item) => item.id_carro_productos !== idCarroProducto
                );
                localStorage.setItem('carroLocal', JSON.stringify(carroLocal));
                setCarrosProductos(carroLocal);
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            toast.error('Error al eliminar el producto del carrito');
        }
    };

    const handleEditProducto = async (index, cantidad) => {
        setEditIndex(index);
        setEditCantidad(cantidad);
    };

    const handleUpdateProducto = async (carroProductos) => {
        try {
            const idCliente = localStorage.getItem('id');

            if (idCliente) {
                const datosActualizados = {
                    cantidad: editCantidad,
                    subtotal: carroProductos.producto.precio_producto * editCantidad,
                };

                await updateCarroProductos(carroProductos.id_carro_productos, datosActualizados);

                setEditIndex(null);
                await cargarCarroProductos();
            } else {
                const carritoLocal = carrosProductos.map((item) =>
                    item.id_carro_productos === carroProductos.id_carro_productos
                        ? {
                            ...item,
                            cantidad: editCantidad,
                            subtotal: item.producto.precio_producto * editCantidad,
                        }
                        : item
                );

                localStorage.setItem('carritoLocal', JSON.stringify(carritoLocal));
                setCarrosProductos(carritoLocal);
                setEditIndex(null);
            }
        } catch (error) {
            console.error('Error al actualizar el producto del carrito:', error);
            toast.error('Ocurrió un error al actualizar el producto.');
        }
    };

    const handlePlaceOrder = async () => {
        try {
            const idCliente = localStorage.getItem('id');
            await updateCliente(idCliente, {estado_De_venta: true})
            const amount = setTotal() + setIva(); 
            const sessionId = idCliente;
            const buyOrder = 'orden' + new Date().getTime();
            const returnUrl = 'http://localhost:3000/api/webpay/commit';

            const { url, token_ws } = await createWebpayTransaction(amount, sessionId, buyOrder, returnUrl);

            window.location.href = `${url}?token_ws=${token_ws}`;
        } catch (error) {
            console.error('Error al crear la transacción', error);
            toast.error('Error al realizar el pago');
        }
    };

    return (
        <div className="carrito-container">
            <h2>Carrito de Compra</h2>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Descuento</th>
                        <th>Precio con Descuento</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {carrosProductos.map((carroProductos, index) => {
                        const precio = carroProductos.producto.precio_producto;
                        const descuento = carroProductos.producto.descuento || 0;
                        const precioConDescuento = calcularPrecioConDescuento(precio, descuento);
                        const descuentoAplicado = precio - precioConDescuento;
                        const descuentoPorcentaje = descuentoAplicado / precio * 100;
                        return (
                            <tr key={carroProductos.id_carro_productos}>
                                <td>{carroProductos.producto.nombre_producto}</td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editCantidad}
                                            onChange={(e) => setEditCantidad(Number(e.target.value))}
                                            min="1"
                                        />
                                    ) : (
                                        carroProductos.cantidad
                                    )}
                                </td>
                                <td>${precio}</td>
                                <td>{descuentoPorcentaje}%</td> 
                                <td>${precioConDescuento}</td> 
                                <td>
                                    {editIndex === index ? (
                                        <button onClick={() => handleUpdateProducto(carroProductos)}>Guardar</button>
                                    ) : (
                                        <button className="save-button" onClick={() => handleEditProducto(index, carroProductos.cantidad)}>Editar</button>
                                    )}
                                    <button className="delete-button" onClick={() => handleDeleteProducto(carroProductos.id_carro_productos)}>Eliminar</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="total">
                <p>Subtotal: ${setSubtotal()}</p>
                <p>-</p>
                <p>Descuento: ${setDescuento()}</p>
                <p>+</p>
                <p>IVA (19%): ${setIva()}</p>
                <p>=</p>
                <p><strong>Total a Pagar: ${setTotal() + setIva()}</strong></p> 
            </div>
            <div className="buttons">
                <button className="continue-shopping" onClick={handleContinueShoping}>Continuar Comprando</button>
                <button className="place-order" onClick={handlePlaceOrder}>Solicitar Pedido</button>
            </div>
        </div>
    );
};

export default Carrito;

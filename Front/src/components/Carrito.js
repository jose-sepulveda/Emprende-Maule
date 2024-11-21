import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteCarroProductos, getCarrosProductos, updateCarroProductos } from '../services/carrito_producto';
import "../Styles/carrito.css";

const Carrito = () => {
    const [ carrosProductos, setCarros_productos ] = useState([]);
    const [ editIndex, setEditIndex] = useState(null);
    const [ editCantidad, setEditCantidad ] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        cargarCarroProductos();
    }, []);

    const cargarCarroProductos = async () => {
        try {
            const id_cliente = localStorage.getItem('id');
            if (id_cliente) {
                const response = await getCarrosProductos(id_cliente);
                setCarros_productos(response.data)
                toast.success('Productos del carrito obtenidos correctamente');
            } else {
                const carroLocal = JSON.parse(localStorage.getItem('carritoLocal')) || [];
                console.log(carroLocal)
                setCarros_productos(carroLocal)
                toast.success('Carro cargado correctamente')
            }
        } catch (error) {
            console.error('Error obteniendo los productos del carro: ', error);
            toast.error('Error obteniendo los productos del carro');
        }
    }

    const setTotal = () => {
        return carrosProductos.reduce((total, item) => total + item.subtotal, 0);
    };

    const handleContinueShoping = () => {
        navigate('/')
    }

    const handleDeleteProducto = async (idCarroProducto) => {
        try {
            const idCliente = localStorage.getItem('id');
            if (idCliente) {
                await deleteCarroProductos(idCarroProducto);
                cargarCarroProductos();
                toast.success('Producto eliminado del carrito correctamente')
            } else {
                const carroLocal = carrosProductos.filter(item => item.id_carro_productos !== idCarroProducto);
                localStorage.setItem('carroLocal', JSON.stringify(carroLocal));
                setCarros_productos(carroLocal);
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            toast.success('Error al eliminar el producto del carrito')
        }
    }

    const handleEditProducto = async (index, cantidad) => {
        setEditIndex(index);
        setEditCantidad(cantidad);
    }

    const handleUpdateProducto = async (carroProductos) => {
        try {
            const idCliente = localStorage.getItem("id");
    
            if (idCliente) {
                const datosActualizados = {
                    cantidad: editCantidad,
                    subtotal: carroProductos.producto.precio_producto * editCantidad,
                }

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
    
                localStorage.setItem("carritoLocal", JSON.stringify(carritoLocal));
                setCarros_productos(carritoLocal); 
                setEditIndex(null);
            }
        } catch (error) {
            console.error("Error al actualizar el producto del carrito:", error);
            toast.error("Ocurrió un error al actualizar el producto.");
        }
    };
    

    const handlePlaceOrder = async () => {
        /*try {
            const idCliente = localStorage.getItem('id);
            await updateCliente(idCliente, { estado_pago: true })
            const amount = setTotal();
            const sessionId = idCliente; 
            const buyOrder = 'orden' + new Date().getTime(); 
            const returnUrl = 'http://localhost:3000/api/webpay_plus/commit'; 
        
            const { url, token_ws } = await createTransaction(amount, sessionId, buyOrder, returnUrl);
        
            window.location.href = `${url}?token_ws=${token_ws}`;
        } catch (error) {
            console.error('Error al crear la transacción', error);
        }*/
       toast.success('Venta por implementar')
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
                <th>Acción</th>
            </tr>
            </thead>
            <tbody>
            {carrosProductos.map((carroProductos, index) => (
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
                <td>${carroProductos.producto.precio_producto}</td>
                <td>
                    {editIndex === index ? (
                    <button onClick={() => handleUpdateProducto(carroProductos)}>Guardar</button>
                    ) : (
                    <button className='save-button' onClick={() => handleEditProducto(index, carroProductos.cantidad)}>Editar</button>
                    )}
                    <button className="delete-button" onClick={() => handleDeleteProducto(carroProductos.id_carro_productos)}>Eliminar</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        <div className="total">
            <span>Total a Pagar: ${setTotal()}</span>
        </div>
        <div className="buttons">
            <button className="continue-shopping" onClick={handleContinueShoping}>Continuar Comprando</button>
            <button className="place-order" onClick={handlePlaceOrder}>Solicitar Pedido</button>
        </div>
        </div>
    )
}

export default Carrito

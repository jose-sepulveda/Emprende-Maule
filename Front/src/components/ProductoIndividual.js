import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { newCarro } from '../services/carrito';
import { getProductos } from '../services/producto';
import '../Styles/productoIndividual.css';

const ProductoIndividual = () => {
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); 
    const [cantidad, setCantidad] = useState(1); 
    const [stockDisponible, setStockDisponible] = useState(0);

    useEffect(() => {
        cargarProducto(id);
    }, [id]);

    const cargarProducto = (id) => {
        setLoading(true);
        getProductos()
            .then((data) => {
                // encuentra el producto por el id en los datos obtenidos
                const productoEncontrado = data.find(producto => producto.cod_producto.toString() === id);
                if (productoEncontrado) {
                    setProducto(productoEncontrado);
                } else {
                    setError('Producto no encontrado');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Error al cargar el producto');
                setLoading(false);
            });
    };

    const addToCart = async () => {
        try {
          const idUsuario = localStorage.getItem('idUser');
    
          if (cantidad <= 0 || cantidad > stockDisponible) {
            throw new Error('Cantidad inválida. Por favor, selecciona una cantidad válida.');
          }
    
          if (idUsuario) {
            const carro = {
              id_usuario: idUsuario,
              cantidad: cantidad,
              cod_producto: producto.cod_producto,
            };
    
            await newCarro(carro);
    
            setStockDisponible(stockDisponible - cantidad);
    
            toast.success(`Producto ${producto.nombre_producto} agregado al carrito`);
            
            setCantidad(1);
          } else {
            let carritoLocal = JSON.parse(localStorage.getItem('carritoLocal')) || [];
            const productoEnCarrito = carritoLocal.find(item => item.cod_producto === producto.cod_producto);
    
            if (productoEnCarrito) {
              productoEnCarrito.cantidad += cantidad;
              productoEnCarrito.subtotal += producto.precio_producto * cantidad;
            } else {
              carritoLocal.push({
                id_carro_productos: new Date().getTime(), // ID temporal
                producto: {
                  nombre_producto: producto.nombre_producto,
                  precio_producto: producto.precio_producto
                },
                cantidad: cantidad,
                subtotal: producto.precio_producto * cantidad,
                cod_producto: producto.cod_producto
              });
            }
    
            localStorage.setItem('carritoLocal', JSON.stringify(carritoLocal));
            setStockDisponible(stockDisponible - cantidad);
    
            toast.success(`Producto ${producto.nombre_producto} agregado al carrito`);
    
            setCantidad(1);
          }
    
        } catch (error) {
          console.error('Error al agregar el producto al carrito:', error);
          toast.error(error.message || 'Error al agregar el producto al carrito', {
            closeButton: false,
          });
        }
      };

    if (loading) {
        return <p>Cargando detalles del producto...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="producto-individual">
            {producto && (
                <div className="producto-detalle">
                    <div className="producto-imageen">
                        {producto.imagen && (
                            <img 
                                src={`https://drive.google.com/thumbnail?id=${producto.imagen}&sz=w400`} 
                                alt={producto.nombre_producto}
                                className="imagen-producto"
                            />
                        )}
                    </div>
                    <div className='detalle'>
                        <h2>{producto.nombre_producto}</h2>
                        <div className="campo">
                            <strong>Vendido por</strong>
                            <p>{producto.nombre_emprendedor} {producto.apellido1_emprendedor} {producto.apellido2_emprendedor}</p>
                        </div>
                        <div className="campo">
                            <strong>Descripción:</strong>
                            <p>{producto.descripcion_producto}</p>
                        </div>
                        <div className="campo">
                            <strong>Precio:</strong>
                            <p>${producto.precio_producto}</p>
                        </div>
                        <button className="btn-agregar-carrito" onClick={addToCart}>
                            Añadir al carrito
                        </button>


                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductoIndividual;

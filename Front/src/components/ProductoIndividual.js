import React, { useContext, useEffect, useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { newCarro } from '../services/carrito';
import { getProductos } from '../services/producto';
import { actualizarResena, consultarResenaProducto, crearResena, eliminarResena } from '../services/resena';
import '../Styles/productoIndividual.css';

const ProductoIndividual = () => {
    const [producto, setProducto] = useState(null);
    const [reseñas, setReseñas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calificacion, setCalificacion] = useState(1);
    const [comentario, setComentario] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [editandoResena, setEditandoResena] = useState(null);
    const [cantidad, setCantidad] = useState(1); 
    const [stockDisponible, setStockDisponible] = useState(0);

    const { id } = useParams(); 
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        cargarProducto(id);
        cargarReseñas(id);
    }, [id]);

    const cargarProducto = (id) => {
        setLoading(true);
        getProductos()
            .then((data) => {
                const productoEncontrado = data.find(producto => producto.cod_producto.toString() === id);
                if (productoEncontrado) {
                    setProducto(productoEncontrado);
                    setStockDisponible(productoEncontrado.stock);
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

    const cargarReseñas = (id) => {
        consultarResenaProducto(id)
            .then((data) => {
                setReseñas(data);
            })
            .catch(() => {
                setError('Error al cargar las reseñas');
            });
    };

    const CondicionIngresoResena = async (e) => {
        e.preventDefault();

        if (!auth?.id || auth?.role !== 'cliente') {
            setMensaje('Debes iniciar sesión como cliente para crear una reseña.');
            return;
        }

        const nuevaResena = {
            calificación: calificacion,
            resena: comentario,
            id_cliente: parseInt(auth.id),
            cod_producto: parseInt(id)
        };

        try {
            await crearResena(nuevaResena);
            setMensaje('Reseña creada con éxito.');
            setCalificacion(1);
            setComentario('');
            cargarReseñas(id);
        } catch (error) {
            setMensaje(`Error al crear la reseña: ${error.message}`);
        }
    };

    const calificacionEstrellita = (rating) => {
        setCalificacion(rating);
    };

    const ActualizarResenaExistente = async () => {
        if (editandoResena) {
            const nuevaResena = {
                calificación: calificacion,
                resena: comentario,
            };

            try {
                await actualizarResena(editandoResena.id_resena, nuevaResena);
                setMensaje('Reseña actualizada con éxito.');
                setEditandoResena(null); 
                cargarReseñas(id); 
            } catch (error) {
                setMensaje(`Error al actualizar la reseña: ${error.message}`);
            }
        }
    };

    const EliminarResenaExistente = (idResena) => {
        eliminarResena(idResena)
            .then(() => {
                cargarReseñas(id);
            })
            .catch((error) => {
                setMensaje(`Error al eliminar la reseña: ${error.message}`);
            });
    };

    const activarEdicion = (resena) => {
        setEditandoResena(resena);
        setComentario(resena.resena); 
        setCalificacion(resena.calificación); 
    };

    const addToCart = async () => {
        try {
          const id_cliente = localStorage.getItem('id');
    
          if (cantidad <= 0 || cantidad > stockDisponible) {
            throw new Error('Cantidad inválida. Por favor, selecciona una cantidad válida.');
          }
    
          if (id_cliente) {
            const carro = {
              id_cliente: id_cliente,
              cantidad: cantidad,
              cod_producto: producto.cod_producto,
            };
    
            await newCarro(carro);
    
            setStockDisponible(stockDisponible - cantidad);
            
            setCantidad(1);

            toast.success(`Producto ${producto.nombre_producto} agregado al carrito`);
          } else {
            let carritoLocal = JSON.parse(localStorage.getItem('carritoLocal')) || [];
            const productoEnCarrito = carritoLocal.find(item => item.cod_producto === producto.cod_producto);
    
            if (productoEnCarrito) {
              productoEnCarrito.cantidad += cantidad;
              productoEnCarrito.subtotal += producto.precio_producto * cantidad;
            } else {
              carritoLocal.push({
                id_carro_productos: new Date().getTime(),
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
                        {producto.precio_descuento && (
                                        <div className="descuento-circulo-p">
                                            -{producto.descuento}%
                                        </div>
                                    )}
                    </div>
                    <div className="detalle">
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
                                    {producto.precio_descuento ? (
                                        <p>
                                            <del>${producto.precio_producto}</del> 
                                            <span className="precio-descuento"></span>
                                        </p>
                                    ) : (
                                        <p>${producto.precio_producto}</p>
                                    )}
                                </div>
                        {producto.precio_descuento && (
                           <div className="campo">
                                <strong>Precio con descuento:</strong>
                                <p>${producto.precio_descuento}</p>
                            </div>
                        )}
                        <div className="campo">
                            <strong>Cantidad:</strong>
                            <input type="number" min="1"
                                max={producto.cantidad_disponible}
                                value={cantidad}
                                onChange={(e) => {
                                    const valor = parseInt(e.target.value, 10);
                                    if (valor > 0 && valor <= producto.cantidad_disponible) {
                                        setCantidad(valor);
                                    } else if (valor > producto.cantidad_disponible) {
                                        toast.warn('No puedes seleccionar más productos que el stock disponible.');
                                    } else {
                                        setCantidad(1);
                                    }
                                }}
                            />
                            <p>Stock disponible: {producto.cantidad_disponible}</p>
                        </div>
                        {auth?.role !== 'admin' && auth?.role !== 'emprendedor' && (
                            <button className="btn-agregar-carrito" onClick={addToCart}>
                                Añadir al carrito
                            </button>)}

                        <div className="linea-separadora"></div>

                        <div className="formulario-resena">
                            <form onSubmit={CondicionIngresoResena}>
                                <div className="campo">
                                    <label>Calificación:</label>
                                    <div className="calificacion-estrellas">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span 
                                                key={star}
                                                onClick={() => calificacionEstrellita(star)} 
                                                className={calificacion >= star ? 'estrella seleccionada' : 'estrella'}
                                            >
                                                {calificacion >= star ? <FaStar /> : <FaRegStar />}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="campo">
                                    <label htmlFor="comentario">Comentario:</label>
                                    <textarea 
                                        id="comentario" 
                                        value={comentario} 
                                        onChange={(e) => setComentario(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn-crear-resena"> Enviar Reseña </button>
                                </div>
                            </form>
                            {mensaje && <p className="mensaje-resena">{mensaje}</p>}
                        </div>
                    </div>
                </div>
            )}

            <div className="linea-separadora-tabla"></div>

            <div className="reseñas">
                <h2>Reseñas del Producto</h2>
                {reseñas.length > 0 ? (
                    <table className="tabla-reseñas">
                        <thead>
                            <tr>
                                <th>Comentario</th>
                                <th>Calificación</th>
                                {auth?.id && auth?.role === 'cliente' && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {reseñas.map((resena) => (
                                <tr key={resena.id_resena}>
                                    <td>
                                        {editandoResena?.id_resena === resena.id_resena ? (
                                            <textarea 
                                                value={comentario} 
                                                onChange={(e) => setComentario(e.target.value)} 
                                                required
                                            />
                                        ) : (
                                            resena.resena
                                        )}
                                    </td>
                                    <td>
                                        {editandoResena?.id_resena === resena.id_resena ? (
                                            <div className="calificacion-estrellas">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span 
                                                        key={star}
                                                        onClick={() => setCalificacion(star)} 
                                                        className={calificacion >= star ? 'estrella seleccionada' : 'estrella'}
                                                    >
                                                        {calificacion >= star ? <FaStar /> : <FaRegStar />}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            [1, 2, 3, 4, 5].map(star => (
                                                <span span key={star} className={resena.calificación >= star ? 'estrella seleccionada' : 'estrella'}>
                                                    {resena.calificación >= star ? <FaStar /> : <FaRegStar />}
                                                </span>
                                            ))
                                        )}
                                    </td>
                                    {auth?.id === resena.id_cliente && (
                                        <td>
                                            {editandoResena?.id_resena === resena.id_resena ? (
                                                <>
                                                    <button onClick={ActualizarResenaExistente}>Guardar</button>
                                                    <button onClick={() => setEditandoResena(null)}>Cancelar</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => activarEdicion(resena)}>Editar</button>
                                                    <button onClick={() => EliminarResenaExistente(resena.id_resena)}>Eliminar</button>
                                                </>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay reseñas para este producto.</p>
                )}
            </div>
        </div>
    );
};

export default ProductoIndividual;

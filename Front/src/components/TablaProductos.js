import React, { useState, useEffect, useContext } from 'react';
import { obtenerProductosPorEmprendedor, eliminarProducto } from '../services/producto';
import { AuthContext } from '../Auth/AuthContext';
import '../Styles/tablaProductos.css';

const TablaProductos = () => {
    const { auth } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth?.id) {
            setLoading(true);
            obtenerProductosPorEmprendedor(auth.id)
                .then((data) => {
                    setProductos(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Error al cargar los productos.');
                    setLoading(false);
                });
        }
    }, [auth]);

    const generarUrlImagen = (fileId) => {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
    };

    const handleEliminar = async (cod_producto) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await eliminarProducto(cod_producto);
                obtenerProductosPorEmprendedor(auth.id)
                    .then((data) => {
                        setProductos(data);
                    });
                alert('Producto eliminado exitosamente.');
            } catch (error) {
                alert('Error al eliminar el producto.');
            }
        }
    };

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='tabla-productos-container'>
            <h2>Mis Productos</h2>
            {productos.length === 0 ? (
                <p>No tienes productos creados.</p>
            ) : (
                <table className="tabla-productos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Descuento</th>
                            <th>Categoría</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.cod_producto}>
                                <td>{producto.nombre_producto}</td>
                                <td>{producto.descripcion_producto}</td>
                                <td>{producto.cantidad_disponible}</td>
                                <td>{`$${producto.precio_producto}`}</td>
                                <td></td>
                                <td>{producto.categoria?.nombre_categoria || 'Sin categoría'}</td>
                                <td>
                                    {producto.imagen ? (
                                        <img
                                            src={generarUrlImagen(producto.imagen)}
                                            alt={producto.nombre_producto}
                                            className="imagen-producto"
                                        />
                                    ) : (
                                        'Sin imagen'
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleEliminar(producto.cod_producto)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TablaProductos;

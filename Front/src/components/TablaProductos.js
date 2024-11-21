import React, { useState, useEffect, useContext } from 'react';
import {obtenerProductosPorEmprendedor, eliminarProducto, actualizarProducto} from '../services/producto';
import { AuthContext } from '../Auth/AuthContext';
import { getCategorias } from '../services/categoria';
import '../Styles/tablaProductos.css';

const TablaProductos = () => {
    const { auth } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productoEditando, setProductoEditando] = useState(null); 
    const [formData, setFormData] = useState({
        nombre_producto: '',
        precio_producto: '',
        descripcion_producto: '',
        id_categoria: '',
    });

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

        // aqui se obtieneen las categorías al cargar el componente
        getCategorias()
            .then((response) => {
                setCategorias(response.data);
            })
            .catch(() => {
                setError('Error al cargar las categorías.');
            });
    }, [auth]);

    const generarUrlImagen = (fileId) => {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
    };

    const handleEliminar = async (cod_producto) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await eliminarProducto(cod_producto);
                const data = await obtenerProductosPorEmprendedor(auth.id);
                setProductos(data);
                alert('Producto eliminado exitosamente.');
            } catch (error) {
                alert('Error al eliminar el producto.');
            }
        }
    };

    const handleEditar = (producto) => {
        setProductoEditando(producto.cod_producto);
        setFormData({
            nombre_producto: producto.nombre_producto,
            precio_producto: producto.precio_producto,
            descripcion_producto: producto.descripcion_producto,
            id_categoria: producto.id_categoria,
        });
    };

    const handleActualizar = async () => {
        try {
            await actualizarProducto(productoEditando, formData);
            const data = await obtenerProductosPorEmprendedor(auth.id);
            setProductos(data);
            alert('Producto actualizado exitosamente.');
            setProductoEditando(null); // Cerrar edición
        } catch (error) {
            alert('Error al actualizar el producto.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                            <th>Categoría</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.cod_producto}>
                                <td>
                                    {productoEditando === producto.cod_producto ? (
                                        <input
                                            type="text"
                                            name="nombre_producto"
                                            value={formData.nombre_producto}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        producto.nombre_producto
                                    )}
                                </td>
                                <td>
                                    {productoEditando === producto.cod_producto ? (
                                        <textarea
                                            name="descripcion_producto"
                                            value={formData.descripcion_producto}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        producto.descripcion_producto
                                    )}
                                </td>
                                <td>{producto.cantidad_disponible}</td>
                                <td>
                                    {productoEditando === producto.cod_producto ? (
                                        <input
                                            type="number"
                                            name="precio_producto"
                                            value={formData.precio_producto}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        `$${producto.precio_producto}`
                                    )}
                                </td>
                                <td>
                                    {productoEditando === producto.cod_producto ? (
                                        <select
                                            name="id_categoria"
                                            value={formData.id_categoria}
                                            onChange={handleChange}
                                        >
                                            <option value="">Seleccionar Categoría</option>
                                            {categorias.map((categoria) => (
                                                <option
                                                    key={categoria.id_categoria}
                                                    value={categoria.id_categoria}
                                                >
                                                    {categoria.nombre_categoria}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        producto.categoria?.nombre_categoria || 'Sin categoría'
                                    )}
                                </td>
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
                                    {productoEditando === producto.cod_producto ? (
                                        <button onClick={handleActualizar}>Guardar</button>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditar(producto)}>Editar</button>
                                            <button onClick={() => handleEliminar(producto.cod_producto)}>Eliminar</button>
                                        </>
                                    )}
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

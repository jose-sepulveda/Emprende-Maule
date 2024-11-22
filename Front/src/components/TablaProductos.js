import React, { useState, useEffect, useContext } from 'react';
import { obtenerProductosPorEmprendedor, eliminarProducto, actualizarProducto, updateImagenYDescuento } from '../services/producto';
import { AuthContext } from '../Auth/AuthContext';
import { getCategorias } from '../services/categoria';
import { toast } from 'react-toastify'; 
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
        cantidad_disponible:'',
    });
    const [descuentoData, setDescuentoData] = useState({
        descuento: '',
        imagen: null,
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

        // Obtiene categorías
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
                toast.success('Producto eliminado exitosamente.'); 
            } catch (error) {
                toast.error('Error al eliminar el producto.');
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
            cantidad_disponible:producto.cantidad_disponible
        });
        setDescuentoData({
            descuento: producto.descuento || '',
            imagen: producto.imagen || null,
        });
    };

    const handleActualizar = async () => {
        try {
            await actualizarProducto(productoEditando, formData);
            const data = await obtenerProductosPorEmprendedor(auth.id);
            setProductos(data);
            toast.success('Producto actualizado exitosamente.'); 
            setProductoEditando(null); // Cerrar edición
        } catch (error) {
            toast.error('Error al actualizar el producto.');
        }
    };

    const handleDescuentoChange = (e) => {
        const { name, value } = e.target;
        setDescuentoData({ ...descuentoData, [name]: value });
    };

    const handleActualizarDescuento = async () => {
        try {
            const { descuento, imagen } = descuentoData;
            await updateImagenYDescuento(productoEditando, { descuento, imagen });
            const data = await obtenerProductosPorEmprendedor(auth.id);
            setProductos(data);
            toast.success('Descuento e imagen actualizados.'); 
            setProductoEditando(null); // Cerrar edición
        } catch (error) {
            toast.error('Error al actualizar descuento o imagen.'); 
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

            {/* Formulario para editar descuento e imagen */}
            {productoEditando && (
                <div className="formulario-descuento-imagen">
                    <h3>Aplicar Descuento y actualizar Imagen</h3>
                    <label>
                        Descuento (%):
                        <input
                            type="number"
                            name="descuento"
                            value={descuentoData.descuento}
                            onChange={handleDescuentoChange}
                            min="0"
                            max="100"
                        />
                    </label>
                    <label>
                        Imagen:
                        <input
                            type="file"
                            name="imagen"
                            onChange={(e) => setDescuentoData({ ...descuentoData, imagen: e.target.files[0] })}
                        />
                    </label>

                    <button onClick={handleActualizarDescuento}>Guardar Descuento e Imagen</button>
                </div>
            )}

            {/* Tabla de productos */}
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
                            <th>Precio Descuento</th> 
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
                                
                                <td>
                                    {productoEditando === producto.cod_producto ? (
                                        <textarea
                                            name="cantidad_disponible"
                                            value={formData.cantidad_disponible}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        producto.cantidad_disponible
                                    )}
                                </td>

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
                                    {producto.precio_descuento && !isNaN(Number(producto.precio_descuento))
                                        ? `$${Number(producto.precio_descuento)}`
                                        : 'No aplica descuento'}
                                </td>

                                <td>
                                    {productoEditando === producto.cod_producto ? (
                                        <button onClick={handleActualizar}>Guardar Producto</button>
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

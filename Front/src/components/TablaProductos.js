import React, { useEffect, useState } from 'react';
import { getProductos, deleteProducto, updateProducto } from '../services/producto';
import { toast } from 'react-toastify';
import '../Styles/tablaProductos.css';

const TablaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productoAActualizar, setProductoAActualizar] = useState(null);  // Nuevo estado para producto a actualizar
    const [formData, setFormData] = useState({
        nombre_producto: '',
        precio_producto: '',
        descripcion_producto: '',
        nombre_categoria: '',
        cantidad_disponible: ''
    });  // Formulario para actualización

    useEffect(() => {
        getProductos()
            .then(response => {
                setProductos(response.data); // Verifica que la respuesta contiene los productos
            })
            .catch(error => {
                console.error("Error al obtener productos:", error);
                toast.error("Error al cargar los productos");
            });
    }, []);

    const eliminarProducto = async (cod_producto) => {
        try {
            await deleteProducto(cod_producto);
            toast.success("Producto eliminado correctamente");
            setProductos(productos.filter(producto => producto.cod_producto !== cod_producto));
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            toast.error("Error al eliminar producto");
        }
    };

    const actualizarProducto = (cod_producto) => {
        const producto = productos.find(p => p.cod_producto === cod_producto);
        setProductoAActualizar(producto);  // Cargar el producto a actualizar en el estado
        setFormData({
            nombre_producto: producto.nombre_producto,
            precio_producto: producto.precio_producto,
            descripcion_producto: producto.descripcion_producto,
            nombre_categoria: producto.nombre_categoria,
            cantidad_disponible: producto.cantidad_disponible
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProducto(productoAActualizar.cod_producto, formData);
            toast.success("Producto actualizado correctamente");
            setProductos(productos.map(p => p.cod_producto === productoAActualizar.cod_producto ? { ...p, ...formData } : p));
            setProductoAActualizar(null);  // Cerrar el modal o formulario
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            toast.error("Error al actualizar producto");
        }
    };

    return (
        <div className="table-container">
            <h2>Lista de Productos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th>Cantidad</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos && productos.length > 0 ? (
                        productos.map(producto => (
                            <tr key={producto.cod_producto}>
                                <td>{producto.nombre_producto}</td>
                                <td>{producto.precio_producto}</td>
                                <td>{producto.descripcion_producto}</td>
                                <td>{producto.nombre_categoria}</td>
                                <td>{producto.cantidad_disponible}</td>
                                <td></td>
                                <td>
                                    <button onClick={() => actualizarProducto(producto.cod_producto)}>Actualizar</button>
                                    <button onClick={() => eliminarProducto(producto.cod_producto)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay productos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {productoAActualizar && (
                <div className="modal">
                    <h3>Actualizar Producto</h3>
                    <form onSubmit={handleSubmit}>
                        <label>Nombre:</label>
                        <input 
                            type="text" 
                            name="nombre_producto" 
                            value={formData.nombre_producto} 
                            onChange={handleInputChange} 
                        />
                        <label>Precio:</label>
                        <input 
                            type="number" 
                            name="precio_producto" 
                            value={formData.precio_producto} 
                            onChange={handleInputChange} 
                        />
                        <label>Descripción:</label>
                        <input 
                            type="text" 
                            name="descripcion_producto" 
                            value={formData.descripcion_producto} 
                            onChange={handleInputChange} 
                        />
                        <label>Categoría:</label>
                        <input 
                            type="text" 
                            name="nombre_categoria" 
                            value={formData.nombre_categoria} 
                            onChange={handleInputChange} 
                        />
                        <label>Cantidad:</label>
                        <input 
                            type="number" 
                            name="cantidad_disponible" 
                            value={formData.cantidad_disponible} 
                            onChange={handleInputChange} 
                        />
                        <button type="submit">Actualizar Producto</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TablaProductos;

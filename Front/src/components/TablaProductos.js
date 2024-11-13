import React, { useEffect, useState } from 'react';
import { getProductos, deleteProducto, updateProducto } from '../services/producto';
import { toast } from 'react-toastify';
import '../Styles/tablaProductos.css';

const TablaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productoAActualizar, setProductoAActualizar] = useState(null);
    const [formData, setFormData] = useState({
        nombre_producto: '',
        precio_producto: '',
        descripcion_producto: '',
        nombre_categoria: '',
        cantidad_disponible: ''
    });

    useEffect(() => {
        getProductos()
            .then(response => {
                setProductos(response.data);
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
        setProductoAActualizar(producto);
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
            setProductoAActualizar(null);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            toast.error("Error al actualizar producto");
        }
    };

    return (
        <div className="productos-table-container">
            <h2 className="productos-table-title">Lista de Productos</h2>
            <table className="productos-table">
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
                                    <button className="productos-btn actualizar" onClick={() => actualizarProducto(producto.cod_producto)}>Actualizar</button>
                                    <button className="productos-btn eliminar" onClick={() => eliminarProducto(producto.cod_producto)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No hay productos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {productoAActualizar && (
                <div className="productos-modal">
                    <h3 className="productos-modal-title">Actualizar Producto</h3>
                    <form className="productos-modal-form" onSubmit={handleSubmit}>
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
                        <button type="submit" className="productos-modal-submit-btn">Actualizar Producto</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TablaProductos;

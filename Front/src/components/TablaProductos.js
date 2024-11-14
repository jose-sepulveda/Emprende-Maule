import React, { useState, useEffect, useContext } from 'react';
import { obtenerProductosPorEmprendedor } from '../services/producto';
import { AuthContext } from '../Auth/AuthContext';

const TablaProductos = () => {
    const { auth } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        if (auth?.id) {
            obtenerProductosPorEmprendedor(auth.id)
                .then(setProductos)
                .catch(() => {
                    console.error("Error al cargar productos");
                });
        }
    }, [auth]);

    // Función para convertir el link de Google Drive a un enlace directo
    const convertirUrlDeDrive = (webViewLink) => {
        const fileId = webViewLink.split('/d/')[1]?.split('/')[0];
        if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
        return '';  // Si no se puede extraer el ID, retorna un string vacío
    };

    return (
        <div>
            <h2>Mis Productos</h2>
            {productos.length === 0 ? (
                <p>No tienes productos creados.</p>
            ) : (
                <ul>
                    {productos.map((producto) => (
                        <li key={producto.cod_producto}>
                            <h3>{producto.nombre_producto}</h3>
                            <p>{producto.descripcion_producto}</p>
                            <p>Precio: ${producto.precio_producto}</p>
                            <p>Categoría: {producto.nombre_categoria}</p>
                            {producto.imagen && (
                                <img 
                                    src={convertirUrlDeDrive(producto.imagen)} 
                                    alt={producto.nombre_producto} 
                                    style={{ width: '150px', height: '150px' }} 
                                />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TablaProductos;

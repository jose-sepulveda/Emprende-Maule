import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  
import { getProductos } from '../services/producto';  
import '../Styles/productoos.css';  

const Productoos = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = () => {
        setLoading(true);
        getProductos()  
            .then((data) => {
                setProductos(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar los productos.");
                setLoading(false);
            });
    };

    const generarUrlImagen = (fileId) => {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    };

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {productos.length === 0 ? (
                <p>No tienes productos creados.</p>
            ) : (
                <div className="productoos-container">
                    <div className="productoos-fila">
                        {productos.map((producto) => (
                            <Link to={`/producto/${producto.cod_producto}`} key={producto.cod_producto} className="productoos-card">
                                <p className="productoos-nombre">{producto.nombre_producto}</p>
                                <div className="productoos-image">
                                    {producto.imagen ? (
                                        <img
                                            src={generarUrlImagen(producto.imagen)}
                                            alt={producto.nombre_producto}
                                            className="productoos-imagen-producto"
                                        />
                                    ) : (
                                        <span>Sin imagen</span>
                                    )}
                                </div>
                                <div className="productoos-info">
                                    
                                    <p><strong>Descripción:</strong> {producto.descripcion_producto}</p>
                                    <p><strong>Categoría:</strong> {producto.nombre_categoria}</p> 
                                    <p><strong>Precio:</strong> ${producto.precio_producto}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Productoos;

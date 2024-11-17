import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Importamos Link de react-router-dom
import { getProductos } from '../services/producto';  
import '../Styles/inicioComponente.css';  

const Inicio = () => {
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

    const agruparPorEmprendedor = (productos) => {
        return productos.reduce((acc, producto) => {
            const { id_emprendedor, nombre_emprendedor, apellido1_emprendedor, apellido2_emprendedor } = producto;
            const nombreCompleto = `${nombre_emprendedor} ${apellido1_emprendedor} ${apellido2_emprendedor}`;

            if (!acc[id_emprendedor]) {
                acc[id_emprendedor] = { nombre: nombreCompleto, productos: [] };
            }
            acc[id_emprendedor].productos.push(producto);
            return acc;
        }, {});
    };

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const productosAgrupados = agruparPorEmprendedor(productos);

    return (
        <div>
            {productos.length === 0 ? (
                <p>No tienes productos creados.</p>
            ) : (
                <div className="productos-container">
                    {Object.keys(productosAgrupados).map((emprendedorId) => (
                        <div key={emprendedorId} className="emprendedor-seccion">
                            <h2>Productos de {productosAgrupados[emprendedorId].nombre}</h2>
                            <div className="productos-fila">
                                {productosAgrupados[emprendedorId].productos.map((producto) => (
                                    <Link to={`/producto/${producto.cod_producto}`} key={producto.cod_producto} className="producto-card" style={{ textDecoration: 'none' }}>
                                        <div className="producto-image">
                                            {producto.imagen ? (
                                                <img
                                                    src={generarUrlImagen(producto.imagen)}
                                                    alt={producto.nombre_producto}
                                                    className="imagen-producto"
                                                />
                                            ) : (
                                                <span>Sin imagen</span>
                                            )}
                                        </div>
                                        <div className="producto-info">
                                            <p>{producto.nombre_producto}</p>
                                            <p><strong>${producto.precio_producto}</strong></p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inicio;

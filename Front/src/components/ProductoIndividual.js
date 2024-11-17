import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductos } from '../services/producto';
import '../Styles/productoIndividual.css';

const ProductoIndividual = () => {
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); 

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
                            <strong>Vendido por id_empredendedor</strong>
                            <p>{producto.id_emprendedor}</p>
                        </div>
                        <div className="campo">
                            <strong>Descripción:</strong>
                            <p>{producto.descripcion_producto}</p>
                        </div>
                        <div className="campo">
                            <strong>Precio:</strong>
                            <p>${producto.precio_producto}</p>
                        </div>
                        <button className="btn-agregar-carrito">
                            Añadir al carrito
                        </button>


                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductoIndividual;

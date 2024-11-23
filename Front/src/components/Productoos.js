import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, getProductosByCategoria } from '../services/producto';
import { getCategorias } from '../services/categoria';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../Styles/productoos.css';

const Productoos = () => {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]); 
    const [categorias, setCategorias] = useState([]);
    const [emprendedores, setEmprendedores] = useState([]); 
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [emprendedorSeleccionado, setEmprendedorSeleccionado] = useState('');
    const [nombreBusqueda, setNombreBusqueda] = useState(''); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
    }, []);

    const cargarProductos = () => {
        setLoading(true);
        getProductos()
            .then((data) => {
                setProductos(data);
                setProductosFiltrados(data); 

                setEmprendedores(
                    [...new Set(data.map((producto) => producto.nombre_emprendedor))]
                );
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar los productos.");
                setLoading(false);
            });
    };

    const cargarCategorias = () => {
        getCategorias()
            .then((response) => setCategorias(response.data))
            .catch((error) => console.error("Error al cargar las categorías:", error));
    };

    const manejarCambioCategoria = (e) => {
        const id_categoria = e.target.value;
        setCategoriaSeleccionada(id_categoria);

        if (id_categoria === '') {
            setProductosFiltrados(productos);  
        } else {
            setLoading(true);
            getProductosByCategoria(id_categoria)
                .then((data) => {
                    setProductosFiltrados(data);
                    setLoading(false);
                })
                .catch(() => {
                    setProductosFiltrados([]);  
                    setLoading(false);
                });
        }
    };

    const manejarCambioEmprendedor = (e) => {
        const nombre_emprendedor = e.target.value;
        setEmprendedorSeleccionado(nombre_emprendedor);

        if (nombre_emprendedor === '') {
            setProductosFiltrados(productos);  
        } else {
            setProductosFiltrados(
                productos.filter((producto) => producto.nombre_emprendedor === nombre_emprendedor)
            );
        }
    };

    const manejarBusqueda = (e) => {
        const valorBusqueda = e.target.value;
        setNombreBusqueda(valorBusqueda);

        // filtrar  productos por nombre
        const productosFiltradosPorNombre = productos.filter((producto) =>
            producto.nombre_producto.toLowerCase().includes(valorBusqueda.toLowerCase())
        );

        setProductosFiltrados(productosFiltradosPorNombre);
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
            <div className='filtroos-container'>

            {/* Filtro por categoría */}
            <div className="filtro-categoria">
                <label htmlFor="categoria">Filtrar por categoría:</label>
                <select
                    id="categoria"
                    value={categoriaSeleccionada}
                    onChange={manejarCambioCategoria}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id_categoria} value={categoria.id_categoria}>
                            {categoria.nombre_categoria}
                        </option>
                    ))}
                </select>
            </div>

            {/* filtrar por emprendedor */}
            <div className="filtro-emprendedor">
                <label htmlFor="emprendedor">Filtrar por emprendedor:</label>
                <select
                    id="emprendedor"
                    value={emprendedorSeleccionado}
                    onChange={manejarCambioEmprendedor}
                >
                    <option value="">Todos los emprendedores</option>
                    {emprendedores.map((emprendedor, index) => (
                        <option key={index} value={emprendedor}>
                            {emprendedor}
                        </option>
                    ))}
                </select>
            </div>

            {/* buscar por nombre producto */}
            <div className="buscador-producto">
                <label htmlFor="buscador"></label>
                <div className="buscador-input-container">
                    <input
                        type="text"
                        id="buscador"
                        value={nombreBusqueda}
                        onChange={manejarBusqueda}
                        placeholder="Escribe el nombre del producto"
                    />
                    <FontAwesomeIcon icon={faSearch} className="buscador-icon" />
                </div>
            </div>

            </div>

            {/* lista productos */}
            {productosFiltrados.length === 0 ? (
                <p>No existen productos para esta selección.</p>
            ) : (
                <div className="productoos-container">
                    <div className="productoos-fila">
                        {productosFiltrados.map((producto) => (
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
                                    {producto.precio_descuento && (
                                        <div className="descuento-circulo-p">
                                            -{producto.descuento}%
                                        </div>
                                    )}
                                </div>
                                <div className="productoos-info">
                                    <p><strong>Descripción:</strong> {producto.descripcion_producto}</p>
                                    <p><strong>Categoría:</strong> {producto.nombre_categoria}</p>
                                    <p><strong>Precio:</strong> ${producto.precio_producto}</p>
                                        {producto.precio_descuento && (
                                            <p><strong>Precio descuento:</strong> ${producto.precio_descuento}</p>
                                        )}
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

import React, { useState, useEffect } from "react";
import { crearProducto } from "../services/producto";
import { getCategorias } from "../services/categoria"; 
import '../Styles/Cproductos.css';

const CrearProducto = () => {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState(""); 
    const [cantidad, setCantidad] = useState("");
    const [descuento, setDescuento] = useState("");
    const [imagen, setImagen] = useState(null); 
    const [categorias, setCategorias] = useState([]); 

    // carga las categorias
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await getCategorias();
                setCategorias(response.data); 
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };

        fetchCategorias();
    }, []); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        // creacion del producto
        const producto = {
            nombre_producto: nombre,
            precio_producto: precio,
            descripcion_producto: descripcion,
            id_categoria: categoria, 
            cantidad_disponible: cantidad,
            descuento: descuento,
            imagen: imagen, 
        };

        try {
            // aqui se llama a la api para crear el producto 
            await crearProducto(producto);
            alert("Producto creado con éxito");
        } catch (error) {
            console.error("Error al crear el producto:", error);
            alert("Hubo un error al crear el producto");
        }
    };

    return (
        <div className="container-productos">
            <h2>Crear Producto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre del Producto:</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
                </div>
                <div>
                    <label>Precio:</label>
                    <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required/>
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required/>
                </div>
                <div>
                    <label>Categoría:</label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)}required >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre_categoria}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Cantidad Disponible:</label>
                    <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                </div>
                <div>
                    <label>Descuento (opcional):</label>
                    <input type="number" value={descuento} onChange={(e) => setDescuento(e.target.value)}/>
                </div>
                <div>
                    <label>Imagen del Producto:</label>
                    <input type="file" onChange={(e) => setImagen(e.target.files[0])} required />
                </div>
                <button type="submit">Crear Producto</button>
            </form>
        </div>
    );
};

export default CrearProducto;

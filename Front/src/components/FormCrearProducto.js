import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { crearProducto } from '../services/producto';
import { getCategorias } from '../services/categoria';
import { AuthContext } from '../Auth/AuthContext'; // Contexto de autenticación
import '../Styles/gestionProductos.css';

const FormCrearProducto = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [categorias, setCategorias] = useState([]);
    const { auth } = useContext(AuthContext); // Obtener id_emprendedor desde el contexto

    useEffect(() => {
        getCategorias()
            .then(response => {
                setCategorias(response.data); // Obtener categorías
            })
            .catch(error => {
                console.error("Error al obtener las categorías:", error);
                toast.error("Error al cargar las categorías");
            });
    }, []);

    const enviar = async (data) => {
        // Preparar el objeto producto
        const producto = {
            nombre_producto: data.nombre_producto,
            precio_producto: data.precio_producto,
            descripcion_producto: data.descripcion_producto,
            id_categoria: data.id_categoria, 
            cantidad_disponible: data.cantidad_disponible,
            imagen: data.imagen[0], // La imagen se maneja como un archivo
            id_emprendedor: auth.id, // Aquí se agrega el id_emprendedor desde el contexto
        };

        // Verificar que los datos estén siendo enviados correctamente
        console.log('Datos enviados:', producto);

        try {
            const response = await crearProducto(producto);
            console.log("Producto registrado:", response.data);
            toast.success("Producto registrado correctamente");
        } catch (error) {
            console.error("Error al registrar Producto:", error);
            toast.error("Error al registrar Producto");
        }
    };

    return (
        <div className="form-container-prod">
            <h2>Añadir nuevo producto</h2>
            <form className="form-prod" onSubmit={handleSubmit(enviar)}>
                <div>
                    <label htmlFor="nombre_producto">Nombre</label>
                    <input 
                        id="nombre_producto" 
                        type="text" 
                        {...register("nombre_producto", { required: "El nombre es obligatorio" })} 
                    />
                    {errors.nombre_producto && <span>{errors.nombre_producto.message}</span>}
                </div>
                <div>
                    <label htmlFor="precio_producto">Precio</label>
                    <input 
                        id="precio_producto" 
                        type="number" 
                        {...register("precio_producto", { required: "El precio es obligatorio", min: 0 })} 
                    />
                    {errors.precio_producto && <span>{errors.precio_producto.message}</span>}
                </div>
                <div>
                    <label htmlFor="descripcion_producto">Descripción</label>
                    <input 
                        id="descripcion_producto" 
                        type="text" 
                        {...register("descripcion_producto", { required: "La descripción es obligatoria" })} 
                    />
                    {errors.descripcion_producto && <span>{errors.descripcion_producto.message}</span>}
                </div>
                <div>
                    <label htmlFor="id_categoria">Categoría</label>
                    <select 
                        id="id_categoria" 
                        {...register("id_categoria", { required: "Seleccione una categoría" })} 
                    >
                        <option value="">Seleccione una categoría</option>
                        {categorias && categorias.length > 0 ? (
                            categorias.map(categoria => (
                                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                    {categoria.nombre_categoria}
                                </option>
                            ))
                        ) : (
                            <option disabled>Cargando categorías...</option>
                        )}
                    </select>
                    {errors.id_categoria && <span>{errors.id_categoria.message}</span>}
                </div>
                <div>
                    <label htmlFor="cantidad_disponible">Cantidad Disponible</label>
                    <input 
                        id="cantidad_disponible" 
                        type="number" 
                        {...register("cantidad_disponible", { required: "La cantidad es obligatoria", min: 1 })} 
                    />
                    {errors.cantidad_disponible && <span>{errors.cantidad_disponible.message}</span>}
                </div>
                <div className='file-uploads-p'>
                    <label htmlFor="imagen">Imagen</label>
                    <input id="imagen" type="file" required {...register("imagen")} />
                </div>
                <button type="submit">Añadir producto</button>
            </form>
        </div>
    );
};

export default FormCrearProducto;

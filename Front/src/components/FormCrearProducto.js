import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { crearProducto } from '../services/producto';
import { getCategorias } from '../services/categoria'; 

const FormCrearProducto = () => {
    const { register, handleSubmit } = useForm();
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        getCategorias()
            .then(response => {
                setCategorias(response.data); 
            })
            .catch(error => {
                console.error("Error al obtener las categorías:", error);
                toast.error("Error al cargar las categorías");
            });
    }, []);

    const enviar = async (data) => {
        const producto = {
            nombre_producto: data.nombre_producto,
            precio_producto: data.precio_producto,
            descripcion_producto: data.descripcion_producto,
            id_categoria: data.id_categoria, 
            cantidad_disponible: data.cantidad_disponible,
            descuento: data.descuento,
            imagen: data.imagen[0] 
        };

        try {
            const response = await crearProducto(producto);
            console.log("Producto registrado:", response.data);
            toast.success("Producto registrado correctamente");
        } catch (error) {
            console.error("Error al registrar Producto:", error);
            toast.error("Error al registrar Producto");
        }
    }

    return (
        <div className="form-container">
            <h2>Formulario de Registro de Producto</h2>
            <form onSubmit={handleSubmit(enviar)}>
                <div>
                    <label htmlFor="nombre_producto">Nombre</label>
                    <input id="nombre_producto" type="text" required {...register("nombre_producto")} />
                </div>
                <div>
                    <label htmlFor="precio_producto">Precio</label>
                    <input id="precio_producto" type="number" required {...register("precio_producto")} />
                </div>
                <div>
                    <label htmlFor="descripcion_producto">Descripción</label>
                    <input id="descripcion_producto" type="text" required {...register("descripcion_producto")} />
                </div>
                <div>
                    <label htmlFor="id_categoria">Categoría</label>
                    <select id="id_categoria" {...register("id_categoria")} required>
                        <option value="">Seleccione una categoría</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.nombre_categoria}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="cantidad_disponible">Cantidad Disponible</label>
                    <input id="cantidad_disponible" type="number" required {...register("cantidad_disponible")} />
                </div>
                <div>
                    <label htmlFor="descuento">Descuento</label>
                    <input id="descuento" type="number" {...register("descuento")} />
                </div>
                <div>
                    <label htmlFor="imagen">Imagen</label>
                    <input id="imagen" type="file" required {...register("imagen")} />
                </div>
                <button type="submit">Crear Producto</button>
            </form>
        </div>
    );
};

export default FormCrearProducto;

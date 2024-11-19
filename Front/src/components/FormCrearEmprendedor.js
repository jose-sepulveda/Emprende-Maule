import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import '../Styles/formEmprendedor.css';
import { crearEmprendedor } from '../services/emprendedor';

const FormCrearEmprendedor = () => {

    const { register, handleSubmit, watch } = useForm();
    const [loading, setLoading] = useState(false);

    const comprobante = watch("comprobante");
    const imagenProductos = watch("imagen_productos");
    const imagenLocal = watch("imagen_local");

    const enviar = async(data) => {
        setLoading(true);
        const emprendedor = {
            nombre_emprendedor: data.nombre_emprendedor,
            apellido1_emprendedor: data.apellido1_emprendedor,
            apellido2_emprendedor: data.apellido2_emprendedor,
            rut_emprendedor: data.rut_emprendedor,
            telefono: data.telefono,
            contrasena: data.contrasena,
            correo_electronico: data.correo_electronico,
            direccion: data.direccion,
            tipo_de_cuenta: data.tipo_de_cuenta,
            numero_de_cuenta: data.numero_de_cuenta,
            comprobante: data.comprobante,
            imagen_productos: data.imagen_productos,
            imagen_local: data.imagen_local
        };
        
        console.log(emprendedor)
        try {
            const response = await crearEmprendedor(emprendedor);
            console.log("Emprendedor registrado:", response.data);
            toast.success("Emprendedor registrado correctamente");
        } catch (error) {
            console.error("Error al registrar emprendedor:", error);
            toast.error("Error al registrar emprendedor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container-emprendedor">
            <h2 >Formulario de registro emprendedor</h2>
            <form className='form-emprendedor' onSubmit={handleSubmit(enviar)}>
                <div className="form-group-emprendedor" >
                    <label htmlFor="nombre_emprendedor">Nombre</label>
                    <input id="nombre_emprendedor" type="text" required {...register("nombre_emprendedor")}/>
                </div>
                <div>
                    <label htmlFor="apellido1_emprendedor">Apellido Paterno</label>
                    <input id="apellido1_emprendedor" type="text" required {...register("apellido1_emprendedor")}/>
                </div>
                <div>
                    <label htmlFor="apellido2_emprendedor">Apellido Materno</label>
                    <input id="apellido2_emprendedor" type="text" required {...register("apellido2_emprendedor")}/>
                </div>
                <div>
                    <label htmlFor="rut_emprendedor">RUT</label>
                    <input id="rut_emprendedor" type="text" required {...register("rut_emprendedor")}/>
                </div>
                <div>
                    <label htmlFor="telefono">Teléfono</label>
                    <input id="telefono" type="tel" required {...register("telefono")}/>
                </div>
                <div>
                    <label htmlFor="contrasena">Contraseña</label>
                    <input id="contrasena" type="password" required {...register("contrasena")}/>
                </div>
                <div>
                    <label htmlFor="correo_electronico">Correo</label>
                    <input id="correo_electronico" type="email" required {...register("correo_electronico")}/>
                </div>
                <div>
                    <label htmlFor="direccion">Dirección</label>
                    <input id="direccion" type="text" required {...register("direccion")}/>
                </div>
                <div>
                    <label htmlFor="tipo_de_cuenta">Tipo de Cuenta</label>
                    <input id="tipo_de_cuenta" type="text" required {...register("tipo_de_cuenta")}/>
                </div>
                <div>
                    <label htmlFor="numero_de_cuenta">Número de Cuenta</label>
                    <input id="numero_de_cuenta" type="number" required {...register("numero_de_cuenta")}/>
                </div>
                <div className='file-uploads'>
                    <div>
                        <label htmlFor="comprobante">Subir Comprobante</label>
                        <input 
                            id="comprobante" 
                            type="file" 
                            multiple
                            required {...register("comprobante")}/>
                        <p>{comprobante?.length || 0} archivo(s) seleccionado(s)</p>
                    </div>
                    <div>
                        <label htmlFor="imagen_productos">Subir Imagenes del Producto</label>
                        <input
                            id="imagen_productos"
                            type="file" 
                            multiple
                            required {...register("imagen_productos")}/>
                        <p>{imagenProductos?.length || 0} archivo(s) seleccionado(s)</p>
                    </div>
                    <div>
                        <label htmlFor="imagen_local">Subir Imagenes del Local</label>
                        <input 
                            id="imagen_local" 
                            type="file" 
                            multiple
                            required {...register("imagen_local")}/>
                        <p>{imagenLocal?.length || 0} archivo(s) seleccionado(s)</p>
                    </div>
                </div>
                
                <button type="submit">{loading ? "Registrando..." : "Registrar"}</button>
            </form>
        </div>
    )
}

export default FormCrearEmprendedor

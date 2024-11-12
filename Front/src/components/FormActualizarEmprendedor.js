import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { updateEmprendedor } from '../services/emprendedor';
import "../Styles/actualizar-emprendedor.css";

const FormActualizarEmprendedor = () => {
    const { register, handleSubmit } = useForm();
    const { rut_emprendedor } = useParams();
    const [ password, setPassword ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);

    const navigate = useNavigate();

    const onSubmit = (data) => {

        const updateData = {};

        for (const key in data) {
            if (data[key] && data[key] !== '') {
                updateData[key] = data[key];
            }
        }
        updateEmprendedor(rut_emprendedor, updateData)
            .then(response => {
                console.log("Emprendedor actualizado con éxito:", response);
                toast.success("Emprendedor actualizado con éxito")
            })
            .catch(error => {
                console.error("Error al actualizar emprendedor:", error);
                toast.error("Error al actualizar emprendedor")
            });
    };

    const back = () => {
        navigate('/gestionEmprendedores')
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <>
        <div className="form-container">
            <h2>Actualizar Datos de Emprendedor</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="form-group">
                    <label htmlFor="nombre_emprendedor">Nombre</label>
                    <input {...register('nombre_emprendedor')} id="nombre_emprendedor" placeholder="Nombre" type='text'/>
                </div>
                <div className="form-group">
                    <label htmlFor="apellido1_emprendedor">Apellido Paterno</label>
                    <input {...register('apellido1_emprendedor')} id="apellido1_emprendedor" placeholder="Apellido Paterno" type='text'/>
                </div>
                <div className="form-group">
                    <label htmlFor="apellido2_emprendedor">Apellido Materno</label>
                    <input {...register('apellido2_emprendedor')} id="apellido2_emprendedor" placeholder="Apellido Materno" type='text'/>
                </div>
                <div className="form-group">
                    <label htmlFor="direccion">Dirección</label>
                    <input {...register('direccion')} id="direccion" placeholder="Dirección" type='text'/>
                </div>
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input {...register('telefono')} id="telefono" placeholder="Teléfono" type='phone'/>
                </div>
                <div className="form-group">
                <label htmlFor="contrasena">Contraseña</label>
                    <div className='contrasena'>
                        <input {...register('contrasena')} 
                        id="ccontrasena"
                         placeholder="Contraseña" 
                         type={showPassword ? 'text' : 'password'} 
                         onChange={(e) => setPassword(e.target.value)}/>
                        <span
                            onClick={togglePasswordVisibility}
                        >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash: faEye}/>
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="tipo_de_cuenta">Tipo de Cuenta</label>
                    <input {...register('tipo_de_cuenta')} id="tipo_de_cuenta" placeholder="Tipo de Cuenta" type='text'/>
                </div>
                <div className="form-group">
                    <label htmlFor="numero_de_cuenta">Número de Cuenta</label>
                    <input {...register('numero_de_cuenta')} id="numero_de_cuenta" placeholder="Número de Cuenta" type='number'/>
                </div>
                <button type="submit" className="submit-btn">Actualizar</button>
                <button className="back-btn" onClick={back}>Volver</button>
            </form>
        </div>
        <ToastContainer/>
        </>
    );
}
export default FormActualizarEmprendedor

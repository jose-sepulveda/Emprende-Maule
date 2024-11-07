import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { loginCliente } from '../services/crearCliente';
import '../Styles/login-cliente.css';

const LoginCliente = () => {

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async() => {
        try {
            const response = await loginCliente({ correo, contrasena });
            // Almacena el token y redirige
            if (response) {
                await setToken(response.token);
                navigate("/");
            } else {
                toast.error("Usuario no existe. Por favor registrarse");
            }
        } catch (error) {
            console.error("Error al iniciar sesión");
            toast.error("Error al iniciar sesión, Inténtelo de nuevo mas tarde");
        }
    }
    
    return (
        <div className='login-form-container'>
            <h2>Iniciar Sesión Cliente</h2>
            <input
                className='login-input'
                type='text'
                placeholder='Correo'
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
            />
            <input
                className='login-input'
                type='password'
                placeholder='Contraseña'
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
            />
            <button className='login-button' onClick={handleLogin}>Iniciar Sesión</button>
        </div>
    )
}

export default LoginCliente

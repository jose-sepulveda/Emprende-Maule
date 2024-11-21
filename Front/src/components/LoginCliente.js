import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { AuthContext } from '../Auth/AuthContext';
import { carroLocal } from '../services/carrito_producto';
import { loginCliente, recuperarContrasenaCliente } from '../services/crearCliente';
import '../Styles/login-cliente.css';

const LoginCliente = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [correoRecuperacion, setCorreoRecuperacion] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!correo || !contrasena) {
            toast.error("Por favor ingrese su correo y contraseña");
            return;
        }

        try {
            const response = await loginCliente({ correo, contrasena });
            if (response && response.data.token) {
                setToken(response.data.token);
                if (response.data.id_cliente) {
                    const id = response.data.id_cliente;
                    

                    const carritoLocal = JSON.parse(localStorage.getItem('carritoLocal')) || [];

                    if (carritoLocal.length > 0) {
                        try {
                            await carroLocal(id, carritoLocal);
                            localStorage.removeItem('carritoLocal')
                            toast.success('Productos de carrito agregados correctamente')
                        } catch (error) {
                            console.error('Error al enviar carritoLocal: ', error)
                        }

                    } else {
                        console.log('No se recibio en Id')
                    }
                }
                navigate("/productoos");

                
            } else {
                toast.error("Cliente no existe. Por favor registrarse");
                console.error("Cliente no existe. Por favor registrarse");
            }
        } catch (error) {
            console.error("Error al iniciar sesión");
            toast.error("Error al iniciar sesión, Inténtelo de nuevo más tarde");
        }
    }

    const handleRecuperacion = async () => {
        const correoParaRecuperacion = correoRecuperacion || correo; 
    
        if (!correoParaRecuperacion || !/\S+@\S+\.\S+/.test(correoParaRecuperacion)) {
          toast.error("Por favor ingrese su correo para la recuperación de contraseña");
          return;
        }
    
        setLoading(true);
    
        try {
          const response = await recuperarContrasenaCliente(correoParaRecuperacion);
          toast.success(response.msg);
          setShowModal(false);
        } catch (error) {
          console.error("Error al enviar el correo de recuperación: ", error);
          toast.error("Error al enviar el correo de recuperación, intentalo más tarde");
        } finally {
          setLoading(false);
        }
    };
    
    const handleModalOpen = () => {
        setCorreoRecuperacion(correo)
        setShowModal(true);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    
    return (
        <>
            <div className='login-cliente-container'>
                <h2>Iniciar Sesión Cliente</h2>
                <input
                    className='login-cliente-input'
                    type='email'
                    placeholder='Correo'
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
                <div className='login-cliente-input-container'>
                    <input
                        className='login-cliente-input'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Contraseña'
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                    />
                    <button
                        className='password-toggle-button'
                        onClick={togglePasswordVisibility}
                        type='button'
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <button className='login-cliente-button' onClick={handleLogin}>Iniciar Sesión</button>
                <button
                    className="recuperar-button"
                    onClick={handleModalOpen}
                >
                ¿Olvidaste tu contraseña?
                </button>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Recuperación de contraseña</h3>
                        <input
                            type="email"
                            placeholder="Ingresa tu correo"
                            value={correoRecuperacion || correo}
                            onChange={(e) => setCorreoRecuperacion(e.target.value)}
                        />
                        <button
                            className="enviar-button"
                            onClick={handleRecuperacion}
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                        </button>
                        <button
                            className="cancelar-button"
                            onClick={() => setShowModal(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    );
}

export default LoginCliente;

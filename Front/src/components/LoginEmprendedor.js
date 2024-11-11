import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { loginEmprendedor, recuperarContrasenaEmprendedor } from '../services/emprendedor';

const LoginEmprendedor = () => {

    const [correo_electronico, setCorreo_electronico] = useState('');
    const [contrasena, setContrasena] = useState('');
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [correoRecuperacion, setCorreoRecuperacion] = useState('');

    const [loading, setLoading] = useState(false);

    const handleLogin = async() => {
        if (!correo_electronico || !contrasena) {
            toast.error("Por favor ingrese su correo y contraseña");
            return;
        }

        try {
            const response = await loginEmprendedor({ correo_electronico, contrasena });
            if (response && response.data.token) {
                setToken(response.data.token);
                navigate("/");
            } else {
                toast.error("Emprendedor no existe. Por favor registrarse");
                console.error("Emprendedor no existe. Por favor registrarse");
            }
        } catch (error) {
            console.error("Error al iniciar sesión");
            toast.error("Error al iniciar sesión, Inténtelo de nuevo mas tarde");
        }
    }

    const handleRecuperacion = async () => {
        const correoParaRecuperacion = correoRecuperacion || correo_electronico; 
    
        if (!correoParaRecuperacion || !/\S+@\S+\.\S+/.test(correoParaRecuperacion)) {
          toast.error("Por favor ingrese su correo para la recuperación de contraseña");
          return;
        }
    
        setLoading(true);
    
        try {
          const response = await recuperarContrasenaEmprendedor(correoParaRecuperacion); 
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
        setCorreoRecuperacion(correo_electronico)
        setShowModal(true);
      }

    return (
        <>
            <div className='login-form-container'>
                <h2>Iniciar Sesión Emprendedor</h2>
                <input
                    className='login-input'
                    type='text'
                    placeholder='Correo'
                    value={correo_electronico}
                    onChange={(e) => setCorreo_electronico(e.target.value)}
                />
                <input
                    className='login-input'
                    type='password'
                    placeholder='Contraseña'
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                />
                <button className='login-button' onClick={handleLogin}>Iniciar Sesión</button>
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
                    value={correoRecuperacion || correo_electronico}
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
    )
}

export default LoginEmprendedor

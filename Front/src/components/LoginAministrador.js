import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { loginAdmin, recuperarContrasena } from '../services/admin';
import "../Styles/login-admin.css";

const LoginAministrador = () => {
  const [correo, setCorreo] = useState(''); 
  const [contrasena, setContrasena] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState(''); 

  const [loading, setLoading] = useState(false);

  const [ password, setPassword ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      toast.error("Por favor ingrese su correo y contraseña");
      return;
    }

    try {
      const response = await loginAdmin({correo, contrasena});
      if (response && response.data.token) {
        setToken(response.data.token);
        navigate("/");
      } else {
        toast.error("Administrador no existe. Por favor registrarse");
        console.error("Administrador no existe. Por favor registrarse");
      }
    } catch (error) {
      console.error("Error al iniciar sesión");
      toast.error("Error al iniciar sesión, Inténtelo de nuevo más tarde");
    }
  };

  const handleRecuperacion = async () => {
    const correoParaRecuperacion = correoRecuperacion || correo; 

    if (!correoParaRecuperacion || !/\S+@\S+\.\S+/.test(correoParaRecuperacion)) {
      toast.error("Por favor ingrese su correo para la recuperación de contraseña");
      return;
    }

    setLoading(true);

    try {
      const response = await recuperarContrasena(correoParaRecuperacion);
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
      <div className="login-admin-form-container">
        <h2>Iniciar Sesión administrador</h2>
        <input
          className="login-admin-input"
          type="text"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        
        <div className="login-admin-input-container">
          <input
            className="login-admin-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <button
            className="login-admin-password-toggle-button"
            onClick={togglePasswordVisibility}
            type="button"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <button className="login-admin-button" onClick={handleLogin}>
          Iniciar Sesión
        </button>

        <button
          className="login-admin-recuperar-button"
          onClick={handleModalOpen}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {showModal && (
        <div className="login-admin-modal">
          <div className="login-admin-modal-content">
            <h3>Recuperación de contraseña</h3>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={correoRecuperacion || correo}
              onChange={(e) => setCorreoRecuperacion(e.target.value)}
            />
            <button
              className="login-admin-enviar-button"
              onClick={handleRecuperacion}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
            <button
              className="login-admin-cancelar-button"
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
};

export default LoginAministrador;
// pages/ResetPassword.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { resetPasswordAdmin } from '../services/admin';
import "../Styles/reset-password.css";

const ResetPasswordAdmin = () => {
  const { token } = useParams(); // Extrae el token de la URL
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!nuevaContrasena || !confirmarContrasena) {
      toast.error('Por favor ingresa la nueva contraseña');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await resetPasswordAdmin(nuevaContrasena);

      toast.success(response.data.msg);
      navigate('/login'); // Redirige a la página de login después de cambiar la contraseña
    } catch (error) {
      console.error('Error al restablecer la contraseña: ', error);
      toast.error('Error al restablecer la contraseña, intenta de nuevo más tarde');
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error('El token de recuperación no es válido');
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="reset-password-container">
      <h2>Restablecer contraseña</h2>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaContrasena}
        onChange={(e) => setNuevaContrasena(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmarContrasena}
        onChange={(e) => setConfirmarContrasena(e.target.value)}
      />
      <button onClick={handleResetPassword}>Restablecer contraseña</button>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordAdmin;

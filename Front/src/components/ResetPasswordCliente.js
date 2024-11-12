import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPasswordCliente } from '../services/crearCliente';

const ResetPasswordCliente = () => {

    const { token } = useParams();
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
          toast.error('Token no válido');
        }
      }, [token]);
    
      const handleActualizarContrasena = async () => {
        if (!contrasenaActual || !nuevaContrasena) {
          toast.error('Por favor ingrese una nueva contraseña');
          return;
        }
    
    
    
        setLoading(true);
    
        try {
          const response = await resetPasswordCliente(token, contrasenaActual, nuevaContrasena);
          toast.success('Contraseña actualizada con éxito');
        } catch (error) {
          toast.error('Error al actualizar la contraseña. Inténtalo de nuevo más tarde.');
        } finally {
          setLoading(false);
        }
      };

    return (
        <div className='reset-password-container'>
        <h2>Actualizar Contraseña de Cliente</h2>
        <input
            type="password"
            placeholder="Contraseña Actual"
            value={contrasenaActual}
            onChange={(e) => setContrasenaActual(e.target.value)}
        />
        <input
            type="password"
            placeholder="Nueva Contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
        />
        <button onClick={handleActualizarContrasena} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
        </div>
    )
}

export default ResetPasswordCliente

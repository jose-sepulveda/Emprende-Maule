import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cliente';


// Obtener todos los clientes
export const getClientes = () => axios.get(`${API_URL}/list`);

// Obtener un cliente por su ID
export const getClienteById = (id_cliente) => axios.get(`${API_URL}/${id_cliente}`);

// Crear un nuevo cliente
export const createCliente = (cliente) => axios.post(`${API_URL}/`, cliente);

// Actualizar un cliente existente
export const updateCliente = (id_cliente, cliente) => axios.put(`${API_URL}/${id_cliente}`, cliente);

// Eliminar un cliente
export const deleteCliente = (id_cliente) => axios.delete(`${API_URL}/${id_cliente}`);

// Iniciar sesión para cliente
export const loginCliente = (credentials) => axios.post(`${API_URL}/login`, credentials);

// Restablecer contraseña de cliente
// Correo para recuperar cntraseña
export const recuperarContrasenaCliente = async(correo) => {
    try {
        const response = await axios.post(`${API_URL}/recuperar`, { correo });
        return response.data;
    } catch (error) {
        console.error('Error al enviar el correo de recuperación:', error);

        if (error.response) {
            const errorMsg = error.response.data.message || 'Hubo un problema al procesar la solicitud.';
            if (error.response.status === 400) {
                throw new Error('Correo no encontrado. Por favor verifica e intenta de nuevo.');
            } else if (error.response.status === 500) {
                throw new Error('Error interno del servidor. Inténtalo más tarde.');
            } else {
                throw new Error(errorMsg);
            }
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor. Intenta nuevamente.');
        } else {
            throw new Error('Error desconocido al intentar recuperar la contraseña. Inténtalo de nuevo más tarde.');
        }
    }
}

// Resetear la contraseña del administrador
export const resetPasswordCliente = async (token, contrasenaActual, nuevaContrasena) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password-cliente/${token}`, { contrasenaActual, nuevaContrasena });
        return response.data;
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        throw error;
    }
};

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/administrador'; 

// Obtener todos los administradores
export const getAdministradores = () => axios.get(`${API_URL}/list`);

// Obtener un administrador por su ID
export const getAdminById = (id_administrador) => axios.get(`${API_URL}/${id_administrador}`);

// Crear un nuevo administrador
export const createAdmin = (administrador) => axios.post(API_URL, administrador);

// Actualizar un administrador existente
export const updateAdmin = (id_administrador, administrador) => axios.put(`${API_URL}/${id_administrador}`, administrador);

// Eliminar un administrador
export const deleteAdmin = (id_administrador) => axios.delete(`${API_URL}/${id_administrador}`);

// Iniciar sesión para administrador
export const loginAdmin = (credentials) => axios.post(`${API_URL}/login`, credentials);

// Correo para recuperar cntraseña
export const recuperarContrasena = async(correo, token) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/administrador/reset-password/${token}`, { correo });
        return response.data;
    } catch (error) {
        console.error('Error al enviar el correo de recuperación: ', error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Hubo un problema al procesar la solicitud.');
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor. Intenta nuevamente.');
        } else {
            throw new Error('Error desconocido al intentar recuperar la contraseña. Inténtalo de nuevo más tarde.');
        }
    }
}

// Resetear la contraseña del administrador
export const resetPasswordAdmin = async (token, nuevaContrasena) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password/${token}`, { nuevaContrasena });
        return response.data;
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        throw error;
    }
};
import axios from "axios";

const API_URL = 'http://localhost:3000/api/emprendedor';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

// Obtener todos los emprendedores
export const getEmprendedores = () => api.get('/list');

// Obtener un emprendedor por ID
export const getEmprendedor = (rut_emprendedor) => api.get(`/${rut_emprendedor}`);

// Crear emprendedor
export const crearEmprendedor = (emprendedor) => {
    const formData = new FormData();
    for (const key in emprendedor) {
        formData.append(key, emprendedor[key]);
    }
    return api.post('/new', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

// Actualizar emprendedor
export const updateEmprendedor = (rut_emprendedor, emprendedor) => api.put(`/${rut_emprendedor}`, emprendedor);

// Eliminar un emprendedor
export const deleteEmprendedor = async (rut_emprendedor, token) => {
    try {
        const response = await api.delete(`${API_URL}/${rut_emprendedor}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el emprendedor:', error);
        throw error;
      }
    
};

// Iniciar sesión emprendedor
export const loginEmprendedor = (credentials) => api.post('/login', credentials);

// Actualizar contraseña
export const updatePassword = (passwordData) => api.patch('/password', passwordData);

// Actualizar estado del emprendedor

export const updateEstadoEmprendedor = (estadoData) => api.patch('/estado', estadoData);

// Correo para recuperar cntraseña
export const recuperarContrasenaEmprendedor = async(correo_electronico) => {
    try {
        const response = await axios.post(`${API_URL}/recuperar`, { correo_electronico });
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

// Resetear la contraseña del emprendedor
export const resetPasswordEmprendedor = async (token, contrasenaActual, nuevaContrasena) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password-emprendedor/${token}`, { contrasenaActual, nuevaContrasena });
        return response.data;
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        throw error;
    }
};

// Obtener emprendedores por estado
export const getEmprendedoresPorEstado = async (estado) => {
    try {
        const response = await api.get(`/estado?estado=${estado}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los emprendedores por estado', error);
        throw error;
    }
};
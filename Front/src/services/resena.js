import axios from 'axios';

// Configuración base para el API de reseñas
const API_URL = 'http://localhost:3000/api/resena';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para incluir el token de autorización
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Crear una nueva reseña
export const crearResena = async (resenaData) => {
    try {
        const response = await api.post('/', resenaData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la reseña:", error);
        throw error.response?.data || error.message;
    }
};

// Actualizar una reseña existente
export const actualizarResena = async (idResena, resenaData) => {
    try {
        const response = await api.put(`/${idResena}`, resenaData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la reseña:", error);
        throw error.response?.data || error.message;
    }
};

// Eliminar una reseña por su ID
export const eliminarResena = async (idResena) => {
    try {
        const response = await api.delete(`/${idResena}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la reseña:", error);
        throw error.response?.data || error.message;
    }
};

// Consultar reseñas por cliente
export const consultarResenaCliente = async (idCliente) => {
    try {
        const response = await api.get(`/cliente/${idCliente}`);
        return response.data;
    } catch (error) {
        console.error("Error al consultar las reseñas del cliente:", error);
        throw error.response?.data || error.message;
    }
};

// Consultar reseñas por producto
export const consultarResenaProducto = async (codProducto) => {
    try {
        const response = await api.get(`/producto/${codProducto}`);
        return response.data;
    } catch (error) {
        console.error("Error al consultar las reseñas del producto:", error);
        throw error.response?.data || error.message;
    }
};

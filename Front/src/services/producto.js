import axios from 'axios';

const API_URL = 'http://localhost:3000/api/producto';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Crear producto
export const crearProducto = (producto) => {
    const formData = new FormData();

    // Agregar los campos de producto a FormData
    for (const key in producto) {
        if (key === 'imagen') {
            formData.append('imagen', producto.imagen);
        } else {
            formData.append(key, producto[key]);
        }
    }

    // Enviar la solicitud POST con el FormData
    return api.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


export const obtenerProductosPorEmprendedor = async (id_emprendedor) => {
    try {
        const response = await api.get(`/emprendedor/${id_emprendedor}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener productos por emprendedor:", error);
        throw error;
    }
};
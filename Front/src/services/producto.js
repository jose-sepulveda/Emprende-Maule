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
// Obtener todos los productos
export const getProductos = () => api.get('/list');

// Obtener un producto por ID
export const getProducto = (cod_producto) => api.get(`/${cod_producto}`);

// Crear producto
export const crearProducto = (producto) => {
    const formData = new FormData();
    for (const key in producto) {
        formData.append(key, producto[key]);
    }

    return api.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

// Actualizar producto
export const updateProducto = (cod_producto, producto) => api.put(`/${cod_producto}`, producto);

// Eliminar un producto
export const deleteProducto = (cod_producto) => api.delete(`/${cod_producto}`);

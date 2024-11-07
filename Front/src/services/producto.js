import axios from "axios";

const API_URL = "http://localhost:3000/api/productos"; // URL de la API

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para incluir el token en las solicitudes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Función para obtener todos los productos
export const getProductos = () => api.get("/list");

// Función para obtener un producto por su código
export const getProducto = (cod_producto) => api.get(`/${cod_producto}`);

// Función para crear un nuevo producto
export const crearProducto = (producto) => {
    const formData = new FormData();
    for (const key in producto) {
        formData.append(key, producto[key]);
    }
    return api.post("/new", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Para el envío de archivos
        },
    });
};

// Función para actualizar un producto
export const updateProducto = (cod_producto, producto) => api.put(`/${cod_producto}`, producto);

// Función para eliminar un producto
export const deleteProducto = (cod_producto) => api.delete(`/${cod_producto}`);

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/producto';

// Obtener todos los productos
export const getProductos = () => axios.get(`${API_URL}/list`);

// Obtener un producto por su ID
export const getProductoById = (id_producto) => axios.get(`${API_URL}/${id_producto}`);

// Crear un nuevo producto
export const createProducto = (productoData) => axios.post(API_URL, productoData);

// Actualizar un producto existente
export const updateProducto = (id_producto, productoData) => axios.put(`${API_URL}/${id_producto}`, productoData);

// Eliminar un producto
export const deleteProducto = (id_producto) => axios.delete(`${API_URL}/${id_producto}`);

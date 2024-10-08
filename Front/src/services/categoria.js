// services/categoria.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/categoria';

// Obtener todas las categorías
export const getCategorias = () => axios.get(`${API_URL}/list`);

// Obtener una categoría por su ID
export const getCategoriaById = (id_categoria) => axios.get(`${API_URL}/${id_categoria}`);

// Crear una nueva categoría
export const createCategoria = (categoria) => axios.post(API_URL, categoria);

// Actualizar una categoría existente
export const updateCategoria = (id_categoria, categoria) => axios.put(`${API_URL}/${id_categoria}`, categoria);

// Eliminar una categoría
export const deleteCategoria = (id_categoria) => axios.delete(`${API_URL}/${id_categoria}`);

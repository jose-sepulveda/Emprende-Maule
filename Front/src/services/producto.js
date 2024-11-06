// src/services/productoService.js

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/productos'; // Reemplaza con tu URL de backend

// Función para crear un nuevo producto
export const crearProducto = async (productoData) => {
  try {
    const response = await axios.post(`${API_URL}/`, productoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error;
  }
};

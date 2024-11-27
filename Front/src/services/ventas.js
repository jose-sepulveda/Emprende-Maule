import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ventas';  

// Función para crear una venta
export const createVenta = async (id_cliente, productos) => {
  try {
    const response = await axios.post(`${API_URL}/${id_cliente}`, { productos });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la venta: ' + error.message);
  }
};

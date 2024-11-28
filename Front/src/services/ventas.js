import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ventas';  

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Corregir la interpolación de la cadena
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Función para crear una venta
export const createVenta = async (id_cliente, productos) => {
  try {
    const response = await axios.post(`${API_URL}/${id_cliente}`, { productos });  // Usar backticks
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la venta: ' + error.message);
  }
};

// Función para obtener las ventas de un cliente
export const getVentasCliente = async (id_cliente) => {
  try {
    const response = await axios.get(`${API_URL}/cliente/${id_cliente}`);  // Usar backticks
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las ventas del cliente: ' + error.message);
  }
};

// Función para eliminar una venta
export const deleteVenta = async (id_venta) => {
  try {
    const response = await api.delete(`${API_URL}/${id_venta}`);  // Usar backticks
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la venta: ' + error.message);
  }
};

// Crear una transacción Webpay
export const createWebpayTransaction = async (amount, sessionId, buyOrder, returnUrl) => {
  try {
    const response = await axios.post('http://localhost:3000/api/webpay/create', {
      amount,
      sessionId,
      buyOrder,
      returnUrl
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al crear la transacción con Webpay: ' + error.message);
  }
};

// Confirmar la transacción Webpay
export const confirmWebpayTransaction = async (token_ws) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/webpay/commit?token_ws=${token_ws}`);  // Usar backticks
    return response.data;
  } catch (error) {
    throw new Error('Error al confirmar la transacción con Webpay: ' + error.message);
  }
};

// Función para obtener una venta por id_venta
export const getVenta = async (id_venta) => {
  try {
    const response = await axios.get(`${API_URL}/${id_venta}`);  // Usar backticks
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la venta: ' + error.message);
  }
};

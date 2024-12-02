import axios from "axios";

const API_URL = "http://localhost:3000/api/venta_productos";

export const getVentaProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/list`);
    return response.data; 
  } catch (error) {
    console.error("Error al obtener ventas productos:", error);
    throw error;
  }
};

export const getVentaProductosVenta = async (idVenta) => {
  try {
    const response = await axios.get(`${API_URL}/venta/${idVenta}`);
    return response.data; 
  } catch (error) {
    console.error(`Error al obtener productos de venta ${idVenta}:`, error);
    throw error;
  }
};

export const getVentaProducto = async (idVentaProducto) => {
  try {
    const response = await axios.get(`${API_URL}/${idVentaProducto}`);
    return response.data; 
  } catch (error) {
    console.error(`Error al obtener el producto de venta ${idVentaProducto}:`, error);
    throw error;
  }
};


export const updateVentaProducto = async (idVentaProducto, data) => {
  try {
    const response = await axios.put(`${API_URL}/${idVentaProducto}`, data);
    return response.data; 
  } catch (error) {
    console.error(`Error al actualizar producto de venta ${idVentaProducto}:`, error);
    throw error;
  }
};


export const deleteVentaProducto = async (idVentaProducto) => {
  try {
    const response = await axios.delete(`${API_URL}/${idVentaProducto}`);
    return response.data; 
  } catch (error) {
    console.error(`Error al eliminar producto de venta ${idVentaProducto}:`, error);
    throw error;
  }
};

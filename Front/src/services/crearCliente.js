import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cliente';

// Crear un nuevo cliente
export const createCliente = (cliente) => axios.post(`${API_URL}/`, cliente);

// Actualizar un cliente existente
export const updateCliente = (id_cliente, cliente) => axios.put(`${API_URL}/${id_cliente}`, cliente);

// Eliminar un cliente
export const deleteCliente = (id_cliente) => axios.delete(`${API_URL}/${id_cliente}`);

// Iniciar sesión para cliente
export const loginCliente = (credentials) => axios.post(`${API_URL}/login`, credentials);

// Restablecer contraseña de cliente
export const resetContrasena = (correo, nuevaContrasena) => axios.post(`${API_URL}/reset`, { correo, nuevaContrasena });

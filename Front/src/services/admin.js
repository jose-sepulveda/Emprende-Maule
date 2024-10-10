import axios from 'axios';

const API_URL = 'http://localhost:3000/api/administrador'; // Cambia a 'administrador'

// Obtener todos los administradores
export const getAdministradores = () => axios.get(`${API_URL}/list`);

// Obtener un administrador por su ID
export const getAdministradorById = (id_administrador) => axios.get(`${API_URL}/${id_administrador}`);

// Crear un nuevo administrador
export const createAdministrador = (administrador) => axios.post(`${API_URL}/`, administrador);

// Actualizar un administrador existente
export const updateAdministrador = (id_administrador, administrador) => axios.put(`${API_URL}/${id_administrador}`, administrador);

// Eliminar un administrador
export const deleteAdministrador = (id_administrador) => axios.delete(`${API_URL}/${id_administrador}`);

// Iniciar sesión para administrador
export const loginAdministrador = (credentials) => axios.post(`${API_URL}/login`, credentials);

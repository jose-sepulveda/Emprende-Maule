import axios from 'axios';

const API_URL = 'http://localhost:3000/api/administrador'; 

// Obtener todos los administradores
export const getAdministradores = () => axios.get(`${API_URL}/list`);

// Obtener un administrador por su ID
export const getAdminById = (id_administrador) => axios.get(`${API_URL}/${id_administrador}`);

// Crear un nuevo administrador
export const createAdmin = (administrador) => axios.post(API_URL, administrador);

// Actualizar un administrador existente
export const updateAdmin = (id_administrador, administrador) => axios.put(`${API_URL}/${id_administrador}`, administrador);

// Eliminar un administrador
export const deleteAdmin = (id_administrador) => axios.delete(`${API_URL}/${id_administrador}`);

// Iniciar sesión para administrador
export const loginAdmin = (credentials) => axios.post(`${API_URL}/login`, credentials);

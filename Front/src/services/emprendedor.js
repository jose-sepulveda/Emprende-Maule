import axios from "axios";

const API_URL = 'http://localhost:3000/api/emprendedor';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

// Obtener todos los emprendedores
export const getEmprendedores = () => api.get('/list');

// Obtener un emprendedor por ID
export const getEmprendedor = (rut_emprendedor) => api.get(`/${rut_emprendedor}`);

// Crear emprendedor
export const crearEmprendedor = (emprendedor) => {
    const formData = new FormData();
    for (const key in emprendedor) {
        formData.append(key, emprendedor[key]);
    }
    return api.post('/new', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

// Actualizar emprendedor
export const updateEmprendedor = (rut_emprendedor, emprendedor) => api.put(`/${rut_emprendedor}`, emprendedor);

// Eliminar un emprendedor
export const deleteEmprendedor = (rut_emprendedor) => api.delete(`/${rut_emprendedor}`);

// Iniciar sesión emprendedor
export const loginEmprendedor = (credentials) => api.post('/login', credentials);

// Actualizar contraseña
export const updatePassword = (passwordData) => api.patch('/password', passwordData);

// Actualizar estado del emprendedor

export const updateEstadoEmprendedor = (estadoData) => api.patch('/estado', estadoData);
import axios from "axios";

const API_URL = 'http://localhost:3000/api/carro_productos';

export const getCarrosProductos = (id_cliente) => axios.get(`${API_URL}/list/${id_cliente}`);

export const getOneCarroProductos = (id_carro_productos) => axios.get(`${API_URL}/${id_carro_productos}`);

export const updateCarroProductos = (id_carro_productos, carroProductos) => axios.put(`${API_URL}/${id_carro_productos}`, carroProductos);

export const deleteCarroProductos = (id_carro_productos) => axios.delete(`${API_URL}/${id_carro_productos}`);

export const carroLocal = (id_cliente, productos) => axios.post(`${API_URL}/llenar`, { id_cliente: id_cliente, productos });
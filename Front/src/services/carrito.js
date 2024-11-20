import axios from 'axios';

const API_URL = 'http://localhost:3000/api/carro';

export const getCarros = () => axios.get(`${API_URL}/list`);

export const getCarro = (id_cliente) => axios.get(`${API_URL}/${id_cliente}`);

export const newCarro = (carro) => axios.post(API_URL, carro);

export const updateCarro = (id_carro, carro) => axios.put(`${API_URL}/${id_carro}`, carro);

export const deleteCarro = (id_carro) => axios.delete(`${API_URL}/${id_carro}`);
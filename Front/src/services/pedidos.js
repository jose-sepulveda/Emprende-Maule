import axios from "axios";

const API_URL = 'http://localhost:3000/api/pedidos';

export const getPedidos = () => axios.get(`${API_URL}/list`);

export const getPedido = (id_cliente) => axios.get(`${API_URL}/${id_cliente}`);

export const getPedidoByCliente = (id_cliente) => axios.get(`${API_URL}/cliente/${id_cliente}`);

export const getPedidoByEmprendedor = (id_emprendedor) => axios.get(`${API_URL}/emprendedor/${id_emprendedor}`);

export const updateEstadoPedido = (id_pedido, estado_pedido) => axios.put(`${API_URL}/${id_pedido}`, estado_pedido);
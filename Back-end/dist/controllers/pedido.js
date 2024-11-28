"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstadoPedido = exports.getPedidoByEmprendedor = exports.getPedidoByCliente = exports.getPedido = exports.getPedidos = void 0;
const pedidos_1 = require("../models/pedidos");
const ventas_1 = require("../models/ventas");
const producto_1 = require("../models/producto");
const emprendedor_1 = require("../models/emprendedor");
const cliente_1 = require("../models/cliente");
const getPedidos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pedidos = yield pedidos_1.Pedidos.findAll();
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener los pedidos", error });
    }
});
exports.getPedidos = getPedidos;
const getPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_pedido } = req.params;
    try {
        const pedido = yield pedidos_1.Pedidos.findOne({
            where: { id_pedido },
            include: [
                { model: cliente_1.Cliente, attributes: ['nombre_cliente', 'apellido1_cliente', 'apellido2_cliente', 'direccion', 'telefono'] },
                { model: producto_1.Productos, attributes: ['nombre_producto', 'id_emprendedor'] },
                { model: emprendedor_1.Emprendedor, attributes: ['nombre_emprendedor', 'apellido1_emprendedor', 'apellido2_emprendedor', 'direccion', 'telefono', 'correo_electronico'] }
            ]
        });
        if (!pedido) {
            return res.status(404).json({ msg: "El pedido no existe" });
        }
        res.json(pedido);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener el pedido", error });
    }
});
exports.getPedido = getPedido;
const getPedidoByCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    try {
        const pedidos = yield pedidos_1.Pedidos.findAll({
            where: { id_cliente },
            include: [
                {
                    model: ventas_1.Ventas,
                    where: { id_cliente },
                    include: [
                        {
                            model: producto_1.Productos,
                            attributes: ['nombre_producto', 'descripcion_producto', 'id_categoria']
                        },
                    ],
                },
            ],
        });
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener los pedidos del cliente", error });
    }
});
exports.getPedidoByCliente = getPedidoByCliente;
const getPedidoByEmprendedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_emprendedor } = req.params;
    try {
        const pedidos = yield pedidos_1.Pedidos.findAll({
            where: { id_emprendedor },
            include: [{ model: producto_1.Productos }, { model: cliente_1.Cliente }]
        });
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener los pedidos del emprendedor", error });
    }
});
exports.getPedidoByEmprendedor = getPedidoByEmprendedor;
const updateEstadoPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_pedido } = req.params;
    const { estado_pedido } = req.body;
    try {
        const pedido = yield pedidos_1.Pedidos.findByPk(id_pedido);
        if (!pedido) {
            return res.status(404).json({ msg: "El pedido no existe" });
        }
        yield pedido.update({ estado_pedido });
        res.json({ msg: "Estado del pedido actualizado correctamente" });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al actualizar el estado del pedido", error });
    }
});
exports.updateEstadoPedido = updateEstadoPedido;

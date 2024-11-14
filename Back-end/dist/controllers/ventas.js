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
exports.deleteVenta = exports.createVenta = exports.getVentaCliente = exports.getVenta = exports.getVentas = void 0;
const ventas_1 = require("../models/ventas");
const producto_1 = require("../models/producto");
const carro_productos_1 = require("../models/carro_productos");
const carro_1 = require("../models/carro");
const venta_productos_1 = require("../models/venta_productos");
const cliente_1 = require("../models/cliente");
const getVentas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listVentas = yield ventas_1.Ventas.findAll();
        res.json(listVentas);
    }
    catch (error) {
        res.status(500).json({
            msg: "Error al obtener las ventas",
            error
        });
    }
});
exports.getVentas = getVentas;
const getVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_venta } = req.params;
    try {
        const idVenta = yield ventas_1.Ventas.findOne({ where: { id_venta: id_venta } });
        if (!idVenta) {
            return res.status(404).json({
                msg: "La venta no existe"
            });
        }
        res.json(idVenta);
    }
    catch (error) {
        return res.status(400).json({
            msg: "Error al obtener la venta",
            error
        });
    }
});
exports.getVenta = getVenta;
const getVentaCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    try {
        const listVentas = yield ventas_1.Ventas.findAll({ where: { id_cliente: id_cliente } });
        res.json(listVentas);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al obtener las ventas del cliente",
            error
        });
    }
});
exports.getVentaCliente = getVentaCliente;
const createVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    try {
        const idCliente = yield cliente_1.Cliente.findOne({ where: { id_cliente } });
        if (!idCliente) {
            return res.status(400).json({ msg: `El cliente ${id_cliente} no existe` });
        }
        //if (!idCliente.dataValues.estado_cliente) {
        //return res.json({ msg: "Debes realizar el pago del carrito primero" });
        //}
        const fechaActual = new Date();
        //const dia = fechaActual.getDate();
        //const mes = fechaActual.getMonth() + 1;
        //const anio = fechaActual.getFullYear();
        //const hora = fechaActual.getHours();
        const fechaFormateada = fechaActual.toISOString().split('T')[0];
        const venta = yield ventas_1.Ventas.create({
            id_cliente: id_cliente,
            fecha_venta: fechaFormateada,
            subtotal: 0,
            iva: 0,
            descuentos: 0,
            total: 0,
            metodo_de_pago: " "
        });
        const carroCliente = yield carro_1.Carro.findOne({ where: { id_cliente } });
        const idCarroCliente = carroCliente === null || carroCliente === void 0 ? void 0 : carroCliente.dataValues.id_carro;
        const listCarroProductos = yield carro_productos_1.Carro_productos.findAll({ where: { id_carro: idCarroCliente } });
        if (!listCarroProductos || listCarroProductos.length === 0) {
            return res.json({ msg: "No hay productos en el carrito" });
        }
        let subtotalVenta = 0;
        for (const carroProductos of listCarroProductos) {
            const { cod_producto, cantidad, subtotal } = carroProductos.dataValues;
            const idVenta = venta.dataValues.id_venta;
            yield venta_productos_1.Venta_productos.create({
                id_venta: idVenta,
                cod_producto,
                cantidad,
                subtotal
            });
            subtotalVenta += subtotal;
            const producto = yield producto_1.Productos.findOne({ where: { cod_producto } });
            if (producto) {
                const cantidadActual = producto.dataValues.cantidad_disponible - cantidad;
                yield producto.update({ cantidad_disponible: cantidadActual });
            }
            yield carroProductos.destroy();
        }
        yield carro_1.Carro.update({ total: 0 }, { where: { id_cliente } });
        //const listVentaProductos = await Venta_productos.findAll({ where: { id_venta: venta.dataValues.id_venta} });
        //let subtotalVenta = 0;
        //for (const ventasProducto of listVentaProductos) {
        //const subtotalProducto = ventasProducto.dataValues.subtotal || 0;
        //subtotalVenta += subtotalProducto;
        //}
        const iva = subtotalVenta * 0.19;
        const total = subtotalVenta + iva;
        yield venta.update({
            estado_de_venta: true,
            subtotal: subtotalVenta,
            iva: iva,
            total: total
        });
        return res.status(201).json({
            msg: "Venta realizada correctamente",
            venta: {
                id_venta: venta.dataValues.id_venta,
                total: total,
                subtotal: subtotalVenta,
                iva: iva,
                fecha_venta: venta.dataValues.fecha_venta.toISOString().split('T')[0],
            }
        });
    }
    catch (error) {
        return res.status(400).json({
            msg: "Error al realizar la venta",
            error
        });
    }
});
exports.createVenta = createVenta;
const deleteVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_venta } = req.params;
    const venta = yield ventas_1.Ventas.findByPk(id_venta);
    if (!venta) {
        return res.status(404).json({
            msg: "La venta no existe",
        });
    }
    try {
        yield venta.destroy();
        res.json({
            msg: "Venta eliminada correctamente",
        });
    }
    catch (error) {
        return res.status(400).json({
            msg: "Error al eliminar la venta",
            error,
        });
    }
});
exports.deleteVenta = deleteVenta;

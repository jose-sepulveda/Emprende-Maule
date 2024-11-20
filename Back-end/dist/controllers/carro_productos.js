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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carroLocal = exports.deleteCarroProductos = exports.updateCarroProductos = exports.getOneCarroProductos = exports.getCarrosProductos = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const carro_1 = require("../models/carro");
const carro_productos_1 = require("../models/carro_productos");
const cliente_1 = require("../models/cliente");
const producto_1 = require("../models/producto");
const getCarrosProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_cliente } = req.params;
        const idCliente = yield cliente_1.Cliente.findOne({ where: { id_cliente } });
        if (!idCliente) {
            return res.status(400).json({ msg: "El cliente no existe " });
        }
        let carro = yield carro_1.Carro.findOne({ where: { id_cliente } });
        if (!carro) {
            carro = yield carro_1.Carro.create({ id_cliente, total: 0 });
        }
        const carroProductos = yield carro_productos_1.Carro_productos.findAll({
            include: [
                { model: carro_1.Carro, attributes: ['id_carro'] },
                { model: producto_1.Productos, attributes: ['nombre_producto', 'precio_producto'] }
            ],
            attributes: ['id_carro_productos', 'cantidad', 'subtotal'],
            where: { id_carro: carro.dataValues.id_carro }
        });
        return res.json(carroProductos);
    }
    catch (error) {
        console.error('Error al obtener los productos del carro', error);
        return res.status(500).json({ error: "Error al obtener los productos del carro" });
    }
});
exports.getCarrosProductos = getCarrosProductos;
const getOneCarroProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_carro_productos } = req.params;
    try {
        const carroProductos = yield carro_productos_1.Carro_productos.findByPk(id_carro_productos, {
            include: [
                { model: carro_1.Carro, attributes: ['id_carro'] },
                { model: producto_1.Productos, attributes: ['nombre_producto'] }
            ]
        });
        if (!carroProductos) {
            return res.status(404).json({ error: "Producto no encontrado en el carro" });
        }
        return res.json(carroProductos);
    }
    catch (error) {
        console.error("Error al obtener el producto del carro", error);
        return res.status(500).json({ error: "Error al obtener el producto del carro." });
    }
});
exports.getOneCarroProductos = getOneCarroProductos;
const updateCarroProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_carro_productos } = req.params;
    const { id_carro, cod_producto, cantidad, subtotal } = req.body;
    try {
        const carroProductos = yield carro_productos_1.Carro_productos.findByPk(id_carro_productos);
        if (!carroProductos) {
            return res.status(404).json({ error: "Producto del carrito no encontrado. " });
        }
        yield carroProductos.update({
            id_carro,
            cod_producto,
            cantidad,
            subtotal
        });
        return res.json(carroProductos);
    }
    catch (error) {
        console.error("Error al actualizar el producto del carro: ", error);
        return res.status(500).json({ error: "Error al actualizar el producto del carro." });
    }
});
exports.updateCarroProductos = updateCarroProductos;
const deleteCarroProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_carro_productos } = req.params;
    try {
        const carroProductos = yield carro_productos_1.Carro_productos.findByPk(id_carro_productos);
        if (!carroProductos) {
            return res.status(404).json({ error: "Producto no encontrado en el carro." });
        }
        yield carroProductos.destroy();
        return res.json({ msg: "Producto eliminado correctamente del carro. " });
    }
    catch (error) {
        console.error("Error al eliminar el prodcuto del carro:", error);
        return res.status(500).json({ error: "Error al eliminar producto del carro. " });
    }
});
exports.deleteCarroProductos = deleteCarroProductos;
const carroLocal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente, productos } = req.body;
    if (!productos || !Array.isArray(productos)) {
        return res.status(400).json({ error: "Los productos deben ser un array" });
    }
    const transaccion = yield connection_1.default.transaction();
    try {
        let carro = yield carro_1.Carro.findOne({ where: { id_cliente }, transaction: transaccion });
        if (!carro) {
            carro = yield carro_1.Carro.create({ id_cliente }, { transaction: transaccion });
        }
        let totalCarro = carro.dataValues.total || 0;
        for (const producto of productos) {
            if (!producto.cod_producto || !producto.cantidad) {
                yield transaccion.rollback();
                return res.status(400).json({ msg: "Formato de producto incorrecto. Cada producto debe tener 'cod_producto' y 'cantidad'" });
            }
            let carroProductos = yield carro_productos_1.Carro_productos.findOne({
                where: { id_carro: carro === null || carro === void 0 ? void 0 : carro.dataValues.id_carro, cod_producto: producto.cod_producto },
                transaction: transaccion
            });
            let idProducto = yield producto_1.Productos.findOne({ where: { cod_producto: producto.cod_producto }, transaction: transaccion });
            if (!idProducto) {
                yield transaccion.rollback();
                return res.status(400).json({ msg: "El producto no existe" });
            }
            const precioFinal = idProducto.dataValues.descuento > 0
                ? idProducto.dataValues.precio_descuento
                : idProducto.dataValues.precio_producto;
            if (carroProductos) {
                let cantidadCarroActual = carroProductos.dataValues.cantidad;
                let subtotalCarroActual = carroProductos.dataValues.subtotal;
                yield carroProductos.update({
                    cod_producto: producto.cod_producto,
                    cantidad: producto.cantidad + cantidadCarroActual,
                    subtotal: subtotalCarroActual + (precioFinal * producto.cantidad)
                }, { transaction: transaccion });
                yield carroProductos.save({ transaction: transaccion });
                totalCarro += precioFinal * producto.cantidad;
            }
            else {
                yield carro_productos_1.Carro_productos.create({
                    id_carro: carro === null || carro === void 0 ? void 0 : carro.dataValues.id_carro,
                    cod_producto: producto.cod_producto,
                    cantidad: producto.cantidad,
                    subtotal: producto.cantidad * precioFinal
                }, { transaction: transaccion });
                totalCarro += producto.cantidad * precioFinal;
            }
        }
        yield carro.update({ total: totalCarro }, { transaction: transaccion });
        yield transaccion.commit();
        res.json({ msg: "Carro actualizado correctamente" });
    }
    catch (error) {
        yield transaccion.rollback();
        console.error("Error al actualizar el carro: ", error);
        res.status(500).json({ error: "Error al actualizar el carro" });
    }
});
exports.carroLocal = carroLocal;

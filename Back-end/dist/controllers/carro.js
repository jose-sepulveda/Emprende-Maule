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
exports.deletCarro = exports.updateCarro = exports.getCarros = exports.getCarro = exports.newCarro = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const carro_1 = require("../models/carro");
const carro_productos_1 = require("../models/carro_productos");
const cliente_1 = require("../models/cliente");
const producto_1 = require("../models/producto");
const newCarro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente, cantidad, cod_producto } = req.body;
    if (!id_cliente || !cantidad || !cod_producto) {
        return res.status(400).json({
            msg: "Faltan datos requeridos",
        });
    }
    const transaccion = yield connection_1.default.transaction();
    try {
        let carro = yield carro_1.Carro.findOne({ where: { id_cliente: id_cliente } });
        if (!carro) {
            carro = yield carro_1.Carro.create({
                "id_cliente": id_cliente,
                "total": 0,
            }, { transaction: transaccion });
        }
        const idCarro = carro.dataValues.id_carro;
        if (cantidad > 0) {
            const productos = yield producto_1.Productos.findOne({ attributes: ['precio_producto', 'descuento', 'precio_descuento', 'cantidad_disponible'], where: { cod_producto: cod_producto }, transaction: transaccion });
            if (!productos) {
                yield transaccion.rollback();
                return res.status(400).json({
                    msg: "El producto ingresado no existe",
                });
            }
            const cantidadDisponible = productos.dataValues.cantidad_disponible - cantidad;
            if (cantidadDisponible < 0) {
                yield transaccion.rollback();
                return res.status(400).json({
                    msg: "No hay stock suficiente",
                });
            }
            const precioFinal = productos.dataValues.descuento > 0
                ? productos.dataValues.precio_descuento
                : productos.dataValues.precio_producto;
            const subTotal = precioFinal * cantidad;
            const carroActual = yield carro_1.Carro.findOne({
                attributes: ['total'],
                where: { id_carro: idCarro },
                transaction: transaccion,
            });
            const totalActual = carroActual === null || carroActual === void 0 ? void 0 : carroActual.dataValues.total;
            let carroProductos = yield carro_productos_1.Carro_productos.findOne({
                where: { id_carro: idCarro, cod_producto: cod_producto },
                transaction: transaccion,
            });
            if (carroProductos) {
                const cantidadCarroActual = carroProductos.dataValues.cantidad;
                const subtotalCarroActual = carroProductos.dataValues.subtotal;
                yield carroProductos.update({
                    cantidad: cantidad + cantidadCarroActual,
                    subtotal: subTotal + subtotalCarroActual,
                }, { transaction: transaccion });
                yield carro_1.Carro.update({
                    total: totalActual + subTotal,
                }, {
                    where: { id_carro: idCarro },
                    transaction: transaccion,
                });
            }
            else {
                yield carro_productos_1.Carro_productos.create({
                    id_carro: idCarro,
                    cod_producto: cod_producto,
                    cantidad: cantidad,
                    subtotal: subTotal,
                }, { transaction: transaccion });
                yield carro_1.Carro.update({
                    total: totalActual + subTotal,
                }, {
                    where: { id_carro: idCarro },
                    transaction: transaccion,
                });
            }
            yield producto_1.Productos.update({
                cantidad_disponible: cantidadDisponible,
            }, {
                where: { cod_producto: cod_producto },
                transaction: transaccion,
            });
            yield transaccion.commit();
            return res.status(201).json({
                msg: "Producto ingresado correctamente al carrito",
            });
        }
        else {
            yield transaccion.rollback();
            return res.status(400).json({
                msg: "La cantidad debe ser mayor a 0",
            });
        }
    }
    catch (error) {
        yield transaccion.rollback();
        return res.status(400).json({
            msg: "Ha ocurrido un error al ingresar el producto al carrito",
            error,
        });
    }
});
exports.newCarro = newCarro;
const getCarro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    try {
        const carro = yield carro_1.Carro.findOne({ where: { id_cliente: id_cliente } });
        if (!carro) {
            return res.status(404).json({
                msg: "El carro no existe",
            });
        }
        res.json(carro);
    }
    catch (error) {
        res.status(500).json({
            msg: "Error al obtener el carro",
            error
        });
    }
});
exports.getCarro = getCarro;
const getCarros = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listCarros = yield carro_1.Carro.findAll();
        res.json(listCarros);
    }
    catch (error) {
        res.status(500).json({
            msg: "Error al obtener los carros",
            error
        });
    }
});
exports.getCarros = getCarros;
const updateCarro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_carro } = req.params;
    const { id_cliente } = req.body;
    if (!id_carro || !id_cliente) {
        return res.status(400).json({
            msg: "Faltan datos requeridos"
        });
    }
    const transaccion = yield connection_1.default.transaction();
    try {
        const carro = yield carro_1.Carro.findByPk(id_carro, { transaction: transaccion });
        if (!carro) {
            yield transaccion.rollback();
            return res.status(404).json({
                msg: "El carro no existe",
            });
        }
        const cliente = yield cliente_1.Cliente.findByPk(id_cliente, { transaction: transaccion });
        if (!cliente) {
            yield transaccion.rollback();
            return res.status(400).json({
                msg: "El usuario no existe",
            });
        }
        yield carro.update({
            "id_cliente": id_cliente,
        }, { transaction: transaccion });
        yield transaccion.commit();
        return res.json({
            msg: "Carro actualizado correctamente",
            carro,
        });
    }
    catch (error) {
        yield transaccion.rollback();
        console.error("Error al actualizar el carro", error);
        return res.status(400).json({
            msg: "Ha ocurrido un error al actualizar la información del carro",
            error
        });
    }
});
exports.updateCarro = updateCarro;
const deletCarro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_carro } = req.params;
    if (!id_carro) {
        return res.status(400).json({
            msg: "Falta el id_carro en la solicitud",
        });
    }
    const transaccion = yield connection_1.default.transaction();
    try {
        const carro = yield carro_1.Carro.findByPk(id_carro, { transaction: transaccion });
        if (!carro) {
            yield transaccion.rollback();
            return res.status(404).json({
                msg: "El carro no existe",
            });
        }
        yield carro.destroy({ transaction: transaccion });
        yield transaccion.commit();
        return res.json({
            msg: "Carro eliminado correctamente",
        });
    }
    catch (error) {
        yield transaccion.rollback();
        console.error("Error al eliminar el carro", error);
        return res.status(400).json({
            msg: "Ha ocurrido un error al eliminar el carro",
            error
        });
    }
});
exports.deletCarro = deletCarro;

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
exports.consultarResenaProducto = exports.consultarResenaCliente = exports.eliminarResena = exports.actualizarResena = exports.crearResena = void 0;
const resena_1 = require("../models/resena");
const cliente_1 = require("../models/cliente");
const producto_1 = require("../models/producto");
const crearResena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { calificación, resena, id_cliente, cod_producto } = req.body;
    if (calificación < 1 || calificación > 5) {
        return res.status(400).json({
            message: 'La calificación debe estar entre 1 y 5'
        });
    }
    try {
        const cliente = yield cliente_1.Cliente.findByPk(id_cliente, {
            attributes: ['nombre_cliente', 'apellido1_cliente', 'apellido2_cliente']
        });
        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente no encontrado'
            });
        }
        const nuevaResena = yield resena_1.Resena.create({
            "calificación": calificación,
            "resena": resena,
            "id_cliente": id_cliente,
            "cod_producto": cod_producto
        });
        return res.status(201).json({
            message: 'Reseña creada con éxito',
            resena: nuevaResena,
            cliente: {
                nombre: cliente.getDataValue("nombre_cliente"),
                apellido1: cliente.getDataValue("apellido1_cliente"),
                apellido2: cliente.getDataValue("apellido2_cliente")
            }
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error al crear la reseña',
            error
        });
    }
});
exports.crearResena = crearResena;
const actualizarResena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_resena } = req.params;
    const { calificación, resena } = req.body;
    if (calificación < 1 || calificación > 5) {
        return res.status(400).json({
            message: 'La calificación debe estar entre 1 y 5'
        });
    }
    const idResena = yield resena_1.Resena.findOne({ where: { id_resena: id_resena } });
    if (!idResena) {
        return res.status(404).json({
            message: 'Reseña no encontrada'
        });
    }
    try {
        yield resena_1.Resena.update({
            calificación: calificación,
            resena: resena
        }, { where: { id_resena: id_resena } });
        return res.status(201).json({
            message: 'Reseña actualizada con éxito'
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error al actualizar la reseña',
            error
        });
    }
});
exports.actualizarResena = actualizarResena;
const eliminarResena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_resena } = req.params;
    const idResena = yield resena_1.Resena.findOne({ where: { id_resena: id_resena } });
    if (!idResena) {
        return res.status(404).json({
            message: 'Reseña no encontrada'
        });
    }
    try {
        yield resena_1.Resena.destroy({ where: { id_resena: id_resena } });
        return res.json({
            message: 'Reseña eliminada con éxito'
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Ocurrió un error al eliminar la reseña',
            error
        });
    }
});
exports.eliminarResena = eliminarResena;
const consultarResenaCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    try {
        const resenas = yield resena_1.Resena.findAll({
            where: { id_cliente: id_cliente },
            include: [{ model: cliente_1.Cliente, attributes: ['nombre_cliente', 'apellido1_cliente', 'apellido2_cliente'] }]
        });
        if (resenas.length === 0) {
            return res.json({
                message: 'No hay reseñas para este cliente',
                resenas: []
            });
        }
        return res.json(resenas);
    }
    catch (error) {
        res.status(500).json({
            message: 'Ocurrió un error al consultar las reseñas',
            error
        });
    }
});
exports.consultarResenaCliente = consultarResenaCliente;
const consultarResenaProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod_producto } = req.params;
    try {
        const resenas = yield resena_1.Resena.findAll({
            where: { cod_producto: cod_producto },
            include: [{ model: producto_1.Productos, attributes: ['nombre_producto'] }]
        });
        if (resenas.length === 0) {
            return res.json({
                message: 'No hay reseñas para este producto',
                resenas: []
            });
        }
        return res.json(resenas);
    }
    catch (error) {
        res.status(500).json({
            message: 'Ocurrió un error al consultar las reseñas',
            error
        });
    }
});
exports.consultarResenaProducto = consultarResenaProducto;

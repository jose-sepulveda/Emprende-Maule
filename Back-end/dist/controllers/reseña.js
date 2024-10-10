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
exports.cosultarReseñaProducto = exports.consultarReseñaCliente = exports.eliminarReseña = exports.actualizarReseña = exports.crearReseña = void 0;
const rese_a_1 = require("../models/rese\u00F1a");
const cliente_1 = require("../models/cliente");
const producto_1 = require("../models/producto");
const crearReseña = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { calificación, reseña, } = req.body;
    if (calificación < 1 || calificación > 5) {
        return res.status(400).json({
            message: 'La calificación debe estar entre 1 y 5'
        });
    }
    try {
        yield rese_a_1.Reseña.create({
            "calificación": calificación,
            "reseña": reseña
        });
        return res.status(201).json({
            message: 'Reseña creada con exito'
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Ocurrio un error al crear la reseña',
            error
        });
    }
});
exports.crearReseña = crearReseña;
const actualizarReseña = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_reseña } = req.params;
    const { calificación, reseña } = req.body;
    if (calificación < 1 || calificación > 5) {
        return res.status(400).json({
            message: 'La calificación debe estar entre 1 y 5'
        });
    }
    const idReseña = yield rese_a_1.Reseña.findOne({ where: { id_reseña: id_reseña } });
    if (!idReseña) {
        return res.status(404).json({
            message: 'Reseña no encontrada'
        });
    }
    try {
        yield rese_a_1.Reseña.update({
            calificación: calificación,
            reseña: reseña
        }, { where: { id_reseña: id_reseña } });
        return res.status(201).json({
            message: 'Reseña actualizada con exito'
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Ocurrio un error al actualizar la reseña',
            error
        });
    }
});
exports.actualizarReseña = actualizarReseña;
const eliminarReseña = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_reseña } = req.params;
    const idReseña = yield rese_a_1.Reseña.findOne({ where: { id_reseña: id_reseña } });
    if (!idReseña) {
        return res.status(404).json({
            message: 'Reseña no encontrada'
        });
    }
    try {
        yield rese_a_1.Reseña.destroy({ where: { id_reseña: id_reseña } });
        return res.json({
            message: 'Reseña eliminada con exito'
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Ocurrio un error al eliminar la reseña',
            error
        });
    }
});
exports.eliminarReseña = eliminarReseña;
const consultarReseñaCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente } = req.params;
    try {
        const reseñas = yield rese_a_1.Reseña.findAll({
            where: { id_cliente: id_cliente },
            include: [{ model: cliente_1.Cliente, attributes: ['nombre_cliente', 'apellido1_cliente', 'apellido2_cliente'] }]
        });
        if (reseñas.length === 0) {
            return res.status(404).json({
                message: 'Reseñas no encontradas'
            });
        }
        return res.json(reseñas);
    }
    catch (error) {
        res.status(500).json({
            message: 'Ocurrio un error al consultar las reseñas',
            error
        });
    }
});
exports.consultarReseñaCliente = consultarReseñaCliente;
const cosultarReseñaProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_producto } = req.params;
    try {
        const reseñas = yield rese_a_1.Reseña.findAll({
            where: { id_producto: id_producto },
            include: [{ model: producto_1.Productos, attributes: ['nombre_producto'] }]
        });
        if (reseñas.length === 0) {
            return res.status(404).json({
                message: 'Reseñas no encontradas'
            });
        }
        return res.json(reseñas);
    }
    catch (error) {
        res.status(500).json({
            message: 'Ocurrio un error al consultar las reseñas',
            error
        });
    }
});
exports.cosultarReseñaProducto = cosultarReseñaProducto;

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
exports.updateVentaProducto = exports.deleteVentaProducto = void 0;
const venta_productos_1 = require("../models/venta_productos");
const deleteVentaProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_venta_productos } = req.params;
    const idVentaProducto = yield venta_productos_1.Venta_productos.findOne({ where: { id_venta_productos: id_venta_productos } });
    if (!idVentaProducto) {
        return res.status(404).json({ message: 'Venta producto no encontrado' });
    }
    try {
        yield venta_productos_1.Venta_productos.destroy({ where: { id_venta_productos: id_venta_productos } });
        return res.json({
            msg: 'Venta producto eliminado con exito',
        });
    }
    catch (error) {
        return res.status(400).json({
            msg: 'Error al eliminar venta producto',
            error
        });
    }
});
exports.deleteVentaProducto = deleteVentaProducto;
const updateVentaProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_venta_productos } = req.params;
    const { id_venta, cod_producto, cantidad } = req.body;
    const idVentaProducto = yield venta_productos_1.Venta_productos.findOne({ where: { id_venta_productos: id_venta_productos } });
    if (!idVentaProducto) {
        return res.status(404).json({ msg: 'El id del detalle de venta no existe' });
    }
    try {
        yield venta_productos_1.Venta_productos.update({
            id_venta: id_venta,
            cod_producto: cod_producto,
            cantidad: cantidad
        }, { where: { id_venta_productos: id_venta_productos } });
        return res.json({
            msg: 'Detalle de venta ' + id_venta_productos + ' actualizado correctamente'
        });
    }
    catch (error) {
        return res.status(400).json({
            msg: 'Error al actualizar el detalle de venta',
            error
        });
    }
});
exports.updateVentaProducto = updateVentaProducto;

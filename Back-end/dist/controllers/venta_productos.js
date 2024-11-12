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
exports.deleteVenta_Producto = void 0;
const venta_productos_1 = require("../models/venta_productos");
const deleteVenta_Producto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_venta_producto } = req.params;
    const idVentaProducto = yield venta_productos_1.Venta_productos.findOne({ where: { id_venta_producto: id_venta_producto } });
    if (!idVentaProducto) {
        return res.status(404).json({
            msg: "El detalle de venta: " + id_venta_producto + " no existe"
        });
    }
    try {
        yield venta_productos_1.Venta_productos.destroy({ where: { id_venta_producto: id_venta_producto } });
        res.json({
            msg: "El detalle de venta: " + id_venta_producto + " ha sido eliminado"
        });
    }
    catch (error) {
        return res.status(400).json({
            msg: "No se ha podido eliminar el detalle de venta: " + id_venta_producto,
            error
        });
    }
});
exports.deleteVenta_Producto = deleteVenta_Producto;

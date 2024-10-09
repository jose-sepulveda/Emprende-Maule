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
exports.newCarro = void 0;
const carro_1 = require("../models/carro");
const producto_1 = require("../models/producto");
const newCarro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_cliente, cantidad, cod_producto } = req.body;
    try {
        let carro = yield carro_1.Carro.findOne({ where: { id_cliente: id_cliente } });
        if (!carro) {
            carro = yield carro_1.Carro.create({
                "id_cliente": id_cliente,
                "total": 0,
            });
        }
        const idCarro = carro.dataValues.id_carro;
        if (cantidad > 0) {
            const idProductos = yield producto_1.Productos.findOne({ attributes: [''] });
        }
    }
    catch (error) {
    }
});
exports.newCarro = newCarro;

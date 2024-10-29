"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carro_productos_1 = require("../controllers/carro_productos");
const router = (0, express_1.Router)();
router.get('/list/:id_cliente', carro_productos_1.getCarrosProductos);
router.get('/:id_carro_productos', carro_productos_1.getOneCarroProductos);
router.put('/:id_carro_productos', carro_productos_1.updateCarroProductos);
router.delete('/:id_carro_productos', carro_productos_1.deleteCarroProductos);
router.post('/llenar', carro_productos_1.carroLocal);
exports.default = router;

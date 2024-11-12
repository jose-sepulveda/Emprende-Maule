"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventas_1 = require("../controllers/ventas");
const router = (0, express_1.Router)();
router.get('/list', ventas_1.getVentas);
router.get('/:id_venta', ventas_1.getVenta);
exports.default = router;

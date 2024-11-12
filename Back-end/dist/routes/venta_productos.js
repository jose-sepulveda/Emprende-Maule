"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const venta_productos_1 = require("../controllers/venta_productos");
const router = (0, express_1.Router)();
router.delete('/:id_venta_productos', venta_productos_1.deleteVentaProducto);
router.put('/:id_venta_productos', venta_productos_1.updateVentaProducto);
exports.default = router;

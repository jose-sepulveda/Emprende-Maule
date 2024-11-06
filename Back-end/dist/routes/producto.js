"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const producto_1 = require("../controllers/producto");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post('/', upload.single('imagen'), producto_1.newProducto);
router.get('/list', producto_1.getProductos);
router.get('/:cod_producto', producto_1.getProducto);
router.delete('/:cod_producto', producto_1.deleteProducto);
router.put('/:cod_producto', producto_1.updateProducto);
router.get('/categoria/:id_categoria', producto_1.getProductosByCategoria);
router.get('/emprendedor/:id_emprendedor', producto_1.getProductosByEmprendedor);
router.put('/:cod_producto/actualizar', upload.single('imagen'), producto_1.updateImagenYDescuento);
exports.default = router;

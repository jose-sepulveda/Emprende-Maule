"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const emprendedor_1 = require("../controllers/emprendedor");
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
router.post('/new', upload.fields([
    { name: 'comprobante', maxCount: 1 },
    { name: 'imagen_local', maxCount: 1 },
    { name: 'imagen_productos', maxCount: 1 },
]), emprendedor_1.crearEmprendedor);
router.get('/list', emprendedor_1.getEmprendedores);
router.get('/:rut_emprendedor', emprendedor_1.getEmprendedor);
router.put('/:rut_emprendedor', emprendedor_1.updateEmprendedor);
exports.default = router;

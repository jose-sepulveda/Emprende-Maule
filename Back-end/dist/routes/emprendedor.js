"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const emprendedor_1 = require("../controllers/emprendedor");
const auth_1 = __importDefault(require("../middlewares/auth"));
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
router.post('/login', emprendedor_1.loginEmprendedor);
router.get('/list', auth_1.default, emprendedor_1.getEmprendedores);
router.get('/:rut_emprendedor', auth_1.default, emprendedor_1.getEmprendedor);
router.put('/:rut_emprendedor', auth_1.default, emprendedor_1.updateEmprendedor);
router.delete('/:rut_emprendedor', auth_1.default, emprendedor_1.deleteEmprendedor);
router.patch('/password', auth_1.default, emprendedor_1.updatePassword);
router.patch('/estado', auth_1.default, emprendedor_1.updateEstadoEmprendedor);
router.post('/recuperar', emprendedor_1.recuperarContrasenaEmprendedor);
router.post('/reset-password-emprendedor/:token', emprendedor_1.resetPasswordEmprendedor);
router.get('/estado', emprendedor_1.getEmprendedoresPorEstado);
router.get('/id/:id_emprendedor', emprendedor_1.getEmprendedorById);
exports.default = router;
